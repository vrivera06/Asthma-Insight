from __future__ import annotations

from pathlib import Path
from typing import List

import joblib
import numpy as np
from fastapi import APIRouter, HTTPException

from ..schemas import PredictionResult, SymptomInput
from ..model.train import FEATURES_PATH, MODEL_PATH, FEATURE_NAMES, encode_row, train_and_save


router = APIRouter(prefix="/predict", tags=["predict"])


def _load_model():
    if not Path(MODEL_PATH).exists():
        # Train a synthetic model on first run so the API is usable immediately.
        train_and_save()
    model = joblib.load(MODEL_PATH)
    if Path(FEATURES_PATH).exists():
        feature_names: List[str] = joblib.load(FEATURES_PATH)
    else:
        feature_names = FEATURE_NAMES
    return model, feature_names


MODEL, FEATURE_NAMES_LOADED = _load_model()


def _risk_level(score: float) -> str:
    if score < 0.4:
        return "Low"
    if score < 0.7:
        return "Moderate"
    return "High"


def _top_factors(row: SymptomInput) -> List[str]:
    factors: List[str] = []
    if row.wheezing == "yes":
        factors.append("Wheezing")
    if row.shortnessOfBreath == "yes":
        factors.append("Shortness of breath")
    if row.chestTightness == "yes":
        factors.append("Chest tightness")
    if row.coughing == "yes":
        factors.append("Coughing")
    if row.smokes == "yes":
        factors.append("Smoking")
    if row.familyHistory == "yes":
        factors.append("Family history of asthma")
    if row.pollenExposure == "yes":
        factors.append("Pollen exposure")
    if row.dustExposure == "yes":
        factors.append("Dust exposure")
    if row.petAllergy == "yes":
        factors.append("Pet allergy")

    seen = set()
    uniq: List[str] = []
    for f in factors:
        if f not in seen:
            uniq.append(f)
            seen.add(f)
    return uniq[:3]


def _advice_for(row: SymptomInput) -> List[str]:
    tips: List[str] = []

    if row.smokes == "yes":
        tips.append("Quitting smoking can significantly reduce your asthma risk.")
    if row.physicalActivity == "low":
        tips.append("Increasing aerobic activity can strengthen lung function over time.")
    if row.pollenExposure == "yes" or row.dustExposure == "yes":
        tips.append("Reducing exposure to pollen and dust may help prevent symptom flare-ups.")
    if row.familyHistory == "yes":
        tips.append("Given your family history, regular check-ups with a clinician are recommended.")

    if not tips:
        tips.append("Maintain a healthy lifestyle and monitor any changes in your breathing.")

    if len(tips) > 3:
        tips = tips[:3]
    return tips


@router.post("", response_model=PredictionResult)
async def predict(input_data: SymptomInput) -> PredictionResult:
    try:
        x = encode_row(input_data.dict())
        x = np.expand_dims(x, axis=0)

        if hasattr(MODEL, "predict_proba"):
            proba = float(MODEL.predict_proba(x)[0, 1])
        else:
            pred = float(MODEL.predict(x)[0])
            proba = 0.75 if pred == 1.0 else 0.1
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=500, detail=f"Model inference failed: {exc}") from exc

    risk_level = _risk_level(proba)

    if risk_level == "High":
        diagnosis = "High likelihood of asthma based on your responses."
    elif risk_level == "Moderate":
        diagnosis = "Some features suggest a possible risk of asthma."
    else:
        diagnosis = "Low estimated asthma risk from the information provided."

    top = _top_factors(input_data)
    advice = _advice_for(input_data)

    return PredictionResult(
        riskScore=proba,
        riskLevel=risk_level,
        diagnosis=diagnosis,
        topFactors=top,
        advice=advice,
    )


