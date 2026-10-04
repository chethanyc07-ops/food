/**
 * Sustainability Agent: Computes circular economy, recyclability, compostability, and economic cost scores
 */
class SustainabilityAgent {
  static evaluate({ material }) {
    // 1. Sustainability Score (0 - 100)
    let ecoScore = (material.recyclabilityScore || 5) * 10; // 1-10 -> 10-100

    if (material.compostable) {
      ecoScore = Math.min(100, ecoScore + 20);
    }
    if (material.category.includes('Biodegradable & Bio-polymers')) {
      ecoScore = Math.min(100, ecoScore + 15);
    }
    if (material.category.includes('Aluminium Foil') || material.category.includes('High-Barrier Barrier Laminate')) {
      // Multi-layer films are harder to recycle unless delamination technology is applied
      if (!material.sustainabilityNotes?.toLowerCase().includes('mono-material')) {
        ecoScore = Math.max(20, ecoScore - 15);
      }
    }

    // 2. Cost Score (0 - 100)
    // Lower cost index (1) -> highest score (100). Higher cost index (10) -> lowest score (10).
    const costIndex = material.costIndex || 5;
    const costScore = Math.round(110 - costIndex * 10);

    return {
      sustainabilityScore: Math.max(10, Math.min(100, Math.round(ecoScore))),
      costScore: Math.max(10, Math.min(100, costScore)),
      compostable: material.compostable || false,
      recyclabilityScore: material.recyclabilityScore || 5,
      costIndex: material.costIndex || 5,
    };
  }
}

module.exports = SustainabilityAgent;
