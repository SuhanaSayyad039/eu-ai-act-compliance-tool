from fastapi import APIRouter
from models import CreditScoringSystem
from database import driver

router = APIRouter()

@router.post("/assess")
async def assess_fria(system: CreditScoringSystem):

    results = {
        "system_name": system.system_name,
        "organisation": system.organisation_name,
        "article": "Article 27 - EU AI Act",
        "assessment_type": "Fundamental Rights Impact Assessment",
        "rights_assessed": [],
        "obligations": [],
        "recommendations": [],
        "overall_risk_level": "LOW"
    }

    with driver.session() as session:
        rights_query = session.run("""
            MATCH (a:LegalArticle {id: 'ART27'})-[:REQUIRES_ASSESSMENT_OF]->(r:FundamentalRight)
            RETURN r.name AS name, r.description AS description, r.id AS id
        """)

        rights_list = []
        for record in rights_query:
            right = {
                "right": record["name"],
                "description": record["description"],
                "impact_level": "LOW",
                "impact_justification": "",
                "mitigation": ""
            }

            rid = record["id"]

            if rid == "RIGHT_PRIVACY":
                if system.uses_personal_data:
                    right["impact_level"] = "HIGH"
                    right["impact_justification"] = "System processes personal data for credit decisions affecting individual privacy"
                    right["mitigation"] = "Implement data minimisation, purpose limitation and retention controls"

            elif rid == "RIGHT_DATA":
                if system.uses_personal_data:
                    right["impact_level"] = "HIGH"
                    right["impact_justification"] = "Personal data processing must comply with GDPR data protection principles"
                    right["mitigation"] = "Conduct DPIA, appoint DPO if required, implement data subject rights procedures"

            elif rid == "RIGHT_NONDISCRIMINATION":
                if system.uses_special_category_data or system.known_bias_issues:
                    right["impact_level"] = "HIGH"
                    right["impact_justification"] = "Special category data or known bias issues create discrimination risk"
                    right["mitigation"] = "Run bias audit using AIF360, implement fairness constraints, monitor outcomes by demographic group"
                else:
                    right["impact_level"] = "MEDIUM"
                    right["impact_justification"] = "Credit scoring AI carries inherent discrimination risk"
                    right["mitigation"] = "Regular fairness monitoring and bias testing recommended"

            elif rid == "RIGHT_FAIRNESS":
                if system.automated_decision_making and not system.human_oversight_available:
                    right["impact_level"] = "HIGH"
                    right["impact_justification"] = "Fully automated decisions without human oversight violates right to fair treatment"
                    right["mitigation"] = "Implement mandatory human review for all adverse decisions"
                elif system.automated_decision_making:
                    right["impact_level"] = "MEDIUM"
                    right["impact_justification"] = "Automated decision making with human oversight present"
                    right["mitigation"] = "Ensure human reviewers have authority and information to override decisions"

            elif rid == "RIGHT_REMEDY":
                right["impact_level"] = "MEDIUM"
                right["impact_justification"] = "Individuals denied credit must have access to meaningful redress"
                right["mitigation"] = "Establish clear complaints procedure and right to human review of adverse decisions"

            elif rid == "RIGHT_DIGNITY":
                if system.automated_decision_making and not system.human_oversight_available:
                    right["impact_level"] = "MEDIUM"
                    right["impact_justification"] = "Fully automated consequential decisions may undermine human dignity"
                    right["mitigation"] = "Ensure meaningful human involvement in decision making process"

            elif rid == "RIGHT_EXPLANATION":
                if not system.explainability_method:
                    right["impact_level"] = "HIGH"
                    right["impact_justification"] = "No explainability method implemented violates GDPR Article 22 right to explanation"
                    right["mitigation"] = "Implement SHAP to provide explanations for individual credit decisions"
                else:
                    right["impact_level"] = "LOW"
                    right["impact_justification"] = f"Explainability method {system.explainability_method} is implemented"
                    right["mitigation"] = "Ensure explanations are in plain language accessible to affected individuals"

            rights_list.append(right)

        results["rights_assessed"] = rights_list

        obligations_query = session.run("""
            MATCH (a:LegalArticle {id: 'ART27'})
            RETURN a.title AS title, a.description AS description
        """)
        for record in obligations_query:
            results["obligations"].append({
                "article": record["title"],
                "requirement": record["description"]
            })

        if system.uses_special_category_data:
            art10_query = session.run("""
                MATCH (a:LegalArticle {id: 'ART10'})
                RETURN a.title AS title, a.description AS description
            """)
            for record in art10_query:
                results["obligations"].append({
                    "article": record["title"],
                    "requirement": record["description"]
                })

    high_count = sum(1 for r in rights_list if r["impact_level"] == "HIGH")
    medium_count = sum(1 for r in rights_list if r["impact_level"] == "MEDIUM")

    if high_count >= 3:
        results["overall_risk_level"] = "HIGH"
    elif high_count >= 1 or medium_count >= 3:
        results["overall_risk_level"] = "MEDIUM"
    else:
        results["overall_risk_level"] = "LOW"

    results["recommendations"] = [
        "Complete this FRIA before first deployment of the credit scoring system",
        "Review and update this FRIA whenever the system is significantly modified",
        "Make FRIA results available to supervisory authorities upon request",
        "Consult affected communities and civil society organisations where possible",
        "Document all mitigation measures implemented and monitor their effectiveness"
    ]

    if not system.previously_audited:
        results["recommendations"].append("Conduct an independent third party audit before deployment")

    if system.third_party_data_sharing:
        results["recommendations"].append("Review data sharing agreements for compliance with Article 26 joint controller obligations")

    return results