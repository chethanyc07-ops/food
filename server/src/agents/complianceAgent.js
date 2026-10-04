/**
 * Compliance Agent: Checks FSSAI / FDA safety standards and physical feasibility
 */
class ComplianceAgent {
  static evaluate({ commodity, material }) {
    const warnings = [];
    const complianceNotes = [];
    let isCompliant = true;
    let score = 100;

    // 1. Regulatory Status
    if (!material.fssaiCompliant) {
      warnings.push('Material lacks verified FSSAI Food Contact certification');
      score -= 30;
      isCompliant = false;
    } else {
      complianceNotes.push('FSSAI Food Contact Regulation (IS 9845 / IS 10146) Compliant');
    }

    if (!material.fdaApproved) {
      warnings.push('Not FDA 21 CFR §177 cleared for direct food contact');
      score -= 20;
    } else {
      complianceNotes.push('FDA 21 CFR §177 approved for food packaging');
    }

    // 2. Temperature tolerance check
    const commMinTemp = commodity.optimalStorageTempMin ?? 4;
    const commMaxTemp = commodity.optimalStorageTempMax ?? 25;

    if (material.minTemp > commMinTemp) {
      warnings.push(`Material brittle limit (${material.minTemp}°C) exceeds required storage min (${commMinTemp}°C)`);
      score -= 25;
    }
    if (material.maxTemp < commMaxTemp) {
      warnings.push(`Material heat tolerance (${material.maxTemp}°C) is below storage/processing upper bound (${commMaxTemp}°C)`);
      score -= 25;
    }

    // 3. Puncture and mechanical suitability
    if (commodity.category === 'Meat & Poultry' || commodity.category === 'Seafood') {
      if (material.punctureResistance === 'Low') {
        warnings.push('Low puncture resistance creates high pinhole/leakage risk for bone-in or rigid cuts');
        score -= 20;
      }
    }

    return {
      complianceScore: Math.max(0, Math.min(100, score)),
      isCompliant,
      complianceNotes,
      warnings,
    };
  }
}

module.exports = ComplianceAgent;
