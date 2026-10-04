const Commodity = require('../models/Commodity');
const Material = require('../models/Material');
const ChatMessage = require('../models/ChatMessage');
const GeminiService = require('./geminiService');
const OpenRouterService = require('./openRouterService');
const RecommendationOrchestrator = require('../agents/orchestrator');

class AIChatService {
  static async processMessage({ userId, sessionId, message }) {
    // 1. Fetch relevant context from DB
    const [commodities, materials] = await Promise.all([
      Commodity.find().limit(15),
      Material.find().limit(25),
    ]);

    // Save user message
    await ChatMessage.create({
      user: userId,
      sessionId,
      role: 'user',
      content: message,
    });

    let assistantResponse = '';
    let referencedCommodity = null;
    let referencedMaterials = [];
    let engine = 'RULE_BASED_FOOD_SCIENTIST';

    // Try Gemini AI first
    if (GeminiService.isConfigured()) {
      const geminiReply = await GeminiService.chat({
        query: message,
        commodities,
        materials,
      });
      if (geminiReply) {
        assistantResponse = geminiReply;
        engine = 'GEMINI_AI';
      }
    }

    // Try OpenRouter AI second
    if (!assistantResponse && OpenRouterService.isConfigured()) {
      const openRouterReply = await OpenRouterService.generateChat({
        prompt: message,
        systemPrompt: `You are FoodPack AI for the Ministry of Food Processing Industries (MoFPI).
Database Materials: ${materials.map((m) => m.name).join(', ')}.
Database Commodities: ${commodities.map((c) => c.name).join(', ')}.
Provide rigorous food packaging advice with barrier physics and preservation recommendations.`,
      });
      if (openRouterReply) {
        assistantResponse = openRouterReply;
        engine = 'OPENROUTER_AI';
      }
    }

    // High-Intelligence Scientific Domain Fallback
    if (!assistantResponse) {
      assistantResponse = await this.generateIntelligentScientificResponse({
        message,
        commodities,
        materials,
      });
    }

    // Detect if specific commodity or materials were mentioned
    const lower = message.toLowerCase();
    const matchedComm = commodities.find((c) => lower.includes(c.name.toLowerCase()) || lower.includes(c.category.toLowerCase()));
    if (matchedComm) referencedCommodity = matchedComm._id;

    referencedMaterials = materials
      .filter((m) => lower.includes(m.name.toLowerCase()) || (m.tradeName && lower.includes(m.tradeName.toLowerCase())))
      .map((m) => m._id)
      .slice(0, 3);

    // Save assistant message
    const savedAssistantMsg = await ChatMessage.create({
      user: userId,
      sessionId,
      role: 'assistant',
      content: assistantResponse,
      referencedCommodity,
      referencedMaterials,
      metadata: { engine },
    });

    return {
      message: savedAssistantMsg,
      engine,
    };
  }

  static async getHistory(sessionId, userId) {
    return await ChatMessage.find({ sessionId, user: userId })
      .sort({ createdAt: 1 })
      .populate('referencedCommodity')
      .populate('referencedMaterials');
  }

  static async generateIntelligentScientificResponse({ message, commodities, materials }) {
    const query = message.toLowerCase();

    // 1. Spices / Dry Foods query
    if (query.includes('spice') || query.includes('turmeric') || query.includes('chili') || query.includes('powder') || query.includes('dry')) {
      const foilMat = materials.find((m) => m.category.includes('Aluminium Foil') || m.name.includes('PET/Al/PE')) || materials[0];
      const bioMat = materials.find((m) => m.category.includes('Bio') || m.compostable) || materials[1];
      return `### MoFPI Food Packaging Scientific Advisory: Dried Spices & Seasonings

For dried spices and powdered seasonings, the two primary degradation pathways are:
1. **Volatile Essential Oil Loss & Photo-Oxidation**: Curcumin in turmeric, piperine in pepper, and capsaicin in chili degrade rapidly under visible light and oxygen.
2. **Hygroscopic Moisture Caking**: Spices require water activity ($a_w$) below 0.60 to prevent fungal growth (Aspergillus flavus) and clumping.

#### Recommended Packaging Solutions:
- **Primary Recommendation:** **${foilMat?.name || 'PET / Aluminium Foil / Polyethylene (PET/Al/PE)'}**
  - **OTR:** 0.05 cc/m²·day (Superior Hermetic Barrier)
  - **WVTR:** 0.05 g/m²·day (Complete Moisture Ingress Prevention)
  - **Format:** Nitrogen-flushed Standup Pouch with Press-to-Close Zipper
  - **Shelf Life Extension:** Extends baseline from ~90 days to **365+ days** (4x gain).

- **Sustainable / Eco-Friendly Alternative:** **${bioMat?.name || 'PLA / High-Barrier Bio-film'}**
  - **Compostable:** Certified Home/Industrial Compostable
  - **Format:** Metal-free Bio-laminate pouch with paperboard exterior.

*Compliance: Fully conforms to FSSAI (IS 9845) Migration Limits for lipid-rich and acidic food contact.*`;
    }

    // 2. Dairy / Paneer / Cheese query
    if (query.includes('paneer') || query.includes('dairy') || query.includes('cheese') || query.includes('milk') || query.includes('curd')) {
      const evohMat = materials.find((m) => m.name.includes('EVOH') || m.category.includes('High-Barrier')) || materials[0];
      return `### MoFPI Food Packaging Advisory: Dairy & Fresh Paneer

Fresh cottage cheese (Paneer) has high moisture (50-60%) and neutral pH (5.6-6.0), making it highly susceptible to:
1. **Psychrotrophic Bacterial & Mold Spoilage**: Rapid deterioration under atmospheric oxygen.
2. **Lipolysis & Proteolysis**: Rancid off-flavor development from enzymatic fat breakdown.

#### Scientific Recommendations:
- **Optimal Packaging Material:** **${evohMat?.name || 'Co-extruded EVOH / PA / PE Multi-layer Barrier Film'}**
  - **Barrier Specs:** Ultra-low Oxygen Transmission (OTR < 2.5 cc/m²·day)
  - **Packaging Technology:** **Vacuum Shrink Pouch** or **Thermoformed MAP Tray** (Atmosphere: 70% N₂ + 30% CO₂).
  - **Estimated Shelf Life:** Extends from **5-7 days (ambient/chilled)** to **28-35 days** at 0-4°C.
  - **Key Benefit:** Prevents surface dehydration without moisture pooling.

*Recommendation: Store under continuous cold chain (0-4°C) with hermetic thermal heat-sealing.*`;
    }

    // 3. Fresh Produce / Fruits / Mango / Mushrooms
    if (query.includes('mango') || query.includes('fruit') || query.includes('vegetable') || query.includes('produce') || query.includes('mushroom')) {
      const mapMat = materials.find((m) => m.category.includes('Active & MAP') || m.name.includes('Perforated') || m.name.includes('BOPP')) || materials[0];
      return `### MoFPI Advisory: Fresh Produce & Respiration Management

Fresh produce remains biologically active post-harvest, consuming O₂ and producing CO₂, moisture, and ethylene ($C_2H_4$).
- **Hazard to Avoid:** Completely hermetic, zero-transmission films induce anaerobic respiration, leading to ethanol/acetaldehyde fermentation and rapid rot.

#### Recommended Packaging Solution:
- **Optimal Material:** **${mapMat?.name || 'Micro-Perforated BOPP Film / Equilibrium MAP Tray'}**
  - **Gas Permeability:** Tailored OTR (1,500 - 3,000 cc/m²·day) to achieve an Equilibrium Atmosphere of **3-5% O₂ and 5-8% CO₂**.
  - **Antifog Coating:** Prevents condensation water droplets that stimulate Botrytis mold.
  - **Shelf Life Extension:** Extends fresh market life from **7 days to 21+ days** under cold chain (8-12°C for tropical fruits).`;
    }

    // 4. Biodegradable & Sustainability query
    if (query.includes('biodegradable') || query.includes('sustainable') || query.includes('eco') || query.includes('plastic free') || query.includes('compostable') || query.includes('green')) {
      const bioMats = materials.filter((m) => m.compostable || m.category.includes('Bio'));
      return `### MoFPI Circular Economy & Bio-Polymer Guidelines

Transitioning from non-recyclable multi-material pouches (e.g. PET/Al/PE) to sustainable circular substrates:

#### Top Bio-based Packaging Options in Database:
${bioMats.map((b) => `1. **${b.name}** (Recyclability: ${b.recyclabilityScore}/10, Cost Index: ${b.costIndex}/10)
   - **Properties:** OTR ${b.otrValue} cc/m²·day, WVTR ${b.wvtrValue} g/m²·day.
   - **Circularity:** ${b.sustainabilityNotes || 'Certified compostable under ASTM D6400 / EN 13432.'}`).join('\n\n')}

#### Implementation Advice:
- For dry foods and bakery, **Bio-nanocomposite PLA / Cellulose films** provide adequate moisture and oxygen protection.
- For high-moisture/fatty foods, recommend **mono-material recyclable PE (BOPE/PE)** with EVOH barrier coatings for 100% kerbside recyclability.`;
    }

    // 5. General matching from database
    const topMats = materials.slice(0, 3);
    return `### MoFPI Food Packaging Intelligent Assistant

Based on your query: "${message}"

Here are key packaging engineering considerations:
1. **Barrier Requirement Evaluation:** Matching material Oxygen Transmission Rate (OTR) and Water Vapor Transmission Rate (WVTR) to the specific commodity shelf-life targets.
2. **Food Contact Safety:** Ensuring compliance with FSSAI Packaging Regulations (2018) and FDA 21 CFR standards.
3. **Circular Economics:** Balancing product shelf-life extension against packaging carbon footprint and end-of-life recyclability.

#### Featured Packaging Materials from Database:
${topMats.map((m) => `- **${m.name}** (${m.category}) | OTR: ${m.otrValue} | WVTR: ${m.wvtrValue} | Recyclability: ${m.recyclabilityScore}/10`).join('\n')}

*You can run a full multi-agent recommendation by navigating to the **Recommend** tab or selecting any commodity from the catalog.*`;
  }
}

module.exports = AIChatService;
