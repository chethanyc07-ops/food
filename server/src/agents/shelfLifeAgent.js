/**
 * Shelf Life Agent: Estimates shelf-life extension and kinetics multiplier
 */
class ShelfLifeAgent {
  static predict({ commodity, material, barrierResult }) {
    const baseline = commodity.baselineShelfLifeDays || 10;
    const barrierScore = barrierResult.aggregateBarrierScore || 50;

    // Shelf life multiplier calculation based on barrier match and active scavenger technologies
    let multiplier = 1.0;

    // Barrier influence
    if (barrierScore >= 95) multiplier += 2.5;
    else if (barrierScore >= 85) multiplier += 1.8;
    else if (barrierScore >= 70) multiplier += 1.2;
    else if (barrierScore >= 55) multiplier += 0.6;
    else if (barrierScore < 40) multiplier -= 0.3; // poor barrier may accelerate degradation vs ideal

    // Active packaging bonus (oxygen absorbers, MAP flush, antimicrobial coating)
    if (material.activeScavengerType && material.activeScavengerType !== 'None') {
      multiplier += 0.8;
    }

    // Vacuum / Hermetic seal bonus for oxygen sensitive items
    if (material.category.includes('Aluminium Foil') || material.category.includes('Glass')) {
      if (commodity.oxygenSensitivity === 'Critical' || commodity.fatOxidationRisk === 'Critical') {
        multiplier += 1.0;
      }
    }

    // Produce respiration check: high barrier with no breathability reduces shelf life
    if ((commodity.respirationRate === 'High' || commodity.respirationRate === 'Very High') && material.otrValue < 5) {
      multiplier = Math.max(0.5, multiplier * 0.6); // anaerobic spoilage penalty
    }

    // Ensure multiplier is within reasonable food science bounds (0.5x to 6.0x)
    multiplier = Math.max(0.5, Math.min(6.0, Number(multiplier.toFixed(2))));

    const estimatedDays = Math.round(baseline * multiplier);

    return {
      estimatedShelfLifeDays: estimatedDays,
      shelfLifeExtensionMultiplier: multiplier,
      daysGained: estimatedDays - baseline,
    };
  }
}

module.exports = ShelfLifeAgent;
