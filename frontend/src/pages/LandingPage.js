import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.badge}>EU AI Act Compliance Tool</div>
        <h1 style={styles.title}>AI Act Compliance for<br />Credit Scoring Systems</h1>
        <p style={styles.subtitle}>
          Generate your Fundamental Rights Impact Assessment, Cybersecurity Threat Model,
          Explainability Report, Risk Score and Bias Detection Report in minutes.
          All outputs are mapped directly to the EU AI Act.
        </p>
        <button style={styles.ctaButton} onClick={() => navigate('/assess')}>
          Start Compliance Assessment
        </button>
        <p style={styles.note}>Free to use. No data stored. Results generated instantly.</p>
      </div>

      {/* Five modules */}
      <div style={styles.modulesSection}>
        <h2 style={styles.sectionTitle}>Five Compliance Outputs in One Tool</h2>
        <div style={styles.grid}>
          {modules.map((mod, i) => (
            <div key={i} style={styles.card}>
              <div style={{ ...styles.cardIcon, backgroundColor: mod.color }}>
                {mod.icon}
              </div>
              <h3 style={styles.cardTitle}>{mod.title}</h3>
              <p style={styles.cardText}>{mod.description}</p>
              <div style={styles.cardArticle}>{mod.article}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsRow}>
          {steps.map((step, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <h4 style={styles.stepTitle}>{step.title}</h4>
              <p style={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal basis */}
      <div style={styles.legalSection}>
        <h2 style={styles.sectionTitle}>Legal Basis</h2>
        <div style={styles.articlesRow}>
          {articles.map((a, i) => (
            <div key={i} style={styles.articleBadge}>
              <strong>{a.id}</strong>
              <span>{a.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div style={styles.footer}>
        <h2 style={styles.footerTitle}>Ready to assess your credit scoring AI?</h2>
        <button style={styles.ctaButton} onClick={() => navigate('/assess')}>
          Begin Assessment
        </button>
        <p style={styles.footerNote}>
          Built for MSc in Software Design with Cybersecurity at TUS Athlone
        </p>
      </div>

    </div>
  );
}

const modules = [
  {
    icon: 'FRIA',
    title: 'Fundamental Rights Impact Assessment',
    description: 'Assess the impact on privacy, non-discrimination, dignity, fair treatment and effective remedy under the EU Charter.',
    article: 'Article 27',
    color: '#2E75B6'
  },
  {
    icon: 'CYBER',
    title: 'Cybersecurity Threat Model',
    description: 'Identify data poisoning, model evasion, membership inference and other AI threats using MITRE ATLAS and STRIDE-AI.',
    article: 'Article 15',
    color: '#C0392B'
  },
  {
    icon: 'XAI',
    title: 'Explainability Report',
    description: 'Generate feature importance analysis showing which factors drive credit decisions and satisfy transparency requirements.',
    article: 'Article 13',
    color: '#27AE60'
  },
  {
    icon: 'RISK',
    title: 'Risk Scoring Dashboard',
    description: 'Score all identified risks on a red, amber and green scale mapped to Article 9 risk management obligations.',
    article: 'Article 9',
    color: '#E67E22'
  },
  {
    icon: 'BIAS',
    title: 'Bias Detection Report',
    description: 'Compute demographic parity, disparate impact and equal opportunity metrics on the German Credit dataset.',
    article: 'Article 10(5)',
    color: '#8E44AD'
  }
];

const steps = [
  {
    title: 'Fill in the Questionnaire',
    text: 'Answer questions about your credit scoring AI system including its data sources, model type, deployment context and security setup.'
  },
  {
    title: 'Knowledge Graph Analysis',
    text: 'Your answers are matched against EU AI Act articles and MITRE ATLAS threats stored in a Neo4j knowledge graph.'
  },
  {
    title: 'Five Reports Generated',
    text: 'The tool produces all five compliance outputs instantly, each mapped to the specific EU AI Act articles that apply.'
  },
  {
    title: 'Download and Submit',
    text: 'Download your reports for regulatory submission or to share with your supervisor for review.'
  }
];

const articles = [
  { id: 'Article 9', title: 'Risk Management' },
  { id: 'Article 10(5)', title: 'Bias Detection' },
  { id: 'Article 13', title: 'Transparency' },
  { id: 'Article 15', title: 'Cybersecurity' },
  { id: 'Article 27', title: 'FRIA' },
  { id: 'Annex III', title: 'Credit Scoring' },
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  header: {
    background: 'linear-gradient(135deg, #1a365d 0%, #2E75B6 100%)',
    color: 'white',
    padding: '80px 40px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  },
  ctaButton: {
    backgroundColor: 'white',
    color: '#2E75B6',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 16px',
  },
  note: {
    fontSize: '14px',
    opacity: 0.7,
  },
  modulesSection: {
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#1a365d',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  cardIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '800',
    color: 'white',
    margin: '0 auto 16px',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#1a365d',
  },
  cardText: {
    fontSize: '13px',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  cardArticle: {
    display: 'inline-block',
    backgroundColor: '#EBF5FB',
    color: '#2E75B6',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  howSection: {
    backgroundColor: 'white',
    padding: '60px 40px',
  },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  step: {
    textAlign: 'center',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#2E75B6',
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1a365d',
  },
  stepText: {
    fontSize: '14px',
    color: '#718096',
    lineHeight: '1.5',
  },
  legalSection: {
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  articlesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
  },
  articleBadge: {
    backgroundColor: 'white',
    border: '2px solid #2E75B6',
    borderRadius: '8px',
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    minWidth: '140px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  footer: {
    background: 'linear-gradient(135deg, #1a365d 0%, #2E75B6 100%)',
    color: 'white',
    padding: '60px 40px',
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '24px',
  },
  footerNote: {
    marginTop: '16px',
    fontSize: '14px',
    opacity: 0.7,
  },
};

export default LandingPage;