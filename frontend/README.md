# EU AI Act Compliance Tool

A unified compliance tool for high-risk credit scoring AI systems under the EU AI Act (Regulation 2024/1689). Built as part of an MSc in Software Design with Cybersecurity at the Technological University of the Shannon, Athlone.

## What it does

This tool takes a structured questionnaire about a credit scoring AI system and automatically generates five compliance reports mapped to specific articles of the EU AI Act:

| Report | EU AI Act Article |
|--------|------------------|
| Fundamental Rights Impact Assessment (FRIA) | Article 27 |
| Cybersecurity Threat Model (MITRE ATLAS + STRIDE-AI) | Article 15 |
| Explainability Report (Feature Importance Analysis) | Article 13 |
| Risk Scoring Dashboard (Red, Amber, Green) | Article 9 |
| Bias Detection Report (Fairness Metrics) | Article 10(5) |

## Why it matters

The EU AI Act classifies credit scoring AI as high-risk under Annex III point 5(b). From August 2026, organisations deploying such systems must satisfy all five compliance obligations listed above. No existing open-source tool integrates all five into a single workflow. This tool fills that gap.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Recharts, Axios |
| Backend | Python 3.11, FastAPI |
| Knowledge Graph | Neo4j, Cypher |
| Explainability | SHAP, XGBoost |
| Bias Detection | Scikit-learn, Pandas |
| Dataset | German Credit (Statlog), UCI ML Repository |

## Architecture

The tool is structured as a four-layer web application:

1. **Frontend** — React step-by-step questionnaire and results dashboard
2. **Backend API** — Python FastAPI with five endpoint groups
3. **Knowledge Graph** — Neo4j storing EU AI Act articles, MITRE ATLAS threats, fundamental rights and ENISA FAICP controls as connected nodes
4. **Analysis Modules** — SHAP for explainability, logistic regression and fairness metrics for bias detection, knowledge graph traversal for FRIA and cybersecurity

## Getting Started

### Prerequisites

- Python 3.11
- Node.js 18 or above
- Neo4j Desktop

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn neo4j python-dotenv shap xgboost scikit-learn pandas numpy reportlab pydantic
```

Create a `.env` file in the backend folder: