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

function Toggle({ label, value, onChange, hint }) {
  return (
    <div style={tStyles.row}>
      <div style={tStyles.left}>
        <div style={tStyles.label}>{label}</div>
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
  label: { fontSize: '14px', fontWeight: '600', color: '#1a202c' },
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

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={fStyles.label}>{label}</label>
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
    transition: 'border-color 0.2s',
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, estimated_users_per_year: parseInt(form.estimated_users_per_year) || 0 };
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
                <div>
                  <div style={{ ...styles.sidebarItemTitle, color: active ? 'white' : done ? '#a0c8a0' : '#a0aec0' }}>
                    {title}
                  </div>
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
                <Field label="System Name" hint="The name of your credit scoring AI system">
                  <input style={inputStyle} placeholder="e.g. CreditScore AI v1"
                    value={form.system_name} onChange={e => update('system_name', e.target.value)} />
                </Field>
                <Field label="Organisation Name">
                  <input style={inputStyle} placeholder="e.g. Bank of Ireland"
                    value={form.organisation_name} onChange={e => update('organisation_name', e.target.value)} />
                </Field>
                <Field label="Intended Purpose" hint="Describe what the system does and why it is deployed">
                  <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                    placeholder="e.g. Automated scoring of personal loan applications based on financial history"
                    value={form.intended_purpose} onChange={e => update('intended_purpose', e.target.value)} />
                </Field>
                <Field label="Model Version">
                  <input style={inputStyle} placeholder="e.g. 1.0.0"
                    value={form.model_version} onChange={e => update('model_version', e.target.value)} />
                </Field>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Data Sources" hint="List the main sources of training and input data">
                  <input style={inputStyle} placeholder="e.g. Credit bureau data, bank transaction history"
                    value={form.data_sources} onChange={e => update('data_sources', e.target.value)} />
                </Field>
                <Field label="Data Retention Period">
                  <input style={inputStyle} placeholder="e.g. 5 years"
                    value={form.data_retention_period} onChange={e => update('data_retention_period', e.target.value)} />
                </Field>
                <Toggle
                  label="Does the system process personal data?"
                  hint="Any data that can identify an individual"
                  value={form.uses_personal_data}
                  onChange={v => update('uses_personal_data', v)}
                />
                <Toggle
                  label="Does it process special category data?"
                  hint="Ethnicity, health, religion, biometric or genetic data"
                  value={form.uses_special_category_data}
                  onChange={v => update('uses_special_category_data', v)}
                />
              </>
            )}

            {step === 3 && (
              <>
                <Field label="Model Type">
                  <select style={inputStyle} value={form.model_type} onChange={e => update('model_type', e.target.value)}>
                    <option value="">Select model type</option>
                    <option>Logistic Regression</option>
                    <option>Gradient Boosted Trees</option>
                    <option>Random Forest</option>
                    <option>Neural Network</option>
                    <option>XGBoost</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Affected Population" hint="Who are the people affected by this system's decisions?">
                  <input style={inputStyle} placeholder="e.g. Personal loan applicants in Ireland"
                    value={form.affected_population} onChange={e => update('affected_population', e.target.value)} />
                </Field>
                <Field label="Estimated Users Per Year">
                  <input style={inputStyle} type="number" placeholder="e.g. 50000"
                    value={form.estimated_users_per_year} onChange={e => update('estimated_users_per_year', e.target.value)} />
                </Field>
                <Field label="Explainability Method">
                  <select style={inputStyle} value={form.explainability_method} onChange={e => update('explainability_method', e.target.value)}>
                    <option value="">None implemented</option>
                    <option>SHAP</option>
                    <option>LIME</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Toggle
                  label="Does the system make automated decisions?"
                  hint="Decisions made without human review of each case"
                  value={form.automated_decision_making}
                  onChange={v => update('automated_decision_making', v)}
                />
                <Toggle
                  label="Is human oversight available?"
                  hint="Can a human review and override the system's decisions?"
                  value={form.human_oversight_available}
                  onChange={v => update('human_oversight_available', v)}
                />
              </>
            )}

            {step === 4 && (
              <>
                <Toggle
                  label="Is the model accessible via an external API?"
                  hint="Can third parties query the model directly?"
                  value={form.external_api_access}
                  onChange={v => update('external_api_access', v)}
                />
                <Toggle
                  label="Is data shared with third parties?"
                  value={form.third_party_data_sharing}
                  onChange={v => update('third_party_data_sharing', v)}
                />
                <Toggle
                  label="Is audit logging enabled?"
                  hint="Are all model decisions and data access events logged?"
                  value={form.audit_logging_enabled}
                  onChange={v => update('audit_logging_enabled', v)}
                />
                <Toggle
                  label="Are access controls implemented?"
                  hint="Authentication and authorisation controls restricting model access"
                  value={form.access_controls_implemented}
                  onChange={v => update('access_controls_implemented', v)}
                />
              </>
            )}

            {step === 5 && (
              <>
                <Toggle
                  label="Has the system been independently audited before?"
                  value={form.previously_audited}
                  onChange={v => update('previously_audited', v)}
                />
                <Toggle
                  label="Are there any known bias issues with the system?"
                  hint="Documented or suspected unfair treatment of certain groups"
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
  page: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#f0f4f8',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#0f2744',
    flexShrink: 0,
    padding: '32px 0',
  },
  sidebarInner: { padding: '0 24px' },
  sidebarTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  sidebarDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    flexShrink: 0,
  },
  sidebarItemTitle: {
    fontSize: '13px',
    fontWeight: '600',
  },
  sidebarInfo: {
    marginTop: '36px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  sidebarInfoTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sidebarInfoText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: '1.6',
  },
  main: {
    flex: 1,
    padding: '40px 48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '640px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '28px 32px 0',
  },
  stepBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#2E75B6',
    backgroundColor: '#EBF5FB',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    marginBottom: '12px',
    letterSpacing: '0.3px',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0f2744',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#a0aec0',
    marginBottom: '20px',
  },
  progressBar: {
    height: '3px',
    backgroundColor: '#f0f4f8',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '3px',
    backgroundColor: '#2E75B6',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
  cardBody: {
    padding: '24px 32px',
  },
  cardFooter: {
    padding: '20px 32px',
    borderTop: '1px solid #f0f4f8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    padding: '11px 24px',
    borderRadius: '8px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#718096',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  nextBtn: {
    padding: '11px 28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  submitBtn: {
    padding: '11px 28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#27AE60',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  summary: {
    backgroundColor: '#f7fafc',
    borderRadius: '10px',
    padding: '20px',
    marginTop: '20px',
    border: '1px solid #e8edf3',
  },
  summaryTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    paddingBottom: '8px',
    borderBottom: '1px solid #edf2f7',
  },
  summaryKey: { color: '#718096', fontWeight: '600' },
  summaryVal: { color: '#0f2744', fontWeight: '600' },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #fed7d7',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '13px',
    color: '#e53e3e',
    marginTop: '16px',
  },
};

export default Questionnaire;