from __future__ import annotations

import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "model"
MODEL_PATH = MODEL_DIR / "asthma_model.pkl"
FEATURES_PATH = MODEL_DIR / "feature_names.pkl"


FEATURE_NAMES = [
    "age",
    "gender_male",
    "gender_female",
    "gender_other",
    "smokes",
    "physicalActivity",
    "pollenExposure",
    "dustExposure",
    "petAllergy",
    "familyHistory",
    "wheezing",
    "shortnessOfBreath",
    "chestTightness",
    "coughing",
]


def encode_row(row: dict) -> np.ndarray:
    gender = row.get("gender", "other")
    gender_male = 1.0 if gender == "male" else 0.0
    gender_female = 1.0 if gender == "female" else 0.0
    gender_other = 1.0 if gender not in ("male", "female") else 0.0

    def yn(key: str) -> float:
        return 1.0 if str(row.get(key, "no")).lower() == "yes" else 0.0

    pa_map = {"low": 0.0, "moderate": 1.0, "high": 2.0}
    pa = pa_map.get(str(row.get("physicalActivity", "low")).lower(), 0.0)

    values = [
        float(row.get("age", 0)),
        gender_male,
        gender_female,
        gender_other,
        yn("smokes"),
        pa,
        yn("pollenExposure"),
        yn("dustExposure"),
        yn("petAllergy"),
        yn("familyHistory"),
        yn("wheezing"),
        yn("shortnessOfBreath"),
        yn("chestTightness"),
        yn("coughing"),
    ]
    return np.asarray(values, dtype=float)


def synthesize_dataset(n_samples: int = 5000, random_state: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(random_state)

    # Age: mildly skewed towards children / younger adults where asthma is more common
    ages = rng.integers(4, 75, size=n_samples)
    genders = rng.choice(["male", "female", "other"], size=n_samples, p=[0.48, 0.48, 0.04])
    # Lifestyle / environment priors
    smokes = rng.choice(["yes", "no"], size=n_samples, p=[0.22, 0.78])
    physical_activity = rng.choice(["low", "moderate", "high"], size=n_samples, p=[0.3, 0.5, 0.2])
    pollen = rng.choice(["yes", "no"], size=n_samples, p=[0.32, 0.68])
    dust = rng.choice(["yes", "no"], size=n_samples, p=[0.45, 0.55])
    pet = rng.choice(["yes", "no"], size=n_samples, p=[0.3, 0.7])
    family = rng.choice(["yes", "no"], size=n_samples, p=[0.28, 0.72])

    # Symptoms: coupled to some of the latent risk factors to avoid pure randomness
    # Start with base symptom probabilities influenced by environment / family history.
    base_symptom = 0.12
    base_symptom += np.where((pollen == "yes") | (dust == "yes"), 0.07, 0.0)
    base_symptom += np.where(family == "yes", 0.08, 0.0)
    base_symptom += np.where(ages < 12, 0.05, 0.0)
    base_symptom = np.clip(base_symptom, 0.05, 0.6)

    wheezing_prob = np.clip(base_symptom + 0.1, 0.08, 0.8)
    sob_prob = np.clip(base_symptom + 0.08, 0.06, 0.75)
    chest_prob = np.clip(base_symptom + 0.06, 0.05, 0.7)
    cough_prob = np.clip(base_symptom + 0.04, 0.05, 0.7)

    wheezing = np.where(rng.random(size=n_samples) < wheezing_prob, "yes", "no")
    sob = np.where(rng.random(size=n_samples) < sob_prob, "yes", "no")  # shortness of breath
    chest = np.where(rng.random(size=n_samples) < chest_prob, "yes", "no")
    cough = np.where(rng.random(size=n_samples) < cough_prob, "yes", "no")

    df = pd.DataFrame(
        {
            "age": ages,
            "gender": genders,
            "smokes": smokes,
            "physicalActivity": physical_activity,
            "pollenExposure": pollen,
            "dustExposure": dust,
            "petAllergy": pet,
            "familyHistory": family,
            "wheezing": wheezing,
            "shortnessOfBreath": sob,
            "chestTightness": chest,
            "coughing": cough,
        }
    )

    base = 0.05
    base += np.where(smokes == "yes", 0.07, 0.0)
    base += np.where(family == "yes", 0.09, 0.0)
    base += np.where(pollen == "yes", 0.05, 0.0)
    base += np.where(dust == "yes", 0.05, 0.0)
    base += np.where(pet == "yes", 0.03, 0.0)
    base += np.where(wheezing == "yes", 0.2, 0.0)
    base += np.where(sob == "yes", 0.2, 0.0)
    base += np.where(chest == "yes", 0.17, 0.0)
    base += np.where(cough == "yes", 0.1, 0.0)

    base += np.where(ages < 12, 0.09, 0.0)
    base += np.where(ages > 55, 0.03, 0.0)

    base = np.clip(base, 0.03, 0.96)
    probs = base

    labels = (rng.random(size=n_samples) < probs).astype(int)

    encoded = np.vstack([encode_row(row.to_dict()) for _, row in df.iterrows()])
    encoded_df = pd.DataFrame(encoded, columns=FEATURE_NAMES)
    encoded_df["asthma"] = labels

    return encoded_df


def train_and_save() -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    data = synthesize_dataset()
    X = data[FEATURE_NAMES].values
    y = data["asthma"].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    clf = RandomForestClassifier(
        n_estimators=220,
        max_depth=7,
        min_samples_leaf=5,
        random_state=42,
        class_weight="balanced",
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Trained RandomForest on synthetic dataset. Accuracy: {acc:.3f}")

    joblib.dump(clf, MODEL_PATH)
    joblib.dump(FEATURE_NAMES, FEATURES_PATH)
    print(f"Saved model to {MODEL_PATH}")
    print(f"Saved feature names to {FEATURES_PATH}")


if __name__ == "__main__":
    train_and_save()

