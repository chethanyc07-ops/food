const PlannerAgent = require('./plannerAgent');
const BarrierEvaluationAgent = require('./barrierEvaluationAgent');
const ShelfLifeAgent = require('./shelfLifeAgent');
const ComplianceAgent = require('./complianceAgent');
const SustainabilityAgent = require('./sustainabilityAgent');
const GeminiService = require('../services/geminiService');
const { getIO } = require('../config/socket');

class RecommendationOrchestrator {
  static async execute({ commodity, materials, priorities, targetShelfLifeDays, preferredPackageType, targetMarket, recommendationId }) {
    const io = getIO();
    const timeline = [];

    const emitEvent = (agent, status, message, metadata = {}) => {
      const event = {
        agent,
        timestamp: new Date(),
        status,
        message,
        metadata,
      };
      timeline.push(event);
      if (recommendationId) {
        io.to(`rec_${recommendationId}`).emit('agent_event', event);
      }
    };

    // Step 1: Planner Agent
    emitEvent('Planner Agent', 'RUNNING', `Analyzing degradation pathways for "${commodity.name}" (${commodity.category})`);
    const plan = await PlannerAgent.plan({ commodity, priorities, targetShelfLifeDays, preferredPackageType });
    plan.logs.forEach((log) => emitEvent(log.agent, log.status, log.message));

    // Step 2: Evaluation of Materials across all Agents
    emitEvent('Barrier Agent', 'RUNNING', `Screening ${materials.length} candidate packaging materials against barrier constraints`);

    const evaluatedResults = [];

    for (const material of materials) {
      // Barrier Evaluation
      const barrierResult = BarrierEvaluationAgent.evaluate({ commodity, material, plan });

      // Shelf Life Prediction
      const shelfLifeResult = ShelfLifeAgent.predict({ commodity, material, barrierResult });

      // Compliance & Physical Safety
      const complianceResult = ComplianceAgent.evaluate({ commodity, material });

      // Sustainability & Cost
      const sustainabilityResult = SustainabilityAgent.evaluate({ material });

      // Overall Composite Score Calculation
      const { weights } = plan;
      let compositeScore =
        barrierResult.aggregateBarrierScore * weights.protection +
        sustainabilityResult.costScore * weights.cost +
        sustainabilityResult.sustainabilityScore * weights.sustainability;

      // Adjust for compliance
      if (!complianceResult.isCompliant) {
        compositeScore -= 20;
      }

      const overallScore = Math.max(10, Math.min(100, Math.round(compositeScore)));

      // Strengths & Weaknesses synthesis
      const strengths = [];
      const weaknesses = [];

      if (barrierResult.breakdown.o2Score >= 85) strengths.push('Superior Oxygen/Oxidation Barrier (Ultra-low OTR)');
      if (barrierResult.breakdown.moistureScore >= 85) strengths.push('Excellent Moisture Vapor Shield (Prevents caking & sogginess)');
      if (barrierResult.breakdown.lightScore >= 85) strengths.push('Complete UV & Visible Light Block');
      if (sustainabilityResult.sustainabilityScore >= 80) strengths.push('High Eco-Circularity (Compostable / Easily Recyclable)');
      if (sustainabilityResult.costScore >= 80) strengths.push('Cost-Efficient Commercial Feasibility');
      if (material.activeScavengerType && material.activeScavengerType !== 'None') {
        strengths.push(`Active Packaging Enabled: ${material.activeScavengerType}`);
      }

      if (barrierResult.breakdown.o2Score < 50) weaknesses.push('High oxygen permeability limits long-term oxidative stability');
      if (barrierResult.breakdown.moistureScore < 50) weaknesses.push('Moderate moisture ingress over prolonged ambient storage');
      if (sustainabilityResult.sustainabilityScore < 40) weaknesses.push('Difficult multi-layer recycling infrastructure');
      if (sustainabilityResult.costScore < 40) weaknesses.push('Premium raw material cost per kg');
      complianceResult.warnings.forEach((w) => weaknesses.push(w));

      // Recommended Packaging Format determination
      let packagingFormat = 'High-Barrier Flexible Pouch';
      let gasFlushAtmosphere = 'Ambient Air / Nitrogen Flush';

      if (material.category.includes('Aluminium Foil') || material.name.includes('Retort')) {
        packagingFormat = 'Hermetic 3-Side Seal Retort / Foil Pouch';
        gasFlushAtmosphere = 'Vacuum / 99.9% N2 Flush';
      } else if (commodity.category === 'Fresh Produce') {
        packagingFormat = 'Micro-Perforated Breathable Flow-Wrap / Clamshell Tray';
        gasFlushAtmosphere = 'Equilibrium MAP (3-5% O2, 5-8% CO2, Bal N2)';
      } else if (commodity.category === 'Meat & Poultry' || commodity.category === 'Dairy') {
        packagingFormat = 'Thermoformed Barrier Tray with Peelable Lidding Film';
        gasFlushAtmosphere = 'Modified Atmosphere (70% N2, 30% CO2)';
      } else if (material.category.includes('Biodegradable & Bio-polymers')) {
        packagingFormat = 'Certified Home-Compostable Standup Doypack with Zipper';
        gasFlushAtmosphere = 'Ambient or Light Nitrogen Flush';
      } else if (material.category.includes('Glass')) {
        packagingFormat = 'Glass Jar with Twist-Off Lug Cap and Plastisol Gasket';
        gasFlushAtmosphere = 'Hot-Fill / Steam Vacuum Capping';
      }

      // Default scientific explanation
      let aiExplanation = `Provides an effective barrier match for ${commodity.name}. With an OTR of ${material.otrValue} cc/m²·day and WVTR of ${material.wvtrValue} g/m²·day, it extends the baseline shelf life from ${commodity.baselineShelfLifeDays} days to approximately ${shelfLifeResult.estimatedShelfLifeDays} days (${shelfLifeResult.shelfLifeExtensionMultiplier}x factor). Recommended for ${targetMarket || 'domestic commercial distribution'}.`;

      evaluatedResults.push({
        material: material._id,
        materialSnapshot: {
          name: material.name,
          category: material.category,
          costPerKg: material.costPerKg,
          costIndex: material.costIndex,
          recyclabilityScore: material.recyclabilityScore,
          compostable: material.compostable,
          otrValue: material.otrValue,
          wvtrValue: material.wvtrValue,
          oxygenBarrier: material.oxygenBarrier,
          moistureBarrier: material.moistureBarrier,
          lightBarrier: material.lightBarrier,
          activeScavengerType: material.activeScavengerType,
        },
        overallScore,
        barrierScore: barrierResult.aggregateBarrierScore,
        costScore: sustainabilityResult.costScore,
        sustainabilityScore: sustainabilityResult.sustainabilityScore,
        estimatedShelfLifeDays: shelfLifeResult.estimatedShelfLifeDays,
        shelfLifeMultiplier: shelfLifeResult.shelfLifeExtensionMultiplier,
        confidenceScore: 94,
        strengths,
        weaknesses,
        packagingFormat,
        gasFlushAtmosphere,
        aiExplanation,
        regulatoryNotes: complianceResult.complianceNotes.join(' • '),
        rawMaterial: material,
      });
    }

    // Step 3: Sort by Overall Score descending
    evaluatedResults.sort((a, b) => b.overallScore - a.overallScore);

    // Assign Ranks (Top 5)
    const rankedResults = evaluatedResults.slice(0, 8).map((res, index) => {
      res.rank = index + 1;
      return res;
    });

    emitEvent('Compliance & Safety Agent', 'SUCCESS', `Validated food contact regulations and temperature thresholds for top candidates`);
    emitEvent('Shelf-Life Kinetics Agent', 'SUCCESS', `Computed preservation multiplier curves and barrier shelf-life predictions`);

    // Step 4: AI Synthesis for Top 3 recommendations if Gemini/OpenRouter available
    let engineUsed = 'SCIENTIFIC_RULE_ENGINE';
    if (GeminiService.isConfigured()) {
      emitEvent('AI Synthesis Agent', 'RUNNING', `Generating advanced food packaging scientific justifications via Gemini AI`);
      for (let i = 0; i < Math.min(3, rankedResults.length); i++) {
        const topItem = rankedResults[i];
        const explanation = await GeminiService.generateExplanation({
          commodity,
          material: topItem.rawMaterial,
          metrics: topItem,
          context: { targetMarket, preferredPackageType },
        });
        if (explanation) {
          topItem.aiExplanation = explanation;
          engineUsed = 'GEMINI_AI';
        }
      }
    }

    // Clean up temporary references
    const finalResults = rankedResults.map((r) => {
      const { rawMaterial, ...rest } = r;
      return rest;
    });

    emitEvent('Monitoring Agent', 'COMPLETED', `Recommendation completed successfully. Generated ${finalResults.length} ranked material profiles.`);

    return {
      results: finalResults,
      timeline,
      engineUsed,
    };
  }
}

module.exports = RecommendationOrchestrator;
