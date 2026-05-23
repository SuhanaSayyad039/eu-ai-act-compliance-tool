import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand} onClick={() => navigate('/')}>
          <div style={styles.brandIcon}>EU</div>
          <div>
            <div style={styles.brandName}>AI Act Compliance Tool</div>
            <div style={styles.brandSub}>Credit Scoring AI Assessment</div>
          </div>
        </div>
        <div style={styles.links}>
          {location.pathname !== '/' && (
            <button style={styles.homeBtn} onClick={() => navigate('/')}>
              Home
            </button>
          )}
          {location.pathname === '/' && (
            <button style={styles.startBtn} onClick={() => navigate('/assess')}>
              Start Assessment
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#0f2744',
    borderBottom: '3px solid #2E75B6',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  brandIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#2E75B6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '800',
    fontSize: '14px',
  },
  brandName: {
    color: 'white',
    fontWeight: '700',
    fontSize: '15px',
  },
  brandSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '11px',
  },
  links: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  homeBtn: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  startBtn: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2E75B6',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default Navbar;