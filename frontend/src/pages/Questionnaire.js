import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TOTAL_STEPS = 5;

const stepTitles = [
  'System Information',
  'Data Processing',
  'Model and Deployment',
  'Security Measures',
  'Risk and Compliance History',
];

const stepDescs = [
  'Basic details about your credit scoring AI system.',
  'How your system collects and processes data.',
  'How the model works and who it affects.',
  'Security controls in place for the system.',
  'Compliance history and known issues.',
];

function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={ttStyles.wrapper}>
      <span
        style={ttStyles.icon}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
      >
        ?
      </span>
      {visible && (
        <span style={ttStyles.box}>
          {text}
        </span>
      )}
    </span>
  );
}

const ttStyles = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
    marginLeft: '6px',
    verticalAlign: 'middle',
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    userSelect: 'none',
    flexShrink: 0,
  },
  box: {
    position: 'absolute',
    left: '24px',
    top: '-4px',
    backgroundColor: '#1a202c',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.6',
    width: '280px',
    zIndex: 999,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    fontWeight: '400',
  },
};

function Toggle({ label, hint, value, onChange, tooltip }) {
  return (
    <div style={tStyles.row}>
      <div style={tStyles.left}>
        <div style={tStyles.label}>
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        {hint && <div style={tStyles.hint}>{hint}</div>}
      </div>
      <div style={tStyles.buttons}>
        <button
          style={value ? tStyles.active : tStyles.inactive}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          style={!value ? tStyles.active : tStyles.inactive}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

const tStyles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #f0f4f8',
    gap: '16px',
  },
  left: { flex: 1 },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    display: 'flex',
    alignItems: 'center',
  },
  hint: { fontSize: '12px', color: '#a0aec0', marginTop: '2px' },
  buttons: { display: 'flex', gap: '6px' },
  active: {
    padding: '7px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
  },
  inactive: {
    padding: '7px 18px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#a0aec0',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

function Field({ label, hint, tooltip, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ ...fStyles.label, display: 'flex', alignItems: 'center' }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {hint && <div style={fStyles.hint}>{hint}</div>}
      {children}
    </div>
  );
}

const fStyles = {
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '6px',
  },
  hint: {
    fontSize: '12px',
    color: '#a0aec0',
    marginBottom: '6px',
  },
};

function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    system_name: '',
    organisation_name: '',
    intended_purpose: '',
    uses_personal_data: true,
    uses_special_category_data: false,
    data_sources: '',
    data_retention_period: '',
    model_type: '',
    automated_decision_making: true,
    human_oversight_available: true,
    explainability_method: '',
    deployment_sector: 'Banking and Financial Services',
    affected_population: '',
    estimated_users_per_year: 0,
    external_api_access: false,
    third_party_data_sharing: false,
    audit_logging_enabled: false,
    access_controls_implemented: false,
    previously_audited: false,
    known_bias_issues: false,
    model_version: '1.0.0',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fafbfc',
    color: '#1a202c',
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        estimated_users_per_year: parseInt(form.estimated_users_per_year) || 0
      };
      const [fria, cyber, xai, bias, risk] = await Promise.all([
        axios.post('http://127.0.0.1:8000/api/fria/assess', payload),
        axios.post('http://127.0.0.1:8000/api/cybersecurity/assess', payload),
        axios.post('http://127.0.0.1:8000/api/xai/assess', payload),
        axios.post('http://127.0.0.1:8000/api/bias/assess', payload),
        axios.post('http://127.0.0.1:8000/api/risk/assess', payload),
      ]);
      navigate('/results', {
        state: {
          fria: fria.data,
          cybersecurity: cyber.data,
          xai: xai.data,
          bias: bias.data,
          risk: risk.data,
          systemName: form.system_name,
        },
      });
    } catch (err) {
      setError('Could not connect to the backend. Please make sure the API server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarInner}>
          <div style={styles.sidebarTitle}>Assessment Steps</div>
          {stepTitles.map((title, i) => {
            const num = i + 1;
            const done = num < step;
            const active = num === step;
            return (
              <div key={i} style={{ ...styles.sidebarItem, opacity: num > step ? 0.4 : 1 }}>
                <div style={{
                  ...styles.sidebarDot,
                  backgroundColor: done ? '#27AE60' : active ? '#2E75B6' : '#cbd5e0',
                }}>
                  {done ? '✓' : num}
                </div>
                <div style={{ ...styles.sidebarItemTitle, color: active ? 'white' : done ? '#a0c8a0' : '#a0aec0' }}>
                  {title}
                </div>
              </div>
            );
          })}
          <div style={styles.sidebarInfo}>
            <div style={styles.sidebarInfoTitle}>About this tool</div>
            <p style={styles.sidebarInfoText}>
              Your answers are used to generate five EU AI Act compliance reports.
              No data is stored after your session ends.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.stepBadge}>Step {step} of {TOTAL_STEPS}</div>
            <h2 style={styles.cardTitle}>{stepTitles[step - 1]}</h2>
            <p style={styles.cardDesc}>{stepDescs[step - 1]}</p>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>

          <div style={styles.cardBody}>

            {step === 1 && (
              <>
                <Field
                  label="System Name"
                  tooltip="The official name of your AI system. This will appear on all generated compliance reports."
                >
                  <input style={inputStyle} placeholder="e.g. CreditScore AI v1"
                    value={form.system_name} onChange={e => update('system_name', e.target.value)} />
                </Field>

                <Field
                  label="Organisation Name"
                  tooltip="The name of the company or institution deploying this AI system. Under the EU AI Act, this is the deployer organisation responsible for compliance."
                >
                  <input style={inputStyle} placeholder="e.g. Bank of Ireland"
                    value={form.organisation_name} onChange={e => update('organisation_name', e.target.value)} />
                </Field>

                <Field
                  label="Intended Purpose"
                  tooltip="Describe the specific task this AI system performs and why it is used. Under Article 13, this must be documented and communicated to users. Be specific about what decisions the system supports or makes."
                >
                  <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                    placeholder="e.g. Automated scoring of personal loan applications based on financial history and credit bureau data"
                    value={form.intended_purpose} onChange={e => update('intended_purpose', e.target.value)} />
                </Field>

                <Field
                  label="Model Version"
                  tooltip="The version number of the AI model currently deployed. Under Article 9, the risk management system must be updated when the model version changes significantly."
                >
                  <input style={inputStyle} placeholder="e.g. 1.0.0"
                    value={form.model_version} onChange={e => update('model_version', e.target.value)} />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field
                  label="Data Sources"
                  tooltip="List all sources of data used to train or run this AI system. This includes credit bureau feeds, bank transaction records, employment data, or any other input. Under Article 10, all data sources must be documented."
                >
                  <input style={inputStyle} placeholder="e.g. Credit bureau data, bank transaction history, employment records"
                    value={form.data_sources} onChange={e => update('data_sources', e.target.value)} />
                </Field>

                <Field
                  label="Data Retention Period"
                  tooltip="How long personal data is stored by this system. Under GDPR Article 5(1)(e) and EU AI Act Article 12, retention periods must be defined and justified. Longer retention periods increase compliance obligations."
                >
                  <input style={inputStyle} placeholder="e.g. 5 years"
                    value={form.data_retention_period} onChange={e => update('data_retention_period', e.target.value)} />
                </Field>

                <Toggle
                  label="Does the system process personal data?"
                  tooltip="Personal data is any information that can identify a living individual, directly or indirectly. This includes names, ID numbers, location data, financial records, or any combination of factors. If yes, GDPR and EU AI Act data governance obligations apply."
                  value={form.uses_personal_data}
                  onChange={v => update('uses_personal_data', v)}
                />

                <Toggle
                  label="Does it process special category data?"
                  tooltip="Special category data under GDPR Article 9 includes: racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, biometric data, health data, sex life or sexual orientation. Processing this data for bias detection under Article 10(5) requires explicit safeguards."
                  value={form.uses_special_category_data}
                  onChange={v => update('uses_special_category_data', v)}
                />
              </>
            )}

            {step === 3 && (
              <>
                <Field
                  label="Model Type"
                  tooltip="The type of machine learning model used for credit scoring. Different model types have different explainability and risk profiles. Neural networks are harder to explain than logistic regression, which affects Article 13 compliance."
                >
                  <select style={inputStyle} value={form.model_type}
                    onChange={e => update('model_type', e.target.value)}>
                    <option value="">Select model type</option>
                    <option>Logistic Regression</option>
                    <option>Gradient Boosted Trees</option>
                    <option>Random Forest</option>
                    <option>Neural Network</option>
                    <option>XGBoost</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field
                  label="Affected Population"
                  tooltip="Describe the group of people whose data is processed and who are affected by the system's decisions. Under Article 27 (FRIA), you must identify and assess impacts on all groups affected by the system."
                >
                  <input style={inputStyle} placeholder="e.g. Personal loan applicants in Ireland aged 18 and above"
                    value={form.affected_population} onChange={e => update('affected_population', e.target.value)} />
                </Field>

                <Field
                  label="Estimated Users Per Year"
                  tooltip="The approximate number of individuals whose credit applications will be processed by this system per year. This affects the scale of the FRIA and the level of monitoring required under Article 9."
                >
                  <input style={inputStyle} type="number" placeholder="e.g. 50000"
                    value={form.estimated_users_per_year} onChange={e => update('estimated_users_per_year', e.target.value)} />
                </Field>

                <Field
                  label="Explainability Method"
                  tooltip="The method used to explain individual predictions to users. Under Article 13, high-risk AI systems must provide information sufficient for users to interpret outputs. SHAP and LIME are the two most widely accepted methods for credit scoring AI."
                >
                  <select style={inputStyle} value={form.explainability_method}
                    onChange={e => update('explainability_method', e.target.value)}>
                    <option value="">None implemented</option>
                    <option>SHAP</option>
                    <option>LIME</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Toggle
                  label="Does the system make automated decisions?"
                  tooltip="An automated decision is one made by the AI system without meaningful human review of each individual case. Under GDPR Article 22 and EU AI Act Article 14, individuals have the right not to be subject to solely automated decisions with significant effects."
                  value={form.automated_decision_making}
                  onChange={v => update('automated_decision_making', v)}
                />

                <Toggle
                  label="Is human oversight available?"
                  tooltip="Human oversight means a qualified person can review, question, and override the system's decision before it takes effect. Under Article 14, high-risk AI systems must allow human oversight. If oversight is absent, this is a significant compliance gap."
                  value={form.human_oversight_available}
                  onChange={v => update('human_oversight_available', v)}
                />
              </>
            )}

            {step === 4 && (
              <>
                <Toggle
                  label="Is the model accessible via an external API?"
                  tooltip="An external API means third parties outside your organisation can send queries directly to the model. Under Article 15, this creates additional cybersecurity risks including model extraction attacks, denial of service attacks, and adversarial evasion."
                  value={form.external_api_access}
                  onChange={v => update('external_api_access', v)}
                />

                <Toggle
                  label="Is data shared with third parties?"
                  tooltip="Third party data sharing means sending personal data or model outputs to external organisations such as data brokers, analytics providers, or partner institutions. This triggers Article 26 joint controller obligations and additional GDPR requirements."
                  value={form.third_party_data_sharing}
                  onChange={v => update('third_party_data_sharing', v)}
                />

                <Toggle
                  label="Is audit logging enabled?"
                  tooltip="Audit logging means all model decisions, data access events, and system actions are recorded in tamper-evident logs. Under Article 12, high-risk AI systems must log operations automatically. Without logging, repudiation attacks are possible and regulatory investigations cannot be supported."
                  value={form.audit_logging_enabled}
                  onChange={v => update('audit_logging_enabled', v)}
                />

                <Toggle
                  label="Are access controls implemented?"
                  tooltip="Access controls include authentication (verifying who is accessing the system), authorisation (restricting what they can do), and role-based permissions. Under Article 15, high-risk AI systems must implement appropriate cybersecurity measures including access restriction."
                  value={form.access_controls_implemented}
                  onChange={v => update('access_controls_implemented', v)}
                />
              </>
            )}

            {step === 5 && (
              <>
                <Toggle
                  label="Has the system been independently audited before?"
                  tooltip="An independent audit means an assessment conducted by a third party with no financial or operational interest in the outcome. Under Article 43, certain high-risk AI systems require third party conformity assessment. A previous audit provides documented evidence of prior compliance review."
                  value={form.previously_audited}
                  onChange={v => update('previously_audited', v)}
                />

                <Toggle
                  label="Are there any known bias issues with the system?"
                  tooltip="Known bias issues include documented cases where the system produces unfair outcomes for specific demographic groups, or where internal testing has flagged statistically significant differences in decision rates across protected characteristics such as age, sex, or ethnicity."
                  value={form.known_bias_issues}
                  onChange={v => update('known_bias_issues', v)}
                />

                <div style={styles.summary}>
                  <div style={styles.summaryTitle}>Review Your Answers</div>
                  <div style={styles.summaryGrid}>
                    {[
                      ['System', form.system_name || 'Not provided'],
                      ['Organisation', form.organisation_name || 'Not provided'],
                      ['Model Type', form.model_type || 'Not provided'],
                      ['Personal Data', form.uses_personal_data ? 'Yes' : 'No'],
                      ['Special Category Data', form.uses_special_category_data ? 'Yes' : 'No'],
                      ['Explainability', form.explainability_method || 'None'],
                      ['Human Oversight', form.human_oversight_available ? 'Yes' : 'No'],
                      ['Audit Logging', form.audit_logging_enabled ? 'Yes' : 'No'],
                    ].map(([k, v], i) => (
                      <div key={i} style={styles.summaryRow}>
                        <span style={styles.summaryKey}>{k}</span>
                        <span style={styles.summaryVal}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}
              </>
            )}

          </div>

          <div style={styles.cardFooter}>
            {step > 1 && (
              <button style={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button style={styles.nextBtn} onClick={() => setStep(s => s + 1)}>
                Continue
              </button>
            ) : (
              <button style={styles.submitBtn} onClick={submit} disabled={loading}>
                {loading ? 'Generating Reports...' : 'Generate Compliance Reports'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: '#f0f4f8' },
  sidebar: { width: '280px', backgroundColor: '#0f2744', flexShrink: 0, padding: '32px 0' },
  sidebarInner: { padding: '0 24px' },
  sidebarTitle: { fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' },
  sidebarItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  sidebarDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0 },
  sidebarItemTitle: { fontSize: '13px', fontWeight: '600' },
  sidebarInfo: { marginTop: '36px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' },
  sidebarInfoTitle: { fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  sidebarInfoText: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' },
  main: { flex: 1, padding: '40px 48px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '640px', overflow: 'hidden' },
  cardHeader: { padding: '28px 32px 0' },
  stepBadge: { fontSize: '12px', fontWeight: '700', color: '#2E75B6', backgroundColor: '#EBF5FB', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', marginBottom: '12px', letterSpacing: '0.3px' },
  cardTitle: { fontSize: '22px', fontWeight: '800', color: '#0f2744', marginBottom: '6px' },
  cardDesc: { fontSize: '14px', color: '#a0aec0', marginBottom: '20px' },
  progressBar: { height: '3px', backgroundColor: '#f0f4f8', borderRadius: '2px', overflow: 'hidden' },
  progressFill: { height: '3px', backgroundColor: '#2E75B6', borderRadius: '2px', transition: 'width 0.4s ease' },
  cardBody: { padding: '24px 32px' },
  cardFooter: { padding: '20px 32px', borderTop: '1px solid #f0f4f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  backBtn: { padding: '11px 24px', borderRadius: '8px', border: '1.5px solid #e2e8f0', backgroundColor: 'white', color: '#718096', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  nextBtn: { padding: '11px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#2E75B6', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginLeft: 'auto' },
  submitBtn: { padding: '11px 28px', borderRadius: '8px', border: 'none', backgroundColor: '#27AE60', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginLeft: 'auto' },
  summary: { backgroundColor: '#f7fafc', borderRadius: '10px', padding: '20px', marginTop: '20px', border: '1px solid #e8edf3' },
  summaryTitle: { fontSize: '13px', fontWeight: '700', color: '#0f2744', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  summaryGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #edf2f7' },
  summaryKey: { color: '#718096', fontWeight: '600' },
  summaryVal: { color: '#0f2744', fontWeight: '600' },
  errorBox: { backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#e53e3e', marginTop: '16px' },
};

export default Questionnaire;