import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PRIMARY = [46, 117, 182];
const DARK = [15, 39, 68];
const RED = [229, 62, 62];
const AMBER = [214, 158, 46];
const GREEN = [56, 161, 105];
const LIGHT_GRAY = [247, 250, 252];
const MID_GRAY = [113, 128, 150];

function riskColor(level) {
  if (level === 'HIGH') return RED;
  if (level === 'MEDIUM') return AMBER;
  return GREEN;
}

function addHeader(doc, title, article, pageWidth) {
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 28, pageWidth, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);
  doc.text(article, 14, 21);
  doc.setTextColor(...DARK);
}

function addFooter(doc, pageWidth, pageHeight, systemName) {
  doc.setFillColor(240, 244, 248);
  doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...MID_GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(`EU AI Act Compliance Tool | ${systemName}`, 14, pageHeight - 5);
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
}

function addSectionTitle(doc, title, y) {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text(title, 14, y);
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 196, y + 2);
  doc.setTextColor(...DARK);
  return y + 10;
}

function addInfoRow(doc, label, value, x, y, pageWidth) {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...MID_GRAY);
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...DARK);
  const lines = doc.splitTextToSize(String(value), pageWidth - x - 20);
  doc.text(lines, x + 50, y);
  return y + lines.length * 5 + 3;
}

// ── FRIA PDF ──────────────────────────────────────────────────────────────────
export function generateFRIAPDF(data) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  addHeader(doc, 'Fundamental Rights Impact Assessment', 'Article 27 of the EU AI Act', pw);

  // Risk banner
  const color = riskColor(data.overall_risk_level);
  doc.setFillColor(...color);
  doc.roundedRect(14, 36, pw - 28, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Risk Level: ${data.overall_risk_level}`, 20, 47);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pw - 14, 47, { align: 'right' });
  doc.setTextColor(...DARK);

  // System info box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, 58, pw - 28, 28, 3, 3, 'F');
  let infoY = 66;
  infoY = addInfoRow(doc, 'System Name:', data.system_name, 18, infoY, pw);
  infoY = addInfoRow(doc, 'Organisation:', data.organisation, 18, infoY, pw);
  infoY = addInfoRow(doc, 'Assessment Type:', data.assessment_type, 18, infoY, pw);

  let y = 94;

  // Legal obligations
  y = addSectionTitle(doc, '1. Legal Obligations', y);
  if (data.obligations && data.obligations.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Article', 'Legal Requirement']],
      body: data.obligations.map(o => [o.article || '', o.requirement || '']),
      styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
      headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 125 } },
      alternateRowStyles: { fillColor: LIGHT_GRAY },
      margin: { left: 14, right: 14 }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // Rights assessment
  if (y > ph - 60) { doc.addPage(); addHeader(doc, 'FRIA - Continued', 'Article 27', pw); y = 40; }
  y = addSectionTitle(doc, '2. Fundamental Rights Assessment', y);

  autoTable(doc, {
    startY: y,
    head: [['Fundamental Right', 'Legal Basis', 'Impact Level', 'Justification', 'Mitigation Measure']],
    body: data.rights_assessed?.map(r => [
      r.right || '',
      r.description || '',
      r.impact_level || '',
      r.impact_justification || 'No specific impact identified',
      r.mitigation || 'No mitigation required'
    ]) || [],
    styles: { fontSize: 7.5, cellPadding: 3, textColor: DARK, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 38 },
      2: { cellWidth: 18 },
      3: { cellWidth: 50 },
      4: { cellWidth: 45 }
    },
    didDrawCell: (cellData) => {
      if (cellData.column.index === 2 && cellData.section === 'body') {
        const val = cellData.cell.raw;
        const c = val === 'HIGH' ? RED : val === 'MEDIUM' ? AMBER : GREEN;
        doc.setFillColor(...c);
        doc.roundedRect(cellData.cell.x + 1, cellData.cell.y + 1, cellData.cell.width - 2, cellData.cell.height - 2, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(val, cellData.cell.x + cellData.cell.width / 2, cellData.cell.y + cellData.cell.height / 2 + 1, { align: 'center' });
      }
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Recommendations
  if (y > ph - 60) { doc.addPage(); addHeader(doc, 'FRIA - Recommendations', 'Article 27', pw); y = 40; }
  y = addSectionTitle(doc, '3. Recommendations', y);

  data.recommendations?.forEach((rec, i) => {
    if (y > ph - 20) { doc.addPage(); addHeader(doc, 'FRIA - Recommendations', 'Article 27', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
    doc.setFillColor(235, 245, 251);
    const lines = doc.splitTextToSize(rec, pw - 50);
    const boxH = lines.length * 5 + 8;
    doc.roundedRect(14, y, pw - 28, boxH, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, 20, y + boxH / 2 + 1.5);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, 28, y + 6);
    y += boxH + 4;
  });

  addFooter(doc, pw, ph, data.system_name);
  doc.save(`FRIA_Report_${data.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── CYBERSECURITY PDF ─────────────────────────────────────────────────────────
export function generateCybersecurityPDF(data) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  addHeader(doc, 'Cybersecurity Threat Model', 'Article 15 of the EU AI Act', pw);

  const color = riskColor(data.overall_security_risk);
  doc.setFillColor(...color);
  doc.roundedRect(14, 36, pw - 28, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Security Risk: ${data.overall_security_risk}`, 20, 47);
  doc.text(`System: ${data.system_name}`, pw - 14, 47, { align: 'right' });
  doc.setTextColor(...DARK);

  // System info
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, 58, pw - 28, 14, 3, 3, 'F');
  addInfoRow(doc, 'Assessment Type:', data.assessment_type, 18, 66, pw);

  let y = 80;

  // STRIDE summary
  y = addSectionTitle(doc, '1. STRIDE Threat Category Summary', y);
  if (data.stride_summary && Object.keys(data.stride_summary).length > 0) {
    const strideRows = Object.entries(data.stride_summary).map(([cat, threats]) => [
      cat.replace('STRIDE_', ''),
      threats.join(', '),
      threats.length
    ]);
    autoTable(doc, {
      startY: y,
      head: [['STRIDE Category', 'Threats Identified', 'Count']],
      body: strideRows,
      styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
      headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 130 }, 2: { cellWidth: 16 } },
      alternateRowStyles: { fillColor: LIGHT_GRAY },
      margin: { left: 14, right: 14 }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  // All threats
  if (y > ph - 60) { doc.addPage(); addHeader(doc, 'Cybersecurity - Threats', 'Article 15', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
  y = addSectionTitle(doc, '2. Full Threat Assessment', y);

  autoTable(doc, {
    startY: y,
    head: [['Threat', 'Severity', 'STRIDE', 'Applicable', 'Article 15(5) Class', 'Details']],
    body: data.threats_identified?.map(t => [
      t.threat_name || '',
      t.severity || '',
      (t.stride_category || '').replace('STRIDE_', ''),
      t.applicable ? 'YES' : 'NO',
      t.stride_category === 'STRIDE_TAMPERING' ? 'Data/Model Poisoning' :
        t.stride_category === 'STRIDE_INFO_DISCLOSURE' ? 'Confidentiality Attack' :
          t.stride_category === 'STRIDE_SPOOFING' ? 'Adversarial Evasion' :
            t.stride_category === 'STRIDE_REPUDIATION' ? 'Model Flaw' :
              t.stride_category === 'STRIDE_DOS' ? 'Availability Attack' : 'Other',
      t.reason || t.description || ''
    ]) || [],
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: DARK, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 16 },
      2: { cellWidth: 22 },
      3: { cellWidth: 18 },
      4: { cellWidth: 30 },
      5: { cellWidth: 68 }
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Controls
  if (y > ph - 60) { doc.addPage(); addHeader(doc, 'Cybersecurity - Controls', 'Article 15', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
  y = addSectionTitle(doc, '3. Recommended ENISA FAICP Controls', y);

  autoTable(doc, {
    startY: y,
    head: [['Control Name', 'Description', 'Mitigates Threat']],
    body: data.controls_recommended?.map(c => [
      c.control || '',
      c.description || '',
      c.mitigates || ''
    ]) || [],
    styles: { fontSize: 8, cellPadding: 3, textColor: DARK, valign: 'top' },
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 44 }, 1: { cellWidth: 110 }, 2: { cellWidth: 32 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, pw, ph, data.system_name);
  doc.save(`Cybersecurity_Report_${data.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── XAI PDF ───────────────────────────────────────────────────────────────────
export function generateXAIPDF(data) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  addHeader(doc, 'Explainability Report (XAI)', 'Article 13 of the EU AI Act', pw);

  const compliant = data.compliance_status?.status === 'COMPLIANT';
  doc.setFillColor(...(compliant ? GREEN : RED));
  doc.roundedRect(14, 36, pw - 28, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Article 13 Status: ${data.compliance_status?.status || 'N/A'}`, 20, 47);
  doc.text(`System: ${data.system_name}`, pw - 14, 47, { align: 'right' });
  doc.setTextColor(...DARK);

  // Info box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, 58, pw - 28, 22, 3, 3, 'F');
  let infoY = 66;
  infoY = addInfoRow(doc, 'XAI Method:', data.method_used || 'N/A', 18, infoY, pw);
  addInfoRow(doc, 'Dataset:', data.dataset || 'N/A', 18, infoY, pw);

  let y = 88;

  // Compliance status detail
  y = addSectionTitle(doc, '1. Article 13 Compliance Status', y);
  autoTable(doc, {
    startY: y,
    head: [['Field', 'Value']],
    body: [
      ['Compliance Status', data.compliance_status?.status || 'N/A'],
      ['Explainability Method Implemented', data.compliance_status?.explainability_method || 'None'],
      ['Legal Requirement', data.compliance_status?.requirement || 'N/A'],
      ['XAI Method Used', data.method_used || 'N/A'],
      ['Dataset', data.dataset || 'N/A'],
    ],
    styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' }, 1: { cellWidth: 116 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Feature importance table
  y = addSectionTitle(doc, '2. Top Features Driving Credit Decisions', y);

  autoTable(doc, {
    startY: y,
    head: [['Rank', 'Feature Name', 'Description', 'Importance Score', 'Impact Level', 'Bias Risk']],
    body: data.top_features?.map((f, i) => [
      i + 1,
      f.feature || '',
      f.description || '',
      f.importance_score?.toFixed(4) || '0',
      f.impact || '',
      f.feature === 'personal_status' || f.feature === 'age' ? 'REVIEW - Protected attribute' :
        f.feature === 'foreign_worker' ? 'REVIEW - Potential proxy' : 'Low'
    ]) || [],
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: DARK, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 34 },
      2: { cellWidth: 72 },
      3: { cellWidth: 24 },
      4: { cellWidth: 18 },
      5: { cellWidth: 26 }
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Recommendations
  if (y > ph - 50) { doc.addPage(); addHeader(doc, 'XAI - Recommendations', 'Article 13', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
  y = addSectionTitle(doc, '3. Recommendations', y);

  data.recommendations?.forEach((rec, i) => {
    if (y > ph - 20) { doc.addPage(); addHeader(doc, 'XAI - Recommendations', 'Article 13', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
    doc.setFillColor(240, 255, 244);
    const lines = doc.splitTextToSize(rec, pw - 50);
    const boxH = lines.length * 5 + 8;
    doc.roundedRect(14, y, pw - 28, boxH, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...GREEN);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, 20, y + boxH / 2 + 1.5);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, 28, y + 6);
    y += boxH + 4;
  });

  addFooter(doc, pw, ph, data.system_name);
  doc.save(`XAI_Report_${data.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── RISK PDF ──────────────────────────────────────────────────────────────────
export function generateRiskPDF(data) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  addHeader(doc, 'Risk Scoring Dashboard', 'Article 9 of the EU AI Act', pw);

  const color = riskColor(data.overall_risk_level);
  doc.setFillColor(...color);
  doc.roundedRect(14, 36, pw - 28, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Risk Score: ${data.overall_risk_score}/10 (${data.overall_risk_level}) — ${data.risk_color}`, 20, 47);
  doc.text(`Article 9 Status: ${data.article_9_compliance?.status || 'N/A'}`, pw - 14, 47, { align: 'right' });
  doc.setTextColor(...DARK);

  // RAG summary boxes
  const boxes = [
    { label: 'HIGH RISKS', value: data.risk_summary?.high_risks, color: RED },
    { label: 'MEDIUM RISKS', value: data.risk_summary?.medium_risks, color: AMBER },
    { label: 'LOW RISKS', value: data.risk_summary?.low_risks, color: GREEN },
    { label: 'TOTAL RISKS', value: data.risk_summary?.total_risks, color: PRIMARY },
    { label: 'OVERALL SCORE', value: `${data.overall_risk_score}/10`, color: DARK },
  ];
  const boxW = (pw - 28) / boxes.length;
  boxes.forEach((b, i) => {
    const x = 14 + i * boxW;
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(x, 58, boxW - 2, 22, 2, 2, 'F');
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...b.color);
    doc.text(String(b.value), x + boxW / 2 - 1, 68, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text(b.label, x + boxW / 2 - 1, 76, { align: 'center' });
  });

  let y = 88;

  // Compliance status
  y = addSectionTitle(doc, '1. Article 9 Compliance Status', y);
  autoTable(doc, {
    startY: y,
    head: [['Field', 'Value']],
    body: [
      ['Compliance Status', data.article_9_compliance?.status || 'N/A'],
      ['Outstanding Actions Required', data.article_9_compliance?.outstanding_actions || '0'],
      ['Legal Requirement', data.article_9_compliance?.requirement || 'N/A'],
      ['Next Review Due', data.article_9_compliance?.next_review || 'N/A'],
      ['Overall Risk Score', `${data.overall_risk_score}/10`],
      ['Risk Level', data.overall_risk_level],
      ['Risk Colour', data.risk_color],
    ],
    styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' }, 1: { cellWidth: 116 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Risk factor breakdown
  if (y > ph - 60) { doc.addPage(); addHeader(doc, 'Risk Dashboard - Breakdown', 'Article 9', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
  y = addSectionTitle(doc, '2. Risk Factor Breakdown', y);

  autoTable(doc, {
    startY: y,
    head: [['Risk Factor', 'Base Severity', 'Actual Severity', 'Score', 'Mitigation Status', 'Action Required']],
    body: data.risk_factors?.map(r => [
      r.risk_name || '',
      r.base_severity || '',
      r.actual_severity || '',
      `${r.score}/9`,
      r.mitigation_status || '',
      r.mitigation_action || ''
    ]) || [],
    styles: { fontSize: 7.5, cellPadding: 2.5, textColor: DARK, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 12 },
      4: { cellWidth: 24 },
      5: { cellWidth: 82 }
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  addFooter(doc, pw, ph, data.system_name);
  doc.save(`Risk_Report_${data.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── BIAS PDF ──────────────────────────────────────────────────────────────────
export function generateBiasPDF(data) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  addHeader(doc, 'Bias Detection Report', 'Article 10(5) of the EU AI Act', pw);

  const biasDetected = data.article_10_compliance?.bias_detected;
  doc.setFillColor(...(biasDetected ? RED : GREEN));
  doc.roundedRect(14, 36, pw - 28, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.article_10_compliance?.status || 'N/A', 20, 47);
  doc.text(`Toolkit: ${data.toolkit || 'N/A'}`, pw - 14, 47, { align: 'right' });
  doc.setTextColor(...DARK);

  // Info box
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, 58, pw - 28, 22, 3, 3, 'F');
  let infoY = 66;
  infoY = addInfoRow(doc, 'Model Used:', data.model_used || 'N/A', 18, infoY, pw);
  addInfoRow(doc, 'Dataset:', data.dataset || 'N/A', 18, infoY, pw);

  let y = 88;

  // Article 10 compliance
  y = addSectionTitle(doc, '1. Article 10(5) Compliance Assessment', y);
  autoTable(doc, {
    startY: y,
    head: [['Field', 'Value']],
    body: [
      ['Bias Detected', biasDetected ? 'YES - Action Required' : 'No significant bias detected'],
      ['Compliance Status', data.article_10_compliance?.status || 'N/A'],
      ['Special Category Data Used', data.article_10_compliance?.special_category_data_used ? 'Yes' : 'No'],
      ['Additional Safeguards Required', data.article_10_compliance?.safeguards_required ? 'Yes' : 'No'],
      ['Legal Requirement', data.article_10_compliance?.requirement || 'N/A'],
      ['Bias Detection Toolkit', data.toolkit || 'N/A'],
    ],
    styles: { fontSize: 8, cellPadding: 3, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' }, 1: { cellWidth: 116 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Fairness analysis
  Object.entries(data.fairness_analysis || {}).forEach(([key, analysis]) => {
    if (!analysis || Object.keys(analysis).length === 0) return;
    if (y > ph - 70) { doc.addPage(); addHeader(doc, 'Bias Report - Fairness Analysis', 'Article 10(5)', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }

    const sectionTitle = key === 'age_based' ? '2. Age Based Fairness Analysis' : '3. Personal Status Fairness Analysis';
    y = addSectionTitle(doc, sectionTitle, y);

    const groupA = analysis.group_a || analysis.privileged_group || 'Group A';
    const groupB = analysis.group_b || analysis.unprivileged_group || 'Group B';

    doc.setFontSize(8);
    doc.setTextColor(...MID_GRAY);
    doc.text(`Comparing: ${groupA} vs ${groupB}`, 14, y);
    y += 8;

    const metrics = Object.entries(analysis).filter(([k]) =>
      !['group_a', 'group_b', 'toolkit', 'success', 'privileged_group', 'unprivileged_group',
        'base_rate_privileged', 'base_rate_unprivileged'].includes(k)
    );

    const metricRows = metrics.map(([metric, d]) => {
      if (typeof d !== 'object' || d === null) return null;
      return [
        metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        d.value !== undefined ? String(d.value) : 'N/A',
        d.bias_level || d.status || 'N/A',
        d.description || '',
        d.threshold || ''
      ];
    }).filter(Boolean);

    if (metricRows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Metric', 'Value', 'Assessment', 'Description', 'Threshold']],
        body: metricRows,
        styles: { fontSize: 7.5, cellPadding: 2.5, textColor: DARK, valign: 'top' },
        headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 46 },
          1: { cellWidth: 16 },
          2: { cellWidth: 40 },
          3: { cellWidth: 56 },
          4: { cellWidth: 28 }
        },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  });

  // Recommendations
  if (y > ph - 50) { doc.addPage(); addHeader(doc, 'Bias Report - Recommendations', 'Article 10(5)', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
  y = addSectionTitle(doc, '4. Recommendations', y);

  data.recommendations?.forEach((rec, i) => {
    if (y > ph - 20) { doc.addPage(); addHeader(doc, 'Bias - Recommendations', 'Article 10(5)', pw); addFooter(doc, pw, ph, data.system_name); y = 40; }
    const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, pw - 28);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...DARK);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 5;
  });

  addFooter(doc, pw, ph, data.system_name);
  doc.save(`Bias_Report_${data.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── COMBINED PDF ──────────────────────────────────────────────────────────────
export function generateCombinedPDF(fria, cybersecurity, xai, bias, risk) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  // Cover page
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pw, ph, 'F');
  doc.setFillColor(...PRIMARY);
  doc.rect(0, ph / 2 - 2, pw, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EU AI Act Compliance Report', pw / 2, ph / 2 - 36, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 200, 220);
  doc.text('Comprehensive Assessment for High-Risk Credit Scoring AI', pw / 2, ph / 2 - 22, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(fria.system_name, pw / 2, ph / 2 + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 150, 180);
  doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pw / 2, ph / 2 + 24, { align: 'center' });
  doc.text('Covers: EU AI Act Articles 9, 10(5), 13, 15 and 27 | Annex III Point 5(b)', pw / 2, ph / 2 + 34, { align: 'center' });
  doc.text('Methodology: Design Science Research | Dataset: German Credit (Statlog)', pw / 2, ph / 2 + 44, { align: 'center' });

  // Executive summary page
  doc.addPage();
  addHeader(doc, 'Executive Summary', 'EU AI Act Compliance Assessment', pw);

  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, 36, pw - 28, 18, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK);
  doc.text(`System: ${fria.system_name}   |   Organisation: ${fria.organisation}   |   Date: ${new Date().toLocaleDateString()}`, 18, 48);

  autoTable(doc, {
    startY: 62,
    head: [['Report', 'EU AI Act Article', 'Result', 'Status']],
    body: [
      ['Fundamental Rights Impact Assessment', 'Article 27', fria.overall_risk_level, fria.overall_risk_level === 'LOW' ? 'PASS' : 'ACTION REQUIRED'],
      ['Cybersecurity Threat Model', 'Article 15', cybersecurity.overall_security_risk, cybersecurity.overall_security_risk === 'LOW' ? 'PASS' : 'ACTION REQUIRED'],
      ['Explainability Report (XAI)', 'Article 13', xai.compliance_status?.status || 'N/A', xai.compliance_status?.status === 'COMPLIANT' ? 'PASS' : 'ACTION REQUIRED'],
      ['Risk Scoring Dashboard', 'Article 9', `${risk.overall_risk_score}/10 (${risk.overall_risk_level})`, risk.article_9_compliance?.status || 'N/A'],
      ['Bias Detection Report', 'Article 10(5)', bias.article_10_compliance?.bias_detected ? 'BIAS DETECTED' : 'NO BIAS FOUND', bias.article_10_compliance?.bias_detected ? 'ACTION REQUIRED' : 'PASS'],
    ],
    styles: { fontSize: 9, cellPadding: 4, textColor: DARK },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 30 },
      2: { cellWidth: 50 },
      3: { cellWidth: 41 }
    },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  let y = doc.lastAutoTable.finalY + 12;

  // Key findings
  y = addSectionTitle(doc, 'Key Findings', y);
  const findings = [
    `FRIA Overall Risk: ${fria.overall_risk_level} — ${fria.rights_assessed?.length || 0} fundamental rights assessed`,
    `Cybersecurity: ${cybersecurity.threats_identified?.filter(t => t.applicable).length || 0} applicable threats identified, ${cybersecurity.controls_recommended?.length || 0} controls recommended`,
    `Explainability: Top feature driving decisions is "${xai.top_features?.[0]?.feature || 'N/A'}" — ${xai.compliance_status?.status || 'N/A'}`,
    `Risk Score: ${risk.overall_risk_score}/10 — ${risk.risk_summary?.high_risks || 0} HIGH, ${risk.risk_summary?.medium_risks || 0} MEDIUM, ${risk.risk_summary?.low_risks || 0} LOW risk factors`,
    `Bias Detection: ${bias.article_10_compliance?.status || 'N/A'} — Toolkit: ${bias.toolkit || 'N/A'}`,
  ];

  findings.forEach((f, i) => {
    if (y > ph - 20) { doc.addPage(); addFooter(doc, pw, ph, fria.system_name); y = 20; }
    doc.setFillColor(235, 245, 251);
    doc.roundedRect(14, y, pw - 28, 10, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, 20, y + 7);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(f, pw - 50);
    doc.text(lines[0], 28, y + 7);
    y += 13;
  });

  addFooter(doc, pw, ph, fria.system_name);

  // Section pages
  doc.addPage();
  addHeader(doc, 'Section 1: Fundamental Rights Impact Assessment', 'Article 27', pw);
  addFooter(doc, pw, ph, fria.system_name);
  autoTable(doc, {
    startY: 40,
    head: [['Right', 'Impact', 'Justification', 'Mitigation']],
    body: fria.rights_assessed?.map(r => [r.right, r.impact_level, r.impact_justification || 'N/A', r.mitigation || 'N/A']) || [],
    styles: { fontSize: 8, cellPadding: 3, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 36 }, 1: { cellWidth: 16 }, 2: { cellWidth: 72 }, 3: { cellWidth: 62 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  doc.addPage();
  addHeader(doc, 'Section 2: Cybersecurity Threat Model', 'Article 15', pw);
  addFooter(doc, pw, ph, fria.system_name);
  autoTable(doc, {
    startY: 40,
    head: [['Threat', 'Severity', 'STRIDE', 'Applicable', 'Reason']],
    body: cybersecurity.threats_identified?.map(t => [
      t.threat_name, t.severity, (t.stride_category || '').replace('STRIDE_', ''), t.applicable ? 'YES' : 'NO', t.reason || ''
    ]) || [],
    styles: { fontSize: 8, cellPadding: 3, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 34 }, 1: { cellWidth: 16 }, 2: { cellWidth: 24 }, 3: { cellWidth: 18 }, 4: { cellWidth: 94 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  doc.addPage();
  addHeader(doc, 'Section 3: Explainability Report', 'Article 13', pw);
  addFooter(doc, pw, ph, fria.system_name);
  autoTable(doc, {
    startY: 40,
    head: [['Rank', 'Feature', 'Description', 'Importance Score', 'Impact']],
    body: xai.top_features?.map((f, i) => [i + 1, f.feature, f.description, f.importance_score?.toFixed(4), f.impact]) || [],
    styles: { fontSize: 8, cellPadding: 3, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 36 }, 2: { cellWidth: 96 }, 3: { cellWidth: 24 }, 4: { cellWidth: 18 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  doc.addPage();
  addHeader(doc, 'Section 4: Risk Scoring Dashboard', 'Article 9', pw);
  addFooter(doc, pw, ph, fria.system_name);
  autoTable(doc, {
    startY: 40,
    head: [['Risk Factor', 'Severity', 'Score', 'Status', 'Action Required']],
    body: risk.risk_factors?.map(r => [r.risk_name, r.actual_severity, `${r.score}/9`, r.mitigation_status, r.mitigation_action]) || [],
    styles: { fontSize: 8, cellPadding: 3, valign: 'top' },
    headStyles: { fillColor: DARK, textColor: [255, 255, 255] },
    columnStyles: { 0: { cellWidth: 36 }, 1: { cellWidth: 18 }, 2: { cellWidth: 14 }, 3: { cellWidth: 26 }, 4: { cellWidth: 92 } },
    alternateRowStyles: { fillColor: LIGHT_GRAY },
    margin: { left: 14, right: 14 }
  });

  doc.addPage();
  addHeader(doc, 'Section 5: Bias Detection Report', 'Article 10(5)', pw);
  addFooter(doc, pw, ph, fria.system_name);
  let biasY = 40;
  Object.entries(bias.fairness_analysis || {}).forEach(([key, analysis]) => {
    if (!analysis || Object.keys(analysis).length === 0) return;
    const title = key === 'age_based' ? 'Age Based Analysis' : 'Personal Status Analysis';
    biasY = addSectionTitle(doc, title, biasY);
    const metrics = Object.entries(analysis).filter(([k]) =>
      !['group_a', 'group_b', 'toolkit', 'success', 'privileged_group', 'unprivileged_group',
        'base_rate_privileged', 'base_rate_unprivileged'].includes(k)
    );
    const rows = metrics.map(([m, d]) => {
      if (typeof d !== 'object' || d === null) return null;
      return [m.replace(/_/g, ' '), d.value !== undefined ? String(d.value) : 'N/A', d.bias_level || d.status || 'N/A', d.threshold || ''];
    }).filter(Boolean);
    if (rows.length > 0) {
      autoTable(doc, {
        startY: biasY,
        head: [['Metric', 'Value', 'Assessment', 'Threshold']],
        body: rows,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: DARK, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 56 }, 1: { cellWidth: 18 }, 2: { cellWidth: 60 }, 3: { cellWidth: 52 } },
        alternateRowStyles: { fillColor: LIGHT_GRAY },
        margin: { left: 14, right: 14 }
      });
      biasY = doc.lastAutoTable.finalY + 10;
    }
  });

  doc.save(`Combined_Compliance_Report_${fria.system_name.replace(/\s+/g, '_')}.pdf`);
}

// ── CSV GENERATORS ────────────────────────────────────────────────────────────
export function generateFRIACSV(data) {
  const rows = [
    ['EU AI Act Compliance Tool - Fundamental Rights Impact Assessment'],
    ['Article 27 of the EU AI Act'],
    [''],
    ['System Information'],
    ['System Name', data.system_name],
    ['Organisation', data.organisation],
    ['Assessment Type', data.assessment_type],
    ['Overall Risk Level', data.overall_risk_level],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Legal Obligations'],
    ['Article', 'Requirement'],
    ...(data.obligations?.map(o => [o.article || '', o.requirement || '']) || []),
    [''],
    ['Rights Assessment'],
    ['Fundamental Right', 'Legal Basis', 'Impact Level', 'Justification', 'Mitigation Measure'],
    ...(data.rights_assessed?.map(r => [
      r.right || '',
      r.description || '',
      r.impact_level || '',
      (r.impact_justification || 'No specific impact identified').replace(/,/g, ';'),
      (r.mitigation || 'No mitigation required').replace(/,/g, ';')
    ]) || []),
    [''],
    ['Recommendations'],
    ['No', 'Recommendation'],
    ...(data.recommendations?.map((r, i) => [i + 1, r.replace(/,/g, ';')]) || [])
  ];
  downloadCSV(rows, `FRIA_Report_${data.system_name.replace(/\s+/g, '_')}.csv`);
}

export function generateCybersecurityCSV(data) {
  const rows = [
    ['EU AI Act Compliance Tool - Cybersecurity Threat Model'],
    ['Article 15 of the EU AI Act'],
    [''],
    ['System Information'],
    ['System Name', data.system_name],
    ['Assessment Type', data.assessment_type],
    ['Overall Security Risk', data.overall_security_risk],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['STRIDE Summary'],
    ['STRIDE Category', 'Threats Identified', 'Count'],
    ...(Object.entries(data.stride_summary || {}).map(([cat, threats]) => [
      cat.replace('STRIDE_', ''),
      threats.join(' | '),
      threats.length
    ])),
    [''],
    ['Full Threat Assessment'],
    ['Threat Name', 'Severity', 'STRIDE Category', 'Applicable', 'Article 15(5) Class', 'Description', 'Reason'],
    ...(data.threats_identified?.map(t => [
      t.threat_name || '',
      t.severity || '',
      (t.stride_category || '').replace('STRIDE_', ''),
      t.applicable ? 'YES' : 'NO',
      t.stride_category === 'STRIDE_TAMPERING' ? 'Data/Model Poisoning' :
        t.stride_category === 'STRIDE_INFO_DISCLOSURE' ? 'Confidentiality Attack' :
          t.stride_category === 'STRIDE_SPOOFING' ? 'Adversarial Evasion' :
            t.stride_category === 'STRIDE_REPUDIATION' ? 'Model Flaw' :
              t.stride_category === 'STRIDE_DOS' ? 'Availability Attack' : 'Other',
      (t.description || '').replace(/,/g, ';'),
      (t.reason || '').replace(/,/g, ';')
    ]) || []),
    [''],
    ['Recommended ENISA FAICP Controls'],
    ['Control Name', 'Description', 'Mitigates Threat'],
    ...(data.controls_recommended?.map(c => [
      c.control || '',
      (c.description || '').replace(/,/g, ';'),
      c.mitigates || ''
    ]) || [])
  ];
  downloadCSV(rows, `Cybersecurity_Report_${data.system_name.replace(/\s+/g, '_')}.csv`);
}

export function generateXAICSV(data) {
  const rows = [
    ['EU AI Act Compliance Tool - Explainability Report (XAI)'],
    ['Article 13 of the EU AI Act'],
    [''],
    ['System Information'],
    ['System Name', data.system_name],
    ['XAI Method Used', data.method_used || 'N/A'],
    ['Dataset', data.dataset || 'N/A'],
    ['Article 13 Status', data.compliance_status?.status || 'N/A'],
    ['Explainability Method', data.compliance_status?.explainability_method || 'None'],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Article 13 Compliance Details'],
    ['Field', 'Value'],
    ['Status', data.compliance_status?.status || 'N/A'],
    ['Method Implemented', data.compliance_status?.explainability_method || 'None'],
    ['Legal Requirement', (data.compliance_status?.requirement || 'N/A').replace(/,/g, ';')],
    [''],
    ['Feature Importance Analysis'],
    ['Rank', 'Feature Name', 'Description', 'Importance Score', 'Impact Level', 'Bias Risk Note'],
    ...(data.top_features?.map((f, i) => [
      i + 1,
      f.feature || '',
      (f.description || '').replace(/,/g, ';'),
      f.importance_score?.toFixed(4) || '0',
      f.impact || '',
      f.feature === 'personal_status' || f.feature === 'age' ? 'REVIEW - Protected attribute' :
        f.feature === 'foreign_worker' ? 'REVIEW - Potential proxy discrimination' : 'Low risk'
    ]) || []),
    [''],
    ['Recommendations'],
    ['No', 'Recommendation'],
    ...(data.recommendations?.map((r, i) => [i + 1, r.replace(/,/g, ';')]) || [])
  ];
  downloadCSV(rows, `XAI_Report_${data.system_name.replace(/\s+/g, '_')}.csv`);
}

export function generateRiskCSV(data) {
  const rows = [
    ['EU AI Act Compliance Tool - Risk Scoring Dashboard'],
    ['Article 9 of the EU AI Act'],
    [''],
    ['System Information'],
    ['System Name', data.system_name],
    ['Overall Risk Score', `${data.overall_risk_score}/10`],
    ['Overall Risk Level', data.overall_risk_level],
    ['Risk Colour', data.risk_color],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Article 9 Compliance Status'],
    ['Field', 'Value'],
    ['Status', data.article_9_compliance?.status || 'N/A'],
    ['Outstanding Actions', data.article_9_compliance?.outstanding_actions || '0'],
    ['Legal Requirement', (data.article_9_compliance?.requirement || 'N/A').replace(/,/g, ';')],
    ['Next Review', data.article_9_compliance?.next_review || 'N/A'],
    [''],
    ['Risk Summary'],
    ['Category', 'Count'],
    ['High Risks', data.risk_summary?.high_risks || 0],
    ['Medium Risks', data.risk_summary?.medium_risks || 0],
    ['Low Risks', data.risk_summary?.low_risks || 0],
    ['Total Risks', data.risk_summary?.total_risks || 0],
    ['Overall Score', `${data.overall_risk_score}/10`],
    [''],
    ['Risk Factor Breakdown'],
    ['Risk Factor', 'Description', 'Base Severity', 'Actual Severity', 'Score (out of 9)', 'Mitigation Status', 'Action Required'],
    ...(data.risk_factors?.map(r => [
      r.risk_name || '',
      (r.description || '').replace(/,/g, ';'),
      r.base_severity || '',
      r.actual_severity || '',
      r.score || 0,
      r.mitigation_status || '',
      (r.mitigation_action || '').replace(/,/g, ';')
    ]) || [])
  ];
  downloadCSV(rows, `Risk_Report_${data.system_name.replace(/\s+/g, '_')}.csv`);
}

export function generateBiasCSV(data) {
  const rows = [
    ['EU AI Act Compliance Tool - Bias Detection Report'],
    ['Article 10(5) of the EU AI Act'],
    [''],
    ['System Information'],
    ['System Name', data.system_name],
    ['Model Used', data.model_used || 'N/A'],
    ['Dataset', data.dataset || 'N/A'],
    ['Bias Detection Toolkit', data.toolkit || 'N/A'],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Article 10(5) Compliance Assessment'],
    ['Field', 'Value'],
    ['Bias Detected', data.article_10_compliance?.bias_detected ? 'YES - Action Required' : 'No significant bias detected'],
    ['Compliance Status', data.article_10_compliance?.status || 'N/A'],
    ['Special Category Data Used', data.article_10_compliance?.special_category_data_used ? 'Yes' : 'No'],
    ['Additional Safeguards Required', data.article_10_compliance?.safeguards_required ? 'Yes' : 'No'],
    ['Legal Requirement', (data.article_10_compliance?.requirement || 'N/A').replace(/,/g, ';')],
    ['']
  ];

  Object.entries(data.fairness_analysis || {}).forEach(([key, analysis]) => {
    if (!analysis || Object.keys(analysis).length === 0) return;
    const sectionName = key === 'age_based' ? 'Age Based Fairness Analysis' : 'Personal Status Fairness Analysis';
    rows.push([sectionName]);
    const groupA = analysis.group_a || analysis.privileged_group || 'Group A';
    const groupB = analysis.group_b || analysis.unprivileged_group || 'Group B';
    rows.push(['Comparing', `${groupA} vs ${groupB}`]);
    rows.push(['Metric', 'Value', 'Assessment', 'Description', 'Threshold']);

    const metrics = Object.entries(analysis).filter(([k]) =>
      !['group_a', 'group_b', 'toolkit', 'success', 'privileged_group', 'unprivileged_group',
        'base_rate_privileged', 'base_rate_unprivileged'].includes(k)
    );

    metrics.forEach(([metric, d]) => {
      if (typeof d !== 'object' || d === null) return;
      rows.push([
        metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        d.value !== undefined ? String(d.value) : 'N/A',
        d.bias_level || d.status || 'N/A',
        (d.description || '').replace(/,/g, ';'),
        (d.threshold || '').replace(/,/g, ';')
      ]);
    });
    rows.push(['']);
  });

  rows.push(['Recommendations']);
  rows.push(['No', 'Recommendation']);
  data.recommendations?.forEach((r, i) => rows.push([i + 1, r.replace(/,/g, ';')]));

  downloadCSV(rows, `Bias_Report_${data.system_name.replace(/\s+/g, '_')}.csv`);
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(cell => {
    const str = String(cell);
    return str.includes(',') || str.includes('\n') || str.includes('"')
      ? `"${str.replace(/"/g, '""')}"` : str;
  }).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}