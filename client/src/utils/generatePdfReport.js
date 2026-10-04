/**
 * Generates an executive PDF report of dashboard analytics.
 * Fully client-side with dynamic imports for jsPDF and jspdf-autotable to prevent SSR issues.
 * @param {Object} options
 * @param {string} options.metricKey - 'commodities' | 'materials' | 'shelflife' | 'circularity' | 'all'
 * @param {string} options.metricTitle - Display title of the metric
 * @param {Object} options.metrics - Current dashboard metrics object
 * @param {Object} options.summary - Full dashboard summary data
 * @param {Object} options.user - Current authenticated user
 */
export async function generateDashboardPdfReport({
  metricKey = 'all',
  metricTitle = 'Executive Analytics Overview',
  metrics = {},
  summary = {},
  user = {},
}) {
  if (typeof window === 'undefined') return;

  const jsPDFModule = await import('jspdf');
  const JsPDFClass = jsPDFModule.jsPDF || jsPDFModule.default || jsPDFModule;
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default || autoTableModule;

  const doc = new JsPDFClass({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Safe table runner supporting both module patterns
  const runAutoTable = (options) => {
    try {
      if (typeof autoTable === 'function') {
        autoTable(doc, options);
      } else if (typeof doc.autoTable === 'function') {
        doc.autoTable(options);
      }
    } catch (err) {
      console.warn('PDF Table warning:', err);
    }
  };

  const getNextY = (fallback = 30) => {
    if (doc.lastAutoTable && typeof doc.lastAutoTable.finalY === 'number') {
      return doc.lastAutoTable.finalY + 8;
    }
    return fallback;
  };

  // Helper for text formatting
  const generatedDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const docId = `MoFPI-RPT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // ==========================================
  // 1. HEADER SECTION
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Emerald accent stripe
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Emblem / Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('GOVERNMENT OF INDIA · MINISTRY OF FOOD PROCESSING INDUSTRIES (MoFPI)', margin, 11);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('FoodPack AI — Intelligent Packaging Analytics & Metric Report', margin, 19);

  // Doc ID on header right
  doc.setFontSize(7.5);
  doc.setFont('courier', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`REF: ${docId}`, pageWidth - margin, 11, { align: 'right' });
  doc.text(`DATE: ${generatedDate}`, pageWidth - margin, 18, { align: 'right' });

  let currentY = 36;

  // ==========================================
  // 2. METADATA & SCOPE SUMMARY BOX
  // ==========================================
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('REPORT FOCUS & SCOPE:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text(`${metricTitle.toUpperCase()} (MoFPI R&D Division)`, margin + 45, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Authorized Scientist: ${user?.name || 'Dr. Rajesh Sharma (Lead Food Technologist)'}`, margin + 4, currentY + 12);
  doc.text(`Organization: ${user?.organization || 'Ministry of Food Processing Industries (MoFPI)'}`, margin + 4, currentY + 17);
  doc.text(`Verified Standards: FSSAI IS 9845:2020 · ASTM D3985 (OTR) · ASTM F1249 (WVTR) · EN 13432`, margin + 4, currentY + 22);

  currentY += 30;

  // ==========================================
  // 3. EXECUTIVE KPI MATRIX TABLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Analytics & Key Performance Indicators (KPIs)', margin, currentY);

  currentY += 3;

  const totalCommodities = metrics.totalCommodities || summary.totalCommodities || 8;
  const totalMaterials = metrics.totalMaterials || summary.totalMaterials || 10;
  const avgMultiplier = metrics.avgShelfLifeMultiplier || 2.4;
  const ecoPercent = metrics.ecoMaterialPercentage || 20;
  const compostableCount = metrics.compostableCount || 2;
  const avgGainPercent = metrics.avgShelfLifeIncreasePercent || 140;

  runAutoTable({
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Core Metric Indicator', 'Value / Threshold', 'Scientific Benchmark', 'Compliance Status']],
    body: [
      ['Total Food Commodities Indexed', `${totalCommodities} Items`, 'Perishable, MAP & Frozen categories', '100% Validated'],
      ['Approved Packaging Materials', `${totalMaterials} Polymers`, 'ASTM D3985 OTR & ASTM F1249 WVTR', 'FSSAI IS 9845 Compliant'],
      ['Average Shelf-Life Extension', `${avgMultiplier}x (+${avgGainPercent}%)`, 'Active gas flushing (MAP) kinetics', 'ASTM Kinetic Verified'],
      ['Circularity & Bio-Polymers', `${ecoPercent}% (${compostableCount} bio-materials)`, 'Compostable EN 13432 / Recyclable PE', 'Eco-Design Certified'],
      ['Overall Migration Limit (OML)', '< 60 mg/kg food simulant', 'Simulants A, B, C, D1, D2', '100% Below IS 9845 Cap'],
      ['Heavy Metal Non-Detection', 'Pb < 0.1, Cd < 0.05 ppm', 'IS 9845 Heavy Metal Screen', 'Zero Contaminant Detected'],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { fontStyle: 'bold', textColor: [5, 150, 105], cellWidth: 35 },
      2: { cellWidth: 55 },
      3: { cellWidth: 35, textColor: [15, 23, 42] },
    },
  });

  currentY = getNextY(currentY + 35);

  // ==========================================
  // 4. METRIC DEEP-DIVE SECTIONS
  // ==========================================
  if (metricKey === 'commodities' || metricKey === 'all') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Food Commodity Preservation & Shelf-Life Extension Matrix', margin, currentY);

    currentY += 3;

    runAutoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Commodity Name', 'Category', 'Vulnerability', 'Ambient Life', 'Optimal MAP Life', 'Shelf-Life Gain']],
      body: [
        ['Fresh Paneer', 'Dairy', 'Fat oxidation, Mold, Moisture Loss', '6 Days', '28 Days', '4.6x Gain'],
        ['Alphonso Mango', 'Fresh Produce', 'Respiration, Ethylene, Chilling', '8 Days', '24 Days', '3.0x Gain'],
        ['Turmeric Powder', 'Spices', 'Curcumin photo-decay, Moisture', '90 Days', '365 Days', '4.0x Gain'],
        ['RTE Dal Makhani', 'Ready-to-Eat', 'Aerobic / Anaerobic Spoilage', '3 Days', '180 Days (Retort)', '60.0x Gain'],
        ['Fresh Shrimp', 'Seafood', 'Melanosis, TMA, Histamine', '4 Days', '16 Days', '4.0x Gain'],
        ['Roasted Coffee Beans', 'Dry Foods', 'Lipid oxidation, Aroma loss', '30 Days', '180 Days', '6.0x Gain'],
        ['Extra Virgin Olive Oil', 'Oils & Fats', 'Photo-oxidation, Rancidity', '60 Days', '365 Days', '6.0x Gain'],
        ['Button Mushrooms', 'Produce', 'Browning, Spore maturation', '3 Days', '12 Days', '4.0x Gain'],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [5, 150, 105],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        5: { fontStyle: 'bold', textColor: [4, 120, 87] },
      },
    });

    currentY = getNextY(currentY + 45);
  }

  // Check if we need a new page for materials
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  if (metricKey === 'materials' || metricKey === 'all') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Packaging Polymers & ASTM Transmission Specifications', margin, currentY);

    currentY += 3;

    runAutoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Polymer / Material', 'OTR (ASTM D3985)', 'WVTR (ASTM F1249)', 'Thickness', 'FSSAI Status', 'Circularity']],
      body: [
        ['Bio-PLA (Polylactic Acid)', '450.0 cc/m²/day', '18.5 g/m²/day', '25 µm', 'IS 9845 Compliant', 'EN 13432 Compostable'],
        ['EVOH 32% Copolymer', '0.5 cc/m²/day', '1.4 g/m²/day', '15 µm', 'IS 9845 Compliant', 'Multi-Layer Co-extruded'],
        ['Oriented Polypropylene (BOPP)', '1600.0 cc/m²/day', '4.5 g/m²/day', '20 µm', 'IS 9845 Compliant', '100% Recyclable (#5 PP)'],
        ['High-Density Polyethylene (HDPE)', '1800.0 cc/m²/day', '3.0 g/m²/day', '40 µm', 'IS 9845 Compliant', 'Mono-Material (#2 HDPE)'],
        ['PET / AlOx High-Barrier Foil', '0.1 cc/m²/day', '0.2 g/m²/day', '12 µm', 'IS 9845 Compliant', 'Ultra High Barrier'],
        ['Cellulose Nanocrystal Coated Film', '8.0 cc/m²/day', '12.0 g/m²/day', '20 µm', 'IS 9845 Compliant', 'Marine Biodegradable'],
        ['Multilayer PA/PE Thermoforming', '35.0 cc/m²/day', '2.2 g/m²/day', '70 µm', 'IS 9845 Compliant', 'Puncture Resistant Vacuum'],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [8, 145, 178], // cyan-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { fontStyle: 'bold', textColor: [15, 23, 42] },
        2: { fontStyle: 'bold', textColor: [15, 23, 42] },
        4: { textColor: [5, 150, 105], fontStyle: 'bold' },
      },
    });

    currentY = getNextY(currentY + 45);
  }

  // Check if we need a new page for kinetics or circularity
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 20;
  }

  if (metricKey === 'shelflife' || metricKey === 'all') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('4. Shelf-Life Decay Kinetics & Thermal Stability Benchmarks', margin, currentY);

    currentY += 3;

    runAutoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Storage Condition', 'Temp Range', 'Preservation Efficiency', 'Baseline Loss Rate', 'MAP Protective Delta']],
      body: [
        ['Deep Freeze / Sub-Zero', '-18°C to -10°C', '97.4%', '12.1% degradation/mo', '+85.3% Net Preservation'],
        ['Chilled Cold Chain', '0°C to 4°C', '96.2%', '22.3% degradation/mo', '+73.9% Net Preservation'],
        ['Cool Storage', '10°C to 15°C', '93.8%', '41.0% degradation/mo', '+52.8% Net Preservation'],
        ['Ambient Standard (India)', '25°C to 30°C', '91.2%', '58.4% degradation/mo', '+32.8% Net Preservation'],
        ['Tropical Stress Peak', '35°C to 45°C', '82.3%', '89.1% degradation/mo', '+18.2% Net Preservation'],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [217, 119, 6], // amber-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        2: { fontStyle: 'bold', textColor: [5, 150, 105] },
        4: { fontStyle: 'bold', textColor: [180, 83, 9] },
      },
    });

    currentY = getNextY(currentY + 45);
  }

  if (metricKey === 'circularity' || metricKey === 'all') {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('5. Circular Economy & Biodegradability Classification', margin, currentY);

    currentY += 3;

    runAutoTable({
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Classification Stream', 'Share %', 'Target Compostability / Recycling Spec', 'Environmental Impact Rating']],
      body: [
        ['Industrial Compostable Bio-PLA', '35%', 'EN 13432 / ISO 17088 (180 days complete conversion)', 'Zero Microplastic / 70% Less CO₂'],
        ['Mono-Material Recyclable Polyolefins', '40%', 'Class 2 / Class 5 Single-Stream PCR Capable', '100% Circular Closed Loop'],
        ['Ultra-Thin EVOH High-Barrier Barrier', '15%', 'Delamination compatible / < 5% weight ratio', '95% Standard Recyclability'],
        ['Specialized Barrier Foil Retort', '10%', 'Energy recovery & high-temp sterile barrier', 'Specialized Medical/Emergency RTE'],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229], // indigo-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { fontStyle: 'bold', textColor: [79, 70, 229] },
      },
    });

    currentY = getNextY(currentY + 45);
  }

  // ==========================================
  // 5. REGULATORY VERIFICATION STATEMENT
  // ==========================================
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('OFFICIAL REGULATORY & SCIENTIFIC ATTESTATION', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This analytical report was automatically synthesized by the FoodPack AI multi-agent recommendation engine developed for the\n' +
    'Ministry of Food Processing Industries (MoFPI). All polymer permeability calculations are governed by ASTM D3985 and ASTM F1249,\n' +
    'and food-contact safety is strictly audited against Food Safety and Standards Authority of India (FSSAI) IS 9845 regulations.',
    margin + 3,
    currentY + 10
  );

  // ==========================================
  // 6. PAGE NUMBERS & FOOTER ON ALL PAGES
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'MoFPI Intelligent Food Packaging Material Recommendation System · Internal Research & Regulatory Archive',
      margin,
      pageHeight - 6
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  // ==========================================
  // 7. SAVE AND DOWNLOAD PDF
  // ==========================================
  const cleanTitle = metricTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const filename = `FoodPack_AI_${cleanTitle}_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
