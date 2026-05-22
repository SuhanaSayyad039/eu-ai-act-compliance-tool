import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assess" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;