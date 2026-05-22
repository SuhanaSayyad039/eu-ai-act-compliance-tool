from fastapi import APIRouter
from models import CreditScoringSystem
from database import driver

router = APIRouter()

@router.post("/assess")
async def assess_risk(system: CreditScoringSystem):

    results = {
        "system_name": system.system_name,
        "article": "Article 9 - EU AI Act",
        "assessment_type": "Risk Scoring Dashboard",
        "risk_factors": [],
        "risk_summary": {},
        "overall_risk_score": 0,
        "overall_risk_level": "LOW",
        "risk_color": "GREEN",
        "article_9_compliance": {}
    }

    with driver.session() as session:
        risk_query = session.run("""
            MATCH (r:RiskFactor)-[:GOVERNED_BY]->(a:LegalArticle)
            RETURN r.id AS id, r.name AS name, r.description AS description,
                   r.severity AS severity, a.title AS article
        """)

        risk_list = []
        for record in risk_query:
            risk = {
                "risk_id": record["id"],
                "risk_name": record["name"],
                "description": record["description"],
                "base_severity": record["severity"],
                "actual_severity": record["severity"],
                "article": record["article"],
                "score": 0,
                "mitigation_status": "NOT_ADDRESSED",
                "mitigation_action": ""
            }

            rid = record["id"]

            if rid == "RISK_BIAS":
                if system.known_bias_issues:
                    risk["actual_severity"] = "HIGH"
                    risk["score"] = 9
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Conduct bias audit using AIF360 and apply mitigation before deployment"
                elif system.uses_special_category_data:
                    risk["score"] = 7
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Run fairness metrics under Article 10(5) with mandatory safeguards"
                else:
                    risk["score"] = 5
                    risk["mitigation_status"] = "RECOMMENDED"
                    risk["mitigation_action"] = "Regular fairness monitoring recommended as best practice"

            elif rid == "RISK_OPAQUE":
                if not system.explainability_method:
                    risk["actual_severity"] = "HIGH"
                    risk["score"] = 9
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Implement SHAP or LIME explainability before deployment"
                else:
                    risk["actual_severity"] = "LOW"
                    risk["score"] = 2
                    risk["mitigation_status"] = "ADDRESSED"
                    risk["mitigation_action"] = f"Explainability method {system.explainability_method} is implemented"

            elif rid == "RISK_DATA":
                if system.uses_special_category_data:
                    risk["score"] = 7
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Implement Article 10(5) safeguards for special category data processing"
                else:
                    risk["score"] = 4
                    risk["mitigation_status"] = "RECOMMENDED"
                    risk["mitigation_action"] = "Conduct data quality audit and document data governance procedures"

            elif rid == "RISK_SCOPE":
                if not system.previously_audited:
                    risk["score"] = 6
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Define and document scope boundaries in technical documentation before deployment"
                else:
                    risk["score"] = 3
                    risk["mitigation_status"] = "ADDRESSED"
                    risk["mitigation_action"] = "Previous audit provides scope documentation baseline"

            elif rid == "RISK_OVERSIGHT":
                if not system.human_oversight_available:
                    risk["actual_severity"] = "HIGH"
                    risk["score"] = 9
                    risk["mitigation_status"] = "REQUIRED"
                    risk["mitigation_action"] = "Implement mandatory human review for adverse decisions under Article 14"
                elif system.automated_decision_making:
                    risk["score"] = 5
                    risk["mitigation_status"] = "RECOMMENDED"
                    risk["mitigation_action"] = "Ensure human reviewers have authority and information to override decisions"
                else:
                    risk["score"] = 2
                    risk["mitigation_status"] = "ADDRESSED"
                    risk["mitigation_action"] = "Human oversight is implemented"

            elif rid == "RISK_DRIFT":
                risk["score"] = 4
                risk["mitigation_status"] = "RECOMMENDED"
                risk["mitigation_action"] = "Implement continuous model monitoring and performance tracking in production"

            risk_list.append(risk)

    results["risk_factors"] = risk_list

    high_count = sum(1 for r in risk_list if r["actual_severity"] == "HIGH")
    medium_count = sum(1 for r in risk_list if r["actual_severity"] == "MEDIUM")
    low_count = sum(1 for r in risk_list if r["actual_severity"] == "LOW")

    results["risk_summary"] = {
        "high_risks": high_count,
        "medium_risks": medium_count,
        "low_risks": low_count,
        "total_risks": len(risk_list)
    }

    total_score = sum(r["score"] for r in risk_list)
    max_score = len(risk_list) * 9
    normalized = round((total_score / max_score) * 10, 1) if max_score > 0 else 0
    results["overall_risk_score"] = normalized

    if normalized >= 7 or high_count >= 2:
        results["overall_risk_level"] = "HIGH"
        results["risk_color"] = "RED"
    elif normalized >= 4 or high_count >= 1:
        results["overall_risk_level"] = "MEDIUM"
        results["risk_color"] = "AMBER"
    else:
        results["overall_risk_level"] = "LOW"
        results["risk_color"] = "GREEN"

    required = [r for r in risk_list if r["mitigation_status"] == "REQUIRED"]
    results["article_9_compliance"] = {
        "status": "NON-COMPLIANT" if required else "COMPLIANT",
        "outstanding_actions": len(required),
        "requirement": "Article 9 requires providers to establish and maintain a risk management system",
        "next_review": "Before deployment" if required else "6 months after deployment"
    }

    return results