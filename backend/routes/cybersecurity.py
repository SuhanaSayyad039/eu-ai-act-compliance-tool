from fastapi import APIRouter
from models import CreditScoringSystem
from database import driver

router = APIRouter()

@router.post("/assess")
async def assess_cybersecurity(system: CreditScoringSystem):

    results = {
        "system_name": system.system_name,
        "article": "Article 15 - EU AI Act",
        "assessment_type": "Cybersecurity Threat Model",
        "threats_identified": [],
        "controls_recommended": [],
        "stride_summary": {},
        "overall_security_risk": "LOW"
    }

    with driver.session() as session:
        threats_query = session.run("""
            MATCH (t:Threat)-[:ADDRESSED_BY]->(a:LegalArticle {id: 'ART15'})
            RETURN t.id AS id, t.name AS name, t.description AS description,
                   t.severity AS severity, t.stride_category AS stride
        """)

        threats_list = []
        for record in threats_query:
            threat = {
                "threat_id": record["id"],
                "threat_name": record["name"],
                "description": record["description"],
                "severity": record["severity"],
                "stride_category": record["stride"],
                "applicable": False,
                "reason": ""
            }

            tid = record["id"]

            if tid == "THREAT_POISON":
                threat["applicable"] = True
                threat["reason"] = "All ML credit scoring models are vulnerable to training data poisoning"

            elif tid == "THREAT_EVASION":
                threat["applicable"] = True
                threat["reason"] = "Credit scoring models are vulnerable to adversarial input manipulation"

            elif tid == "THREAT_EXTRACTION":
                if system.external_api_access:
                    threat["applicable"] = True
                    threat["reason"] = "External API access enables model extraction through query attacks"
                else:
                    threat["reason"] = "No external API access reduces model extraction risk"

            elif tid == "THREAT_MEMBERSHIP":
                if system.uses_personal_data:
                    threat["applicable"] = True
                    threat["reason"] = "Model trained on personal data is vulnerable to membership inference attacks"

            elif tid == "THREAT_INVERSION":
                if system.uses_special_category_data:
                    threat["applicable"] = True
                    threat["reason"] = "Special category data in training increases model inversion risk"

            elif tid == "THREAT_BACKDOOR":
                threat["applicable"] = True
                threat["reason"] = "Supply chain attacks on training data or model weights apply to all deployed models"

            elif tid == "THREAT_REPUDIATION":
                if not system.audit_logging_enabled:
                    threat["applicable"] = True
                    threat["severity"] = "HIGH"
                    threat["reason"] = "No audit logging implemented creates repudiation risk"
                else:
                    threat["reason"] = "Audit logging is implemented reducing repudiation risk"

            elif tid == "THREAT_DOS":
                if system.external_api_access:
                    threat["applicable"] = True
                    threat["reason"] = "External API access creates denial of service attack surface"

            threats_list.append(threat)

        results["threats_identified"] = threats_list

        applicable_ids = [t["threat_id"] for t in threats_list if t["applicable"]]

        if applicable_ids:
            controls_query = session.run("""
                MATCH (c:Control)-[:MITIGATES]->(t:Threat)
                WHERE t.id IN $threat_ids
                RETURN c.name AS name, c.description AS description, t.name AS mitigates_threat
            """, threat_ids=applicable_ids)

            for record in controls_query:
                results["controls_recommended"].append({
                    "control": record["name"],
                    "description": record["description"],
                    "mitigates": record["mitigates_threat"]
                })

    stride_summary = {}
    for threat in results["threats_identified"]:
        if threat["applicable"]:
            cat = threat["stride_category"]
            if cat not in stride_summary:
                stride_summary[cat] = []
            stride_summary[cat].append(threat["threat_name"])
    results["stride_summary"] = stride_summary

    high_threats = sum(1 for t in results["threats_identified"] if t["applicable"] and t["severity"] == "HIGH")
    medium_threats = sum(1 for t in results["threats_identified"] if t["applicable"] and t["severity"] == "MEDIUM")

    if high_threats >= 3:
        results["overall_security_risk"] = "HIGH"
    elif high_threats >= 1 or medium_threats >= 3:
        results["overall_security_risk"] = "MEDIUM"
    else:
        results["overall_security_risk"] = "LOW"

    return results