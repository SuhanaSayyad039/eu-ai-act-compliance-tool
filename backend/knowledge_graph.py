from database import driver

def setup_knowledge_graph():
    with driver.session() as session:

        session.run("MATCH (n) DETACH DELETE n")

        # Legal Articles
        articles = [
            ('ART9', 'Article 9 - Risk Management System',
             'Providers must establish a risk management system identifying and mitigating risks to health, safety and fundamental rights.',
             'risk_management'),
            ('ART10', 'Article 10(5) - Bias Detection',
             'Providers may process special category data strictly for detecting and correcting bias with mandatory safeguards.',
             'bias_detection'),
            ('ART13', 'Article 13 - Transparency and Explainability',
             'High-risk AI systems must provide information sufficient to correctly interpret outputs and enable human oversight.',
             'explainability'),
            ('ART15', 'Article 15 - Accuracy, Robustness and Cybersecurity',
             'High-risk AI systems must be resilient against attempts to alter use, outputs or performance by unauthorised third parties.',
             'cybersecurity'),
            ('ART27', 'Article 27 - Fundamental Rights Impact Assessment',
             'Deployers of high-risk AI must conduct a FRIA before first use assessing impacts on fundamental rights.',
             'fria'),
        ]
        for aid, title, desc, obligation in articles:
            session.run("""
                CREATE (:LegalArticle {id: $aid, title: $title, description: $desc, obligation: $obligation})
            """, aid=aid, title=title, desc=desc, obligation=obligation)

        # Fundamental Rights
        rights = [
            ('RIGHT_PRIVACY', 'Right to Privacy', 'Article 7 EU Charter - respect for private and family life'),
            ('RIGHT_DATA', 'Right to Data Protection', 'Article 8 EU Charter - protection of personal data'),
            ('RIGHT_NONDISCRIMINATION', 'Right to Non-Discrimination', 'Article 21 EU Charter - prohibition of discrimination'),
            ('RIGHT_FAIRNESS', 'Right to Fair Treatment', 'Article 20 EU Charter - equality before the law'),
            ('RIGHT_REMEDY', 'Right to Effective Remedy', 'Article 47 EU Charter - right to an effective remedy'),
            ('RIGHT_DIGNITY', 'Right to Human Dignity', 'Article 1 EU Charter - inviolability of human dignity'),
            ('RIGHT_EXPLANATION', 'Right to Explanation', 'GDPR Article 22 - rights related to automated decision making'),
        ]
        for rid, name, desc in rights:
            session.run("""
                CREATE (:FundamentalRight {id: $rid, name: $name, description: $desc})
            """, rid=rid, name=name, desc=desc)

        # Threats
        threats = [
            ('THREAT_POISON', 'Data Poisoning', 'ART15',
             'Attacker manipulates training data to cause model to learn incorrect patterns', 'HIGH', 'STRIDE_TAMPERING'),
            ('THREAT_EVASION', 'Model Evasion', 'ART15',
             'Attacker crafts adversarial inputs to cause model to make wrong predictions', 'HIGH', 'STRIDE_SPOOFING'),
            ('THREAT_INVERSION', 'Model Inversion', 'ART15',
             'Attacker reconstructs training data from model outputs violating data privacy', 'MEDIUM', 'STRIDE_INFO_DISCLOSURE'),
            ('THREAT_EXTRACTION', 'Model Extraction', 'ART15',
             'Attacker queries model to steal its functionality and intellectual property', 'MEDIUM', 'STRIDE_INFO_DISCLOSURE'),
            ('THREAT_MEMBERSHIP', 'Membership Inference', 'ART15',
             'Attacker determines whether a specific record was used in model training', 'MEDIUM', 'STRIDE_INFO_DISCLOSURE'),
            ('THREAT_BACKDOOR', 'Backdoor Attack', 'ART15',
             'Attacker embeds hidden trigger in model that causes misclassification on specific inputs', 'HIGH', 'STRIDE_TAMPERING'),
            ('THREAT_REPUDIATION', 'Audit Log Tampering', 'ART15',
             'Attacker modifies or deletes audit logs to hide malicious activity', 'HIGH', 'STRIDE_REPUDIATION'),
            ('THREAT_DOS', 'Denial of Service', 'ART15',
             'Attacker floods model with queries causing system unavailability', 'MEDIUM', 'STRIDE_DOS'),
        ]
        for tid, name, article, desc, severity, stride in threats:
            session.run("""
                CREATE (:Threat {id: $tid, name: $name, article: $article,
                        description: $desc, severity: $severity, stride_category: $stride})
            """, tid=tid, name=name, article=article, desc=desc, severity=severity, stride=stride)

        # Controls
        controls = [
            ('CTRL_DATA_VAL', 'Data Validation Controls',
             'Validate and sanitise all training data before use', 'THREAT_POISON'),
            ('CTRL_ADV_TRAIN', 'Adversarial Training',
             'Train model on adversarial examples to improve robustness', 'THREAT_EVASION'),
            ('CTRL_DP', 'Differential Privacy',
             'Apply differential privacy to training process to protect individual records', 'THREAT_MEMBERSHIP'),
            ('CTRL_ACCESS', 'Access Controls',
             'Restrict model access to authorised users only with authentication', 'THREAT_EXTRACTION'),
            ('CTRL_ENCRYPT', 'Encryption',
             'Encrypt model weights and training data at rest and in transit', 'THREAT_INVERSION'),
            ('CTRL_AUDIT', 'Immutable Audit Logging',
             'Maintain tamper-evident logs of all model decisions and data access', 'THREAT_REPUDIATION'),
            ('CTRL_RATE', 'Rate Limiting',
             'Limit query rates to prevent extraction and denial of service attacks', 'THREAT_DOS'),
            ('CTRL_SCAN', 'Model Scanning',
             'Scan model checkpoints for backdoor triggers before deployment', 'THREAT_BACKDOOR'),
        ]
        for cid, name, desc, threat_id in controls:
            session.run("""
                CREATE (:Control {id: $cid, name: $name, description: $desc, mitigates: $threat_id})
            """, cid=cid, name=name, desc=desc, threat_id=threat_id)

        # Risk Factors
        risk_factors = [
            ('RISK_BIAS', 'Algorithmic Bias',
             'Model may discriminate based on protected characteristics', 'HIGH', 'ART10'),
            ('RISK_OPAQUE', 'Lack of Explainability',
             'Model decisions cannot be explained to affected individuals', 'HIGH', 'ART13'),
            ('RISK_DATA', 'Data Quality Issues',
             'Training data may contain errors or historical biases', 'MEDIUM', 'ART10'),
            ('RISK_SCOPE', 'Scope Creep',
             'Model used beyond its intended and validated purpose', 'MEDIUM', 'ART9'),
            ('RISK_OVERSIGHT', 'Insufficient Human Oversight',
             'Automated decisions made without adequate human review', 'HIGH', 'ART13'),
            ('RISK_DRIFT', 'Model Drift',
             'Model performance degrades over time as data distribution changes', 'MEDIUM', 'ART9'),
        ]
        for rid, name, desc, severity, article in risk_factors:
            session.run("""
                CREATE (:RiskFactor {id: $rid, name: $name, description: $desc,
                        severity: $severity, article: $article})
            """, rid=rid, name=name, desc=desc, severity=severity, article=article)

        # Relationships
        article_rights = [
            ('ART27', 'RIGHT_PRIVACY'), ('ART27', 'RIGHT_DATA'),
            ('ART27', 'RIGHT_NONDISCRIMINATION'), ('ART27', 'RIGHT_FAIRNESS'),
            ('ART27', 'RIGHT_REMEDY'), ('ART27', 'RIGHT_DIGNITY'),
            ('ART13', 'RIGHT_EXPLANATION'),
            ('ART10', 'RIGHT_NONDISCRIMINATION'), ('ART10', 'RIGHT_FAIRNESS'),
        ]
        for article_id, right_id in article_rights:
            session.run("""
                MATCH (a:LegalArticle {id: $article_id})
                MATCH (r:FundamentalRight {id: $right_id})
                CREATE (a)-[:REQUIRES_ASSESSMENT_OF]->(r)
            """, article_id=article_id, right_id=right_id)

        for threat in threats:
            session.run("""
                MATCH (t:Threat {id: $tid})
                MATCH (a:LegalArticle {id: $aid})
                CREATE (t)-[:ADDRESSED_BY]->(a)
            """, tid=threat[0], aid=threat[2])

        for control in controls:
            session.run("""
                MATCH (c:Control {id: $cid})
                MATCH (t:Threat {id: $tid})
                CREATE (c)-[:MITIGATES]->(t)
            """, cid=control[0], tid=control[3])

        for risk in risk_factors:
            session.run("""
                MATCH (r:RiskFactor {id: $rid})
                MATCH (a:LegalArticle {id: $aid})
                CREATE (r)-[:GOVERNED_BY]->(a)
            """, rid=risk[0], aid=risk[4])

        print("Knowledge graph setup complete!")
        print("Created: 5 Legal Articles, 7 Fundamental Rights, 8 Threats, 8 Controls, 6 Risk Factors")


if __name__ == "__main__":
    setup_knowledge_graph()