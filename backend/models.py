from pydantic import BaseModel
from typing import List, Optional

class Finding(BaseModel):
    type: str
    value: str
    line_number: int
    risk_level: str

class AnalysisResult(BaseModel):
    summary: str
    findings: List[Finding]
    risk_score: int
    risk_level: str
    insights: List[str]
