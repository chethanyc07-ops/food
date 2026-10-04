/**
 * Barrier Evaluation Agent: Computes scientific barrier scores for materials vs commodity sensitivities
 */
class BarrierEvaluationAgent {
  static evaluate({ commodity, material, plan }) {
    const { barrierWeights } = plan;
    let o2Score = 100;
    let moistureScore = 100;
    let lightScore = 100;
    let respirationScore = 100;

    // 1. Oxygen Barrier Scoring (Lower OTR is better for high O2 sensitivity)
    // OTR thresholds: Superior < 1, Excellent 1-10, Good 10-50, Fair 50-150, Poor > 150
    const otr = material.otrValue ?? 50;
    if (commodity.oxygenSensitivity === 'Critical') {
      if (otr <= 1.0) o2Score = 100;
      else if (otr <= 5.0) o2Score = 85;
      else if (otr <= 20.0) o2Score = 65;
      else if (otr <= 80.0) o2Score = 35;
      else o2Score = 15;
    } else if (commodity.oxygenSensitivity === 'High') {
      if (otr <= 5.0) o2Score = 100;
      else if (otr <= 25.0) o2Score = 85;
      else if (otr <= 100.0) o2Score = 60;
      else o2Score = 30;
    } else if (commodity.oxygenSensitivity === 'Medium') {
      if (otr <= 50.0) o2Score = 95;
      else if (otr <= 200.0) o2Score = 75;
      else o2Score = 55;
    } else {
      o2Score = 90; // Low sensitivity
    }

    // 2. Moisture Barrier Scoring (Lower WVTR is better for high moisture sensitivity)
    // WVTR thresholds: Superior < 0.5, Excellent 0.5-3, Good 3-10, Fair 10-30, Poor > 30
    const wvtr = material.wvtrValue ?? 10;
    if (commodity.moistureSensitivity === 'Critical') {
      if (wvtr <= 0.5) moistureScore = 100;
      else if (wvtr <= 2.0) moistureScore = 85;
      else if (wvtr <= 6.0) moistureScore = 60;
      else if (wvtr <= 15.0) moistureScore = 30;
      else moistureScore = 10;
    } else if (commodity.moistureSensitivity === 'High') {
      if (wvtr <= 2.0) moistureScore = 100;
      else if (wvtr <= 8.0) moistureScore = 85;
      else if (wvtr <= 20.0) moistureScore = 60;
      else moistureScore = 35;
    } else if (commodity.moistureSensitivity === 'Medium') {
      if (wvtr <= 15.0) moistureScore = 95;
      else if (wvtr <= 40.0) moistureScore = 75;
      else moistureScore = 50;
    } else {
      moistureScore = 90;
    }

    // 3. Light Barrier Scoring
    // Light transmission: 0% = opaque block, 100% = clear transparent
    const trans = material.lightTransmissionPercent ?? 30;
    if (commodity.lightSensitivity === 'Critical') {
      if (trans <= 1) lightScore = 100;
      else if (trans <= 10) lightScore = 80;
      else if (trans <= 30) lightScore = 50;
      else lightScore = 20;
    } else if (commodity.lightSensitivity === 'High') {
      if (trans <= 5) lightScore = 100;
      else if (trans <= 25) lightScore = 80;
      else if (trans <= 50) lightScore = 60;
      else lightScore = 35;
    } else if (commodity.lightSensitivity === 'Medium') {
      if (trans <= 40) lightScore = 95;
      else lightScore = 75;
    } else {
      lightScore = 90;
    }

    // 4. Respiration Compatibility (for fresh fruits/veggies)
    // If commodity has high respiration, hermetic/zero OTR can cause anaerobic decay unless active micro-perforation or selective breathable film is used
    if (commodity.respirationRate && commodity.respirationRate !== 'None') {
      if (commodity.respirationRate === 'High' || commodity.respirationRate === 'Very High') {
        if (material.category.includes('Active & MAP') || material.name.includes('Perforated') || material.name.includes('BOPP') || material.category.includes('Bio-polymers')) {
          respirationScore = 100;
        } else if (material.otrValue < 5) {
          // Extreme barrier without breathability risks fermentation
          respirationScore = 40;
        } else {
          respirationScore = 80;
        }
      }
    }

    // Weighted barrier aggregate
    const totalBarrierWeight = barrierWeights.o2 + barrierWeights.moisture + barrierWeights.light + 1;
    const aggregateBarrierScore = Math.round(
      (o2Score * barrierWeights.o2 +
        moistureScore * barrierWeights.moisture +
        lightScore * barrierWeights.light +
        respirationScore * 1) /
        totalBarrierWeight
    );

    return {
      aggregateBarrierScore: Math.max(10, Math.min(100, aggregateBarrierScore)),
      breakdown: {
        o2Score,
        moistureScore,
        lightScore,
        respirationScore,
      },
      details: {
        otr: material.otrValue,
        wvtr: material.wvtrValue,
        lightTrans: material.lightTransmissionPercent,
      },
    };
  }
}

module.exports = BarrierEvaluationAgent;
