from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List


class SymptomInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: str  # "male" | "female" | "other"
    smokes: str  # "yes" | "no"
    physicalActivity: str  # "low" | "moderate" | "high"
    pollenExposure: str  # "yes" | "no"
    dustExposure: str  # "yes" | "no"
    petAllergy: str  # "yes" | "no"
    familyHistory: str  # "yes" | "no"
    wheezing: str  # "yes" | "no"
    shortnessOfBreath: str  # "yes" | "no"
    chestTightness: str  # "yes" | "no"
    coughing: str  # "yes" | "no"


class PredictionResult(BaseModel):
    riskScore: float = Field(..., ge=0.0, le=1.0)
    riskLevel: str  # "Low" | "Moderate" | "High"
    diagnosis: str
    topFactors: List[str]
    advice: List[str]


