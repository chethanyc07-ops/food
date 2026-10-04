/**
 * Planner Agent: Formulates evaluation plan based on commodity characteristics and priorities.
 */
class PlannerAgent {
  static async plan({ commodity, priorities, targetShelfLifeDays, preferredPackageType }) {
    const logs = [];
    logs.push({
      agent: 'Planner Agent',
      status: 'INITIALIZED',
      message: `Analyzing commodity "${commodity.name}" (${commodity.category}) requirements.`,
    });

    // Sensitivity weights
    const sensitivityMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
    const o2Weight = sensitivityMap[commodity.oxygenSensitivity] || 2;
    const moistureWeight = sensitivityMap[commodity.moistureSensitivity] || 2;
    const lightWeight = sensitivityMap[commodity.lightSensitivity] || 1;
    const tempWeight = sensitivityMap[commodity.temperatureSensitivity] || 2;

    // Normalize user priorities
    const totalPriority = (priorities.protection || 50) + (priorities.cost || 25) + (priorities.sustainability || 25);
    const protectionNorm = ((priorities.protection || 50) / totalPriority) * 100;
    const costNorm = ((priorities.cost || 25) / totalPriority) * 100;
    const sustainabilityNorm = ((priorities.sustainability || 25) / totalPriority) * 100;

    const criticalRisks = [];
    if (commodity.oxygenSensitivity === 'Critical' || commodity.oxygenSensitivity === 'High') {
      criticalRisks.push('High vulnerability to lipid oxidation & aerobic rancidity (Low OTR required)');
    }
    if (commodity.moistureSensitivity === 'Critical' || commodity.moistureSensitivity === 'High') {
      criticalRisks.push('High hygroscopic caking or crispness loss (Ultra-low WVTR required)');
    }
    if (commodity.respirationRate && commodity.respirationRate !== 'None') {
      criticalRisks.push(`Living produce with ${commodity.respirationRate} respiration rate: requires selective gas transmission or perforation to prevent anaerobic fermentation.`);
    }
    if (commodity.lightSensitivity === 'Critical' || commodity.lightSensitivity === 'High') {
      criticalRisks.push('Photo-oxidation risk for pigments/vitamins (High opacity / metallized barrier required)');
    }

    logs.push({
      agent: 'Planner Agent',
      status: 'PLAN_READY',
      message: `Evaluation strategy configured: Protection Weight: ${protectionNorm.toFixed(0)}%, Cost Weight: ${costNorm.toFixed(0)}%, Eco Weight: ${sustainabilityNorm.toFixed(0)}%. Identified ${criticalRisks.length} critical factors.`,
    });

    return {
      weights: {
        protection: protectionNorm / 100,
        cost: costNorm / 100,
        sustainability: sustainabilityNorm / 100,
      },
      barrierWeights: {
        o2: o2Weight,
        moisture: moistureWeight,
        light: lightWeight,
        temperature: tempWeight,
      },
      criticalRisks,
      preferredPackageType: preferredPackageType || 'Any Format',
      logs,
    };
  }
}

module.exports = PlannerAgent;
