const { GoogleGenAI } = require('@google/genai');
const config = require('../config/env');

let ai = null;
if (config.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  } catch (err) {
    console.warn('[GeminiService] Initialization warning:', err.message);
  }
}

class GeminiService {
  static isConfigured() {
    return Boolean(config.GEMINI_API_KEY && ai);
  }

  static async generateExplanation({ commodity, material, metrics, context }) {
    if (!this.isConfigured() || !ai) {
      return null;
    }

    try {
      const prompt = `
You are a Senior Food Packaging Scientist advising the Ministry of Food Processing Industries (MoFPI).
Provide a concise, professional 2-3 sentence technical justification for using "${material.name}" to package "${commodity.name}".

Commodity Details:
- Category: ${commodity.category}
- Oxygen Sensitivity: ${commodity.oxygenSensitivity}
- Moisture Sensitivity: ${commodity.moistureSensitivity}
- Light Sensitivity: ${commodity.lightSensitivity}
- Baseline Shelf Life: ${commodity.baselineShelfLifeDays} days

Material Specs:
- Category: ${material.category}
- OTR: ${material.otrValue} cc/m²·day·atm
- WVTR: ${material.wvtrValue} g/m²·day
- Light Transmission: ${material.lightTransmissionPercent}%
- Cost Index: ${material.costIndex}/10, Recyclability: ${material.recyclabilityScore}/10

Calculated Metrics:
- Overall Compatibility Score: ${metrics.overallScore}/100
- Estimated Shelf Life: ${metrics.estimatedShelfLifeDays} days (${metrics.shelfLifeMultiplier}x increase)
- Barrier Match: ${metrics.barrierScore}/100

Format output as a direct, rigorous scientific explanation emphasizing barrier physics, preservation mechanism, and practical commercial packaging format recommendation.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text ? response.text.trim() : null;
    } catch (error) {
      console.warn('[GeminiService] Explanation generation failed:', error.message);
      return null;
    }
  }

  static async chat({ query, history, commodities, materials }) {
    if (!this.isConfigured() || !ai) {
      return null;
    }

    try {
      const contextSummary = `
You are FoodPack AI, the Intelligent Food Packaging Advisor for the Ministry of Food Processing Industries (MoFPI).
You have access to the official packaging database with ${commodities.length} commodities and ${materials.length} verified packaging materials.

Available Materials:
${materials.map((m) => `- ${m.name} (${m.category}): OTR=${m.otrValue}, WVTR=${m.wvtrValue}, Recyclability=${m.recyclabilityScore}/10, Cost=${m.costIndex}/10`).join('\n')}

Available Commodities:
${commodities.map((c) => `- ${c.name} (${c.category}): O2=${c.oxygenSensitivity}, Moisture=${c.moistureSensitivity}, Baseline=${c.baselineShelfLifeDays}d`).join('\n')}

Instructions:
- Provide accurate, food-science backed recommendations based on MoFPI standards and ASTM/ISO packaging specs.
- Always explain the preservation mechanism (gas barrier, moisture migration, light shielding, active scavenging).
- Suggest practical packaging formats (e.g. nitrogen flush MAP, retort pouch, thermoformed tray, compostable pouch).
- Format responses cleanly with bullet points and bold key terms.
      `;

      const prompt = `${contextSummary}\n\nUser Question: ${query}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text ? response.text.trim() : null;
    } catch (error) {
      console.warn('[GeminiService] Chat generation failed:', error.message);
      return null;
    }
  }
}

module.exports = GeminiService;
