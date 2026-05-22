import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TOTAL_STEPS = 5;

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
    model_version: '1.0.0'
  });

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 1));

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
          systemName: form.system_name
        }
      });
    } catch (err) {
      setError('Could not connect to the backend. Please make sure the API server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarInner}>
          <span style={styles.logo}>EU AI Act Compliance Tool</span>
          <span style={styles.stepLabel}>Step {step} of {TOTAL_STEPS}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressBg}>
        <div style={{ ...styles.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* Step content */}
      <div style={styles.content}>
        <div style={styles.card}>

          {step === 1 && (
            <div>
              <h2 style={styles.stepTitle}>System Information</h2>
              <p style={styles.stepDesc}>Tell us the basic details about your credit scoring AI system.</p>

              <label style={styles.label}>System Name</label>
              <input style={styles.input} placeholder="e.g. CreditScore AI v1"
                value={form.system_name} onChange={e => update('system_name', e.target.value)} />

              <label style={styles.label}>Organisation Name</label>
              <input style={styles.input} placeholder="e.g. Bank of Ireland"
                value={form.organisation_name} onChange={e => update('organisation_name', e.target.value)} />

              <label style={styles.label}>Intended Purpose</label>
              <textarea style={styles.textarea} placeholder="Describe what the system does and why it is used"
                value={form.intended_purpose} onChange={e => update('intended_purpose', e.target.value)} />

              <label style={styles.label}>Model Version</label>
              <input style={styles.input} placeholder="e.g. 1.0.0"
                value={form.model_version} onChange={e => update('model_version', e.target.value)} />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={styles.stepTitle}>Data Processing</h2>
              <p style={styles.stepDesc}>Tell us about the data your system uses.</p>

              <label style={styles.label}>Data Sources</label>
              <input style={styles.input} placeholder="e.g. Credit bureau data, bank transaction history"
                value={form.data_sources} onChange={e => update('data_sources', e.target.value)} />

              <label style={styles.label}>Data Retention Period</label>
              <input style={styles.input} placeholder="e.g. 5 years"
                value={form.data_retention_period} onChange={e => update('data_retention_period', e.target.value)} />

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Does the system process personal data?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.uses_personal_data ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('uses_personal_data', true)}>Yes</button>
                  <button style={!form.uses_personal_data ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('uses_personal_data', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Does it process special category data (ethnicity, health, religion)?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.uses_special_category_data ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('uses_special_category_data', true)}>Yes</button>
                  <button style={!form.uses_special_category_data ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('uses_special_category_data', false)}>No</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={styles.stepTitle}>Model and Deployment</h2>
              <p style={styles.stepDesc}>Tell us about how the model works and who it affects.</p>

              <label style={styles.label}>Model Type</label>
              <select style={styles.input} value={form.model_type}
                onChange={e => update('model_type', e.target.value)}>
                <option value="">Select model type</option>
                <option value="Logistic Regression">Logistic Regression</option>
                <option value="Gradient Boosted Trees">Gradient Boosted Trees</option>
                <option value="Random Forest">Random Forest</option>
                <option value="Neural Network">Neural Network</option>
                <option value="XGBoost">XGBoost</option>
                <option value="Other">Other</option>
              </select>

              <label style={styles.label}>Affected Population</label>
              <input style={styles.input} placeholder="e.g. Personal loan applicants in Ireland"
                value={form.affected_population} onChange={e => update('affected_population', e.target.value)} />

              <label style={styles.label}>Estimated Users Per Year</label>
              <input style={styles.input} type="number" placeholder="e.g. 50000"
                value={form.estimated_users_per_year} onChange={e => update('estimated_users_per_year', e.target.value)} />

              <label style={styles.label}>Explainability Method (if any)</label>
              <select style={styles.input} value={form.explainability_method}
                onChange={e => update('explainability_method', e.target.value)}>
                <option value="">None implemented</option>
                <option value="SHAP">SHAP</option>
                <option value="LIME">LIME</option>
                <option value="Other">Other</option>
              </select>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Does the system make automated decisions?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.automated_decision_making ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('automated_decision_making', true)}>Yes</button>
                  <button style={!form.automated_decision_making ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('automated_decision_making', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Is human oversight available?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.human_oversight_available ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('human_oversight_available', true)}>Yes</button>
                  <button style={!form.human_oversight_available ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('human_oversight_available', false)}>No</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={styles.stepTitle}>Security and Access</h2>
              <p style={styles.stepDesc}>Tell us about the security measures in place for the system.</p>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Is the model accessible via an external API?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.external_api_access ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('external_api_access', true)}>Yes</button>
                  <button style={!form.external_api_access ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('external_api_access', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Is data shared with third parties?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.third_party_data_sharing ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('third_party_data_sharing', true)}>Yes</button>
                  <button style={!form.third_party_data_sharing ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('third_party_data_sharing', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Is audit logging enabled?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.audit_logging_enabled ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('audit_logging_enabled', true)}>Yes</button>
                  <button style={!form.audit_logging_enabled ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('audit_logging_enabled', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Are access controls implemented?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.access_controls_implemented ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('access_controls_implemented', true)}>Yes</button>
                  <button style={!form.access_controls_implemented ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('access_controls_implemented', false)}>No</button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 style={styles.stepTitle}>Risk and Compliance History</h2>
              <p style={styles.stepDesc}>Final questions about the compliance status of your system.</p>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Has the system been independently audited before?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.previously_audited ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('previously_audited', true)}>Yes</button>
                  <button style={!form.previously_audited ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('previously_audited', false)}>No</button>
                </div>
              </div>

              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Are there any known bias issues with the system?</span>
                <div style={styles.toggleButtons}>
                  <button style={form.known_bias_issues ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('known_bias_issues', true)}>Yes</button>
                  <button style={!form.known_bias_issues ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => update('known_bias_issues', false)}>No</button>
                </div>
              </div>

              <div style={styles.summaryBox}>
                <h4 style={styles.summaryTitle}>Summary</h4>
                <p style={styles.summaryItem}><strong>System:</strong> {form.system_name || 'Not provided'}</p>
                <p style={styles.summaryItem}><strong>Organisation:</strong> {form.organisation_name || 'Not provided'}</p>
                <p style={styles.summaryItem}><strong>Model Type:</strong> {form.model_type || 'Not provided'}</p>
                <p style={styles.summaryItem}><strong>Personal Data:</strong> {form.uses_personal_data ? 'Yes' : 'No'}</p>
                <p style={styles.summaryItem}><strong>Explainability:</strong> {form.explainability_method || 'None'}</p>
                <p style={styles.summaryItem}><strong>Human Oversight:</strong> {form.human_oversight_available ? 'Yes' : 'No'}</p>
              </div>

              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={styles.navRow}>
            {step > 1 && (
              <button style={styles.backBtn} onClick={back}>Back</button>
            )}
            {step < TOTAL_STEPS ? (
              <button style={styles.nextBtn} onClick={next}>Next</button>
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
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  topBar: {
    backgroundColor: '#1a365d',
    padding: '16px 40px',
  },
  topBarInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  logo: {
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
  },
  progressBg: {
    height: '4px',
    backgroundColor: '#e2e8f0',
  },
  progressFill: {
    height: '4px',
    backgroundColor: '#2E75B6',
    transition: 'width 0.3s ease',
  },
  content: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '15px',
    color: '#718096',
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a365d',
    marginBottom: '6px',
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f7fafc',
    minHeight: '100px',
    resize: 'vertical',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #f0f4f8',
    gap: '16px',
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#2d3748',
    flex: 1,
  },
  toggleButtons: {
    display: 'flex',
    gap: '8px',
  },
  toggleActive: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  toggleInactive: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#718096',
    cursor: 'pointer',
    fontSize: '14px',
  },
  summaryBox: {
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '24px',
    border: '1px solid #e2e8f0',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: '12px',
  },
  summaryItem: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '6px',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '12px',
  },
  backBtn: {
    padding: '12px 28px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#718096',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  nextBtn: {
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  submitBtn: {
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#27AE60',
    color: 'white',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  error: {
    color: '#e53e3e',
    fontSize: '14px',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fff5f5',
    borderRadius: '8px',
    border: '1px solid #fed7d7',
  },
};

export default Questionnaire;