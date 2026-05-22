from pydantic import BaseModel
from typing import Optional

class CreditScoringSystem(BaseModel):
    # Basic system information
    system_name: str
    organisation_name: str
    intended_purpose: str

    # Data processing
    uses_personal_data: bool
    uses_special_category_data: bool
    data_sources: str
    data_retention_period: str

    # Model information
    model_type: str
    automated_decision_making: bool
    human_oversight_available: bool
    explainability_method: Optional[str] = None

    # Deployment context
    deployment_sector: str
    affected_population: str
    estimated_users_per_year: int

    # Security
    external_api_access: bool
    third_party_data_sharing: bool
    audit_logging_enabled: bool
    access_controls_implemented: bool

    # Risk indicators
    previously_audited: bool
    known_bias_issues: bool
    model_version: str