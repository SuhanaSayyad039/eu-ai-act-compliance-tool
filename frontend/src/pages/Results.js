import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  generateFRIAPDF, generateCybersecurityPDF, generateXAIPDF,
  generateRiskPDF, generateBiasPDF, generateCombinedPDF,
  generateFRIACSV, generateCybersecurityCSV, generateXAICSV,
  generateRiskCSV, generateBiasCSV
} from '../utils/reportGenerator';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('fria');

  const { fria, cybersecurity, xai, bias, risk, systemName } = location.state || {};

  if (!fria) {
    return (
      <div style={styles.empty}>
        <h2>No results found</h2>
        <p>Please complete the questionnaire first.</p>
        <button style={styles.emptyBtn} onClick={() => navigate('/assess')}>
          Go to Questionnaire
        </button>
      </div>
    );
  }

  const riskColor = (level) => {
    if (level === 'HIGH') return '#e53e3e';
    if (level === 'MEDIUM') return '#d69e2e';
    return '#38a169';
  };

  const riskBg = (level) => {
    if (level === 'HIGH') return '#fff5f5';
    if (level === 'MEDIUM') return '#fffff0';
    return '#f0fff4';
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const tabs = [
    { id: 'fria', label: 'FRIA', article: 'Art. 27', color: '#2E75B6' },
    { id: 'cybersecurity', label: 'Cybersecurity', article: 'Art. 15', color: '#C0392B' },
    { id: 'xai', label: 'Explainability', article: 'Art. 13', color: '#27AE60' },
    { id: 'risk', label: 'Risk Score', article: 'Art. 9', color: '#E67E22' },
    { id: 'bias', label: 'Bias Detection', article: 'Art. 10(5)', color: '#8E44AD' },
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={() => navigate('/assess')}>
              Back
            </button>
            <div>
              <h1 style={styles.headerTitle}>Compliance Assessment Results</h1>
              <p style={styles.headerSub}>{systemName}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={styles.combinedBtn} onClick={() => generateCombinedPDF(fria, cybersecurity, xai, bias, risk)}>
              Download Full Report
            </button>
            <button style={styles.newAssessBtn} onClick={() => navigate('/assess')}>
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={styles.summarySection}>
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryCard, borderTopColor: riskColor(fria.overall_risk_level) }}>
            <div style={styles.summaryLabel}>FRIA Risk Level</div>
            <div style={{ ...styles.summaryValue, color: riskColor(fria.overall_risk_level) }}>
              {fria.overall_risk_level}
            </div>
            <div style={styles.summaryArticle}>Article 27</div>
          </div>
          <div style={{ ...styles.summaryCard, borderTopColor: riskColor(cybersecurity.overall_security_risk) }}>
            <div style={styles.summaryLabel}>Security Risk</div>
            <div style={{ ...styles.summaryValue, color: riskColor(cybersecurity.overall_security_risk) }}>
              {cybersecurity.overall_security_risk}
            </div>
            <div style={styles.summaryArticle}>Article 15</div>
          </div>
          <div style={{ ...styles.summaryCard, borderTopColor: riskColor(xai.compliance_status?.status === 'COMPLIANT' ? 'LOW' : 'HIGH') }}>
            <div style={styles.summaryLabel}>XAI Compliance</div>
            <div style={{ ...styles.summaryValue, color: riskColor(xai.compliance_status?.status === 'COMPLIANT' ? 'LOW' : 'HIGH') }}>
              {xai.compliance_status?.status || 'N/A'}
            </div>
            <div style={styles.summaryArticle}>Article 13</div>
          </div>
          <div style={{ ...styles.summaryCard, borderTopColor: riskColor(risk.overall_risk_level) }}>
            <div style={styles.summaryLabel}>Overall Risk Score</div>
            <div style={{ ...styles.summaryValue, color: riskColor(risk.overall_risk_level) }}>
              {risk.overall_risk_score}/10
            </div>
            <div style={styles.summaryArticle}>Article 9</div>
          </div>
          <div style={{ ...styles.summaryCard, borderTopColor: riskColor(bias.article_10_compliance?.bias_detected ? 'HIGH' : 'LOW') }}>
            <div style={styles.summaryLabel}>Bias Status</div>
            <div style={{ ...styles.summaryValue, color: riskColor(bias.article_10_compliance?.bias_detected ? 'HIGH' : 'LOW') }}>
              {bias.article_10_compliance?.bias_detected ? 'DETECTED' : 'NONE FOUND'}
            </div>
            <div style={styles.summaryArticle}>Article 10(5)</div>
          </div>
        </div>
      </div>

      {/* Tabs — fixed to top: 64px so they stick below the navbar */}
      <div style={styles.tabsSection}>
        <div style={styles.tabsBar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                borderBottomColor: activeTab === tab.id ? tab.color : 'transparent',
                color: activeTab === tab.id ? tab.color : '#718096',
                fontWeight: activeTab === tab.id ? '700' : '400',
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span style={styles.tabArticle}>{tab.article}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={styles.tabContent}>

        {/* FRIA TAB */}
        {activeTab === 'fria' && (
          <div>
            <div style={styles.reportHeader}>
              <div>
                <h2 style={styles.reportTitle}>Fundamental Rights Impact Assessment</h2>
                <p style={styles.reportSub}>Article 27 of the EU AI Act</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ ...styles.riskBadge, backgroundColor: riskBg(fria.overall_risk_level), color: riskColor(fria.overall_risk_level) }}>
                  Overall Risk: {fria.overall_risk_level}
                </div>
                <div style={styles.downloadGroup}>
                  <button style={styles.downloadBtnPDF} onClick={() => generateFRIAPDF(fria)}>PDF</button>
                  <button style={styles.downloadBtnCSV} onClick={() => generateFRIACSV(fria)}>CSV</button>
                  <button style={styles.downloadBtnJSON} onClick={() => downloadJSON(fria, 'fria_report.json')}>JSON</button>
                </div>
              </div>
            </div>

            <h3 style={styles.sectionHeading}>Rights Assessment</h3>
            {fria.rights_assessed?.map((right, i) => (
              <div key={i} style={{ ...styles.rightCard, borderLeftColor: riskColor(right.impact_level) }}>
                <div style={styles.rightHeader}>
                  <strong style={styles.rightName}>{right.right}</strong>
                  <span style={{ ...styles.impactBadge, backgroundColor: riskBg(right.impact_level), color: riskColor(right.impact_level) }}>
                    {right.impact_level} IMPACT
                  </span>
                </div>
                <p style={styles.rightDesc}>{right.description}</p>
                {right.impact_justification && (
                  <p style={styles.rightJustification}>{right.impact_justification}</p>
                )}
                {right.mitigation && (
                  <div style={styles.mitigationBox}>
                    <strong>Mitigation: </strong>{right.mitigation}
                  </div>
                )}
              </div>
            ))}

            <h3 style={styles.sectionHeading}>Recommendations</h3>
            {fria.recommendations?.map((rec, i) => (
              <div key={i} style={styles.recItem}>
                <span style={styles.recNumber}>{i + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* CYBERSECURITY TAB */}
        {activeTab === 'cybersecurity' && (
          <div>
            <div style={styles.reportHeader}>
              <div>
                <h2 style={styles.reportTitle}>Cybersecurity Threat Model</h2>
                <p style={styles.reportSub}>Article 15 of the EU AI Act</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ ...styles.riskBadge, backgroundColor: riskBg(cybersecurity.overall_security_risk), color: riskColor(cybersecurity.overall_security_risk) }}>
                  Security Risk: {cybersecurity.overall_security_risk}
                </div>
                <div style={styles.downloadGroup}>
                  <button style={styles.downloadBtnPDF} onClick={() => generateCybersecurityPDF(cybersecurity)}>PDF</button>
                  <button style={styles.downloadBtnCSV} onClick={() => generateCybersecurityCSV(cybersecurity)}>CSV</button>
                  <button style={styles.downloadBtnJSON} onClick={() => downloadJSON(cybersecurity, 'cybersecurity_report.json')}>JSON</button>
                </div>
              </div>
            </div>

            <h3 style={styles.sectionHeading}>Identified Threats</h3>
            {cybersecurity.threats_identified?.map((threat, i) => (
              <div key={i} style={{
                ...styles.threatCard,
                opacity: threat.applicable ? 1 : 0.5,
                borderLeftColor: threat.applicable ? riskColor(threat.severity) : '#cbd5e0'
              }}>
                <div style={styles.threatHeader}>
                  <strong>{threat.threat_name}</strong>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ ...styles.impactBadge, backgroundColor: threat.applicable ? riskBg(threat.severity) : '#f7fafc', color: threat.applicable ? riskColor(threat.severity) : '#718096' }}>
                      {threat.severity}
                    </span>
                    <span style={styles.strideBadge}>
                      {threat.stride_category?.replace('STRIDE_', '')}
                    </span>
                    {!threat.applicable && (
                      <span style={styles.notApplicable}>Not Applicable</span>
                    )}
                  </div>
                </div>
                <p style={styles.threatDesc}>{threat.description}</p>
                {threat.reason && <p style={styles.threatReason}>{threat.reason}</p>}
              </div>
            ))}

            <h3 style={styles.sectionHeading}>Recommended Controls</h3>
            {cybersecurity.controls_recommended?.map((ctrl, i) => (
              <div key={i} style={styles.controlCard}>
                <strong style={styles.controlName}>{ctrl.control}</strong>
                <p style={styles.controlDesc}>{ctrl.description}</p>
                <span style={styles.controlMitigates}>Mitigates: {ctrl.mitigates}</span>
              </div>
            ))}
          </div>
        )}

        {/* XAI TAB */}
        {activeTab === 'xai' && (
          <div>
            <div style={styles.reportHeader}>
              <div>
                <h2 style={styles.reportTitle}>Explainability Report</h2>
                <p style={styles.reportSub}>Article 13 of the EU AI Act</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ ...styles.riskBadge, backgroundColor: xai.compliance_status?.status === 'COMPLIANT' ? '#f0fff4' : '#fff5f5', color: xai.compliance_status?.status === 'COMPLIANT' ? '#38a169' : '#e53e3e' }}>
                  {xai.compliance_status?.status || 'N/A'}
                </div>
                <div style={styles.downloadGroup}>
                  <button style={styles.downloadBtnPDF} onClick={() => generateXAIPDF(xai)}>PDF</button>
                  <button style={styles.downloadBtnCSV} onClick={() => generateXAICSV(xai)}>CSV</button>
                  <button style={styles.downloadBtnJSON} onClick={() => downloadJSON(xai, 'xai_report.json')}>JSON</button>
                </div>
              </div>
            </div>

            <div style={styles.infoBox}>
              <strong>Method used: </strong>{xai.method_used}
              <br />
              <strong>Dataset: </strong>{xai.dataset}
            </div>

            <h3 style={styles.sectionHeading}>Top Features Driving Credit Decisions</h3>
            {xai.top_features?.map((feature, i) => (
              <div key={i} style={styles.featureRow}>
                <div style={styles.featureRank}>{i + 1}</div>
                <div style={styles.featureInfo}>
                  <div style={styles.featureName}>{feature.feature}</div>
                  <div style={styles.featureDesc}>{feature.description}</div>
                </div>
                <div style={styles.featureBarWrap}>
                  <div style={{
                    ...styles.featureBar,
                    width: `${Math.min((feature.importance_score / (xai.top_features[0]?.importance_score || 1)) * 100, 100)}%`,
                    backgroundColor: riskColor(feature.impact)
                  }} />
                </div>
                <div style={{ ...styles.impactBadge, backgroundColor: riskBg(feature.impact), color: riskColor(feature.impact), minWidth: '60px', textAlign: 'center' }}>
                  {feature.impact}
                </div>
              </div>
            ))}

            <h3 style={styles.sectionHeading}>Recommendations</h3>
            {xai.recommendations?.map((rec, i) => (
              <div key={i} style={styles.recItem}>
                <span style={styles.recNumber}>{i + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* RISK TAB */}
        {activeTab === 'risk' && (
          <div>
            <div style={styles.reportHeader}>
              <div>
                <h2 style={styles.reportTitle}>Risk Scoring Dashboard</h2>
                <p style={styles.reportSub}>Article 9 of the EU AI Act</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ ...styles.riskBadge, backgroundColor: riskBg(risk.overall_risk_level), color: riskColor(risk.overall_risk_level) }}>
                  Risk Score: {risk.overall_risk_score}/10
                </div>
                <div style={styles.downloadGroup}>
                  <button style={styles.downloadBtnPDF} onClick={() => generateRiskPDF(risk)}>PDF</button>
                  <button style={styles.downloadBtnCSV} onClick={() => generateRiskCSV(risk)}>CSV</button>
                  <button style={styles.downloadBtnJSON} onClick={() => downloadJSON(risk, 'risk_report.json')}>JSON</button>
                </div>
              </div>
            </div>

            <div style={styles.ragRow}>
              <div style={{ ...styles.ragCard, backgroundColor: '#fff5f5', borderColor: '#e53e3e' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#e53e3e' }}>{risk.risk_summary?.high_risks}</div>
                <div style={{ fontSize: '13px', color: '#e53e3e', fontWeight: '600' }}>HIGH RISKS</div>
              </div>
              <div style={{ ...styles.ragCard, backgroundColor: '#fffff0', borderColor: '#d69e2e' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#d69e2e' }}>{risk.risk_summary?.medium_risks}</div>
                <div style={{ fontSize: '13px', color: '#d69e2e', fontWeight: '600' }}>MEDIUM RISKS</div>
              </div>
              <div style={{ ...styles.ragCard, backgroundColor: '#f0fff4', borderColor: '#38a169' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#38a169' }}>{risk.risk_summary?.low_risks}</div>
                <div style={{ fontSize: '13px', color: '#38a169', fontWeight: '600' }}>LOW RISKS</div>
              </div>
              <div style={{ ...styles.ragCard, backgroundColor: '#EBF5FB', borderColor: '#2E75B6' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2E75B6' }}>{risk.overall_risk_score}/10</div>
                <div style={{ fontSize: '13px', color: '#2E75B6', fontWeight: '600' }}>OVERALL SCORE</div>
              </div>
            </div>

            <h3 style={styles.sectionHeading}>Risk Factor Breakdown</h3>
            {risk.risk_factors?.map((rf, i) => (
              <div key={i} style={{ ...styles.riskFactorCard, borderLeftColor: riskColor(rf.actual_severity) }}>
                <div style={styles.riskFactorHeader}>
                  <strong>{rf.risk_name}</strong>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ ...styles.impactBadge, backgroundColor: riskBg(rf.actual_severity), color: riskColor(rf.actual_severity) }}>
                      {rf.actual_severity}
                    </span>
                    <span style={styles.scoreBadge}>Score: {rf.score}/9</span>
                  </div>
                </div>
                <p style={styles.riskFactorDesc}>{rf.description}</p>
                <div style={{ ...styles.mitigationBox, borderColor: rf.mitigation_status === 'REQUIRED' ? '#e53e3e' : rf.mitigation_status === 'ADDRESSED' ? '#38a169' : '#d69e2e' }}>
                  <strong>{rf.mitigation_status}: </strong>{rf.mitigation_action}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BIAS TAB */}
        {activeTab === 'bias' && (
          <div>
            <div style={styles.reportHeader}>
              <div>
                <h2 style={styles.reportTitle}>Bias Detection Report</h2>
                <p style={styles.reportSub}>Article 10(5) of the EU AI Act</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ ...styles.riskBadge, backgroundColor: bias.article_10_compliance?.bias_detected ? '#fff5f5' : '#f0fff4', color: bias.article_10_compliance?.bias_detected ? '#e53e3e' : '#38a169' }}>
                  {bias.article_10_compliance?.status}
                </div>
                <div style={styles.downloadGroup}>
                  <button style={styles.downloadBtnPDF} onClick={() => generateBiasPDF(bias)}>PDF</button>
                  <button style={styles.downloadBtnCSV} onClick={() => generateBiasCSV(bias)}>CSV</button>
                  <button style={styles.downloadBtnJSON} onClick={() => downloadJSON(bias, 'bias_report.json')}>JSON</button>
                </div>
              </div>
            </div>

            <div style={styles.infoBox}>
              <strong>Model used: </strong>{bias.model_used}
              <br />
              <strong>Dataset: </strong>{bias.dataset}
              <br />
              <strong>Toolkit: </strong>{bias.toolkit}
            </div>

            {Object.entries(bias.fairness_analysis || {}).map(([key, analysis]) => (
              <div key={key}>
                <h3 style={styles.sectionHeading}>
                  {key === 'age_based' ? 'Age Based Analysis' : 'Personal Status Analysis'}
                </h3>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: '16px' }}>
                  Comparing: {analysis.group_a || analysis.privileged_group} vs {analysis.group_b || analysis.unprivileged_group}
                </p>
                {Object.entries(analysis)
                  .filter(([k]) => !['group_a', 'group_b', 'toolkit', 'success',
                    'privileged_group', 'unprivileged_group',
                    'base_rate_privileged', 'base_rate_unprivileged'].includes(k))
                  .map(([metric, data]) => {
                    if (typeof data !== 'object' || data === null) return null;
                    return (
                      <div key={metric} style={styles.metricCard}>
                        <div style={styles.metricHeader}>
                          <strong style={styles.metricName}>
                            {metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </strong>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={styles.metricValue}>{data.value}</span>
                            {data.bias_level && (
                              <span style={{ ...styles.impactBadge, backgroundColor: riskBg(data.bias_level), color: riskColor(data.bias_level) }}>
                                {data.bias_level}
                              </span>
                            )}
                            {data.status && (
                              <span style={{ ...styles.impactBadge, backgroundColor: data.status === 'ACCEPTABLE' ? '#f0fff4' : '#fff5f5', color: data.status === 'ACCEPTABLE' ? '#38a169' : '#e53e3e' }}>
                                {data.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <p style={styles.metricDesc}>{data.description}</p>
                        <p style={styles.metricThreshold}>Threshold: {data.threshold}</p>
                      </div>
                    );
                  })}
              </div>
            ))}

            <h3 style={styles.sectionHeading}>Recommendations</h3>
            {bias.recommendations?.map((rec, i) => (
              <div key={i} style={styles.recItem}>
                <span style={styles.recNumber}>{i + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  empty: { textAlign: 'center', padding: '80px 40px' },
  emptyBtn: { padding: '12px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#2E75B6', color: 'white', cursor: 'pointer', fontSize: '15px', marginTop: '16px' },
  header: { backgroundColor: '#1a365d', padding: '24px 40px', color: 'white' },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '12px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  headerTitle: { fontSize: '24px', fontWeight: '700' },
  headerSub: { fontSize: '14px', opacity: 0.7, marginTop: '4px' },
  backBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  newAssessBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  combinedBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2E75B6', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },
  summarySection: { padding: '24px 40px', maxWidth: '1200px', margin: '0 auto' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  summaryCard: { backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: '4px solid', textAlign: 'center' },
  summaryLabel: { fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' },
  summaryValue: { fontSize: '22px', fontWeight: '800', marginBottom: '4px' },
  summaryArticle: { fontSize: '11px', color: '#a0aec0' },
  // FIX: top changed from 0 to 64px so tabs stick below the navbar
  tabsSection: { backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: '64px', zIndex: 10 },
  tabsBar: { display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '0 40px', overflowX: 'auto' },
  tab: { padding: '16px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', borderBottom: '3px solid transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' },
  tabArticle: { fontSize: '11px', color: '#a0aec0' },
  tabContent: { maxWidth: '1200px', margin: '0 auto', padding: '32px 40px' },
  reportHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  reportTitle: { fontSize: '22px', fontWeight: '700', color: '#1a365d' },
  reportSub: { fontSize: '14px', color: '#718096', marginTop: '4px' },
  riskBadge: { padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' },
  downloadGroup: { display: 'flex', gap: '6px' },
  downloadBtnPDF: { padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#C0392B', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  downloadBtnCSV: { padding: '8px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#27AE60', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  downloadBtnJSON: { padding: '8px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#2E75B6', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  sectionHeading: { fontSize: '17px', fontWeight: '700', color: '#1a365d', marginTop: '28px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #EBF5FB' },
  rightCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '12px', borderLeft: '4px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  rightHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' },
  rightName: { fontSize: '15px', color: '#1a365d' },
  impactBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },
  rightDesc: { fontSize: '13px', color: '#718096', marginBottom: '6px' },
  rightJustification: { fontSize: '13px', color: '#4a5568', fontStyle: 'italic', marginBottom: '8px' },
  mitigationBox: { backgroundColor: '#f7fafc', borderRadius: '6px', padding: '10px 12px', fontSize: '13px', color: '#4a5568', borderLeft: '3px solid #2E75B6', marginTop: '8px' },
  recItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #f0f4f8', fontSize: '14px', color: '#4a5568' },
  recNumber: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2E75B6', color: 'white', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  threatCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '12px', borderLeft: '4px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  threatHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' },
  strideBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#EBF5FB', color: '#2E75B6' },
  notApplicable: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#f7fafc', color: '#a0aec0' },
  threatDesc: { fontSize: '13px', color: '#718096', marginBottom: '4px' },
  threatReason: { fontSize: '13px', color: '#4a5568', fontStyle: 'italic' },
  controlCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '4px solid #27AE60' },
  controlName: { fontSize: '14px', color: '#1a365d' },
  controlDesc: { fontSize: '13px', color: '#718096', margin: '4px 0' },
  controlMitigates: { fontSize: '12px', color: '#27AE60', fontWeight: '600' },
  infoBox: { backgroundColor: '#EBF5FB', borderRadius: '8px', padding: '14px 18px', fontSize: '14px', color: '#2E75B6', marginBottom: '20px', lineHeight: '1.8' },
  featureRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f4f8' },
  featureRank: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EBF5FB', color: '#2E75B6', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureInfo: { flex: 1, minWidth: '140px' },
  featureName: { fontSize: '14px', fontWeight: '600', color: '#1a365d' },
  featureDesc: { fontSize: '12px', color: '#718096' },
  featureBarWrap: { flex: 2, backgroundColor: '#f0f4f8', borderRadius: '4px', height: '8px', overflow: 'hidden' },
  featureBar: { height: '8px', borderRadius: '4px', transition: 'width 0.5s ease' },
  ragRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' },
  ragCard: { borderRadius: '10px', padding: '20px', textAlign: 'center', border: '2px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  riskFactorCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '12px', borderLeft: '4px solid', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  riskFactorHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' },
  riskFactorDesc: { fontSize: '13px', color: '#718096', marginBottom: '8px' },
  scoreBadge: { padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', backgroundColor: '#EBF5FB', color: '#2E75B6' },
  metricCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  metricHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' },
  metricName: { fontSize: '14px', color: '#1a365d' },
  metricValue: { fontSize: '18px', fontWeight: '700', color: '#1a365d' },
  metricDesc: { fontSize: '13px', color: '#718096', marginBottom: '4px' },
  metricThreshold: { fontSize: '12px', color: '#a0aec0', fontStyle: 'italic' },
};

export default Results;