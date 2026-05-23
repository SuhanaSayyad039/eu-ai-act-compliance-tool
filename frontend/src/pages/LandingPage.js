import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>Built for EU AI Act Compliance</div>
          <h1 style={styles.heroTitle}>
            Compliance Tool for<br />Credit Scoring AI Systems
          </h1>
          <p style={styles.heroDesc}>
            Fill in one questionnaire about your credit scoring AI system and
            instantly receive five legally traceable compliance reports mapped
            to the EU AI Act.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryBtn} onClick={() => navigate('/assess')}>
              Start Assessment
            </button>
            <button
              style={styles.ghostBtn}
              onClick={() => window.open('https://github.com/SuhanaSayyad039/eu-ai-act-compliance-tool', '_blank')}
            >
              View on GitHub
            </button>
          </div>
          <p style={styles.heroNote}>
            No data stored. Reports generated instantly. Open source.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statItem}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionLabel}>WHAT IT PRODUCES</div>
          <h2 style={styles.sectionTitle}>Five Compliance Reports in One Tool</h2>
          <p style={styles.sectionDesc}>
            Each report is mapped directly to a specific Article of the EU AI Act
            and generated automatically from your questionnaire answers.
          </p>
          <div style={styles.modulesGrid}>
            {modules.map((mod, i) => (
              <div key={i} style={styles.moduleCard}>
                <div style={{ ...styles.moduleTag, backgroundColor: mod.color }}>
                  {mod.tag}
                </div>
                <h3 style={styles.moduleTitle}>{mod.title}</h3>
                <p style={styles.moduleDesc}>{mod.desc}</p>
                <div style={styles.moduleArticle}>{mod.article}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...styles.section, backgroundColor: 'white' }}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionLabel}>THE PROCESS</div>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <div style={styles.stepNum}>{i + 1}</div>
                <h4 style={styles.stepTitle}>{step.title}</h4>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal articles */}
      <div style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionLabel}>LEGAL GROUNDING</div>
          <h2 style={styles.sectionTitle}>EU AI Act Articles Covered</h2>
          <div style={styles.articlesGrid}>
            {articles.map((a, i) => (
              <div key={i} style={styles.articleCard}>
                <div style={styles.articleId}>{a.id}</div>
                <div style={styles.articleTitle}>{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ ...styles.section, backgroundColor: 'white' }}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionLabel}>TECHNOLOGY</div>
          <h2 style={styles.sectionTitle}>Built With</h2>
          <div style={styles.techGrid}>
            {tech.map((t, i) => (
              <div key={i} style={styles.techCard}>
                <div style={styles.techName}>{t.name}</div>
                <div style={styles.techUse}>{t.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to assess your credit scoring AI?</h2>
          <button style={styles.primaryBtn} onClick={() => navigate('/assess')}>
            Start Free Assessment
          </button>
        </div>
      </div>

    </div>
  );
}

const stats = [
  { value: '5', label: 'Compliance Reports' },
  { value: '5', label: 'EU AI Act Articles' },
  { value: '8', label: 'Threat Categories' },
  { value: '7', label: 'Fundamental Rights Assessed' },
];

const modules = [
  {
    tag: 'FRIA',
    title: 'Fundamental Rights Impact Assessment',
    desc: 'Assesses impacts on privacy, non-discrimination, dignity, fair treatment and effective remedy under the EU Charter of Fundamental Rights.',
    article: 'Article 27',
    color: '#2E75B6'
  },
  {
    tag: 'CYBER',
    title: 'Cybersecurity Threat Model',
    desc: 'Identifies applicable threats using MITRE ATLAS and STRIDE-AI frameworks, with ENISA FAICP control recommendations.',
    article: 'Article 15',
    color: '#C0392B'
  },
  {
    tag: 'XAI',
    title: 'Explainability Report',
    desc: 'Generates feature importance analysis on the German Credit dataset showing which factors drive credit decisions.',
    article: 'Article 13',
    color: '#27AE60'
  },
  {
    tag: 'RISK',
    title: 'Risk Scoring Dashboard',
    desc: 'Scores each identified risk on a 0 to 9 scale and presents an overall red, amber or green compliance status.',
    article: 'Article 9',
    color: '#E67E22'
  },
  {
    tag: 'BIAS',
    title: 'Bias Detection Report',
    desc: 'Computes demographic parity, disparate impact ratio and equal opportunity difference on the German Credit dataset.',
    article: 'Article 10(5)',
    color: '#8E44AD'
  },
];

const steps = [
  {
    title: 'Answer the Questionnaire',
    desc: 'Five short steps covering your system details, data processing, model type, security measures and compliance history.'
  },
  {
    title: 'Knowledge Graph Analysis',
    desc: 'Your answers are matched against EU AI Act articles, MITRE ATLAS threats and ENISA controls stored in a Neo4j knowledge graph.'
  },
  {
    title: 'Reports Generated',
    desc: 'All five compliance reports are produced instantly, each mapped to the specific legal articles that apply to your system.'
  },
  {
    title: 'Download and Review',
    desc: 'Download each report as a JSON file for regulatory submission or share directly with your compliance team.'
  },
];

const articles = [
  { id: 'Article 9', title: 'Risk Management System' },
  { id: 'Article 10(5)', title: 'Bias Detection' },
  { id: 'Article 13', title: 'Transparency and Explainability' },
  { id: 'Article 15', title: 'Accuracy, Robustness and Cybersecurity' },
  { id: 'Article 27', title: 'Fundamental Rights Impact Assessment' },
  { id: 'Annex III', title: 'Credit Scoring as High-Risk AI' },
];

const tech = [
  { name: 'React', use: 'Frontend UI' },
  { name: 'Python FastAPI', use: 'Backend API' },
  { name: 'Neo4j', use: 'Knowledge Graph' },
  { name: 'SHAP', use: 'Explainability' },
  { name: 'MITRE ATLAS', use: 'Threat Taxonomy' },
  { name: 'STRIDE-AI', use: 'Threat Modelling' },
  { name: 'Scikit-learn', use: 'Bias Detection' },
  { name: 'German Credit Dataset', use: 'Evaluation Dataset' },
];

const styles = {
  page: { backgroundColor: '#f0f4f8', minHeight: '100vh' },
  hero: {
    background: 'linear-gradient(160deg, #0f2744 0%, #1a4a7a 60%, #2E75B6 100%)',
    padding: '80px 32px 100px',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '720px', margin: '0 auto' },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: 'rgba(255,255,255,0.9)',
    padding: '5px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '24px',
    fontWeight: '600',
    letterSpacing: '0.3px',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.15',
    marginBottom: '20px',
    letterSpacing: '-0.5px',
  },
  heroDesc: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.7',
    marginBottom: '36px',
    maxWidth: '580px',
    margin: '0 auto 36px',
  },
  heroButtons: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '14px 32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },
  ghostBtn: {
    padding: '14px 32px',
    borderRadius: '8px',
    border: '2px solid rgba(255,255,255,0.4)',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  heroNote: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '16px',
  },
  statsBar: {
    backgroundColor: '#0f2744',
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  statItem: {
    padding: '20px 48px',
    textAlign: 'center',
    borderRight: '1px solid rgba(255,255,255,0.08)',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#2E75B6',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  section: { padding: '72px 32px' },
  sectionInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#2E75B6',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '12px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '34px',
    fontWeight: '800',
    color: '#0f2744',
    textAlign: 'center',
    marginBottom: '12px',
    letterSpacing: '-0.3px',
  },
  sectionDesc: {
    fontSize: '16px',
    color: '#718096',
    textAlign: 'center',
    maxWidth: '580px',
    margin: '0 auto 48px',
    lineHeight: '1.7',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
    border: '1px solid #e8edf3',
  },
  moduleTag: {
    display: 'inline-block',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  moduleTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  moduleDesc: {
    fontSize: '13px',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '14px',
  },
  moduleArticle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#2E75B6',
    backgroundColor: '#EBF5FB',
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '32px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepCard: { textAlign: 'center' },
  stepNum: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '18px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.6',
  },
  articlesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '14px',
    justifyContent: 'center',
  },
  articleCard: {
    backgroundColor: 'white',
    border: '2px solid #e8edf3',
    borderRadius: '10px',
    padding: '16px 24px',
    textAlign: 'center',
    minWidth: '160px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  articleId: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#2E75B6',
    marginBottom: '4px',
  },
  articleTitle: {
    fontSize: '12px',
    color: '#718096',
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  techCard: {
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    padding: '16px 20px',
    border: '1px solid #e8edf3',
  },
  techName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f2744',
    marginBottom: '4px',
  },
  techUse: {
    fontSize: '12px',
    color: '#718096',
  },
  cta: {
    background: 'linear-gradient(160deg, #0f2744 0%, #2E75B6 100%)',
    padding: '80px 32px',
    textAlign: 'center',
  },
  ctaInner: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: {
    fontSize: '34px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '16px',
  },
  ctaDesc: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  ctaNote: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '20px',
  },
};

export default LandingPage;