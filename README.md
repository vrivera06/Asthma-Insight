# 🫁 Asthma Insight

An AI-powered asthma risk explorer with a modern React UI and a FastAPI backend. Users complete a short, guided symptom questionnaire and receive an estimated asthma risk score plus tailored advice.  

> **Important**: This app is for informational purposes only and is **not** a substitute for professional medical advice, diagnosis, or treatment.

---

## Overview

- **Frontend**: Modern, dark UI built with Vite + React 18.
- **Routing**: React Router for:
  - `Home` (hero + disclaimer)
  - `Symptom Checker` (3-step wizard)
  - `Results` (gauge + factors + advice)
- **Backend**: FastAPI service exposing:
  - `GET /health` – health check
  - `POST /api/predict` – returns a risk score \(0–1\), risk level, diagnosis string, top factors and advice.
- **Model**: A `RandomForestClassifier` trained on a synthetic asthma-like dataset generated in `backend/model/train.py`. On first run the backend auto-trains and saves the model.

---

## Project structure

```text
New folder (3)/
├── frontend/              # Vite + React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── vite.config.js
│   └── .env               # VITE_API_URL
└── backend/               # FastAPI + model
    ├── main.py
    ├── schemas.py
    ├── requirements.txt
    ├── routes/
    │   └── predict.py
    └── model/
        ├── train.py
        ├── asthma_model.pkl        # generated
        └── feature_names.pkl       # generated
```

---

## Running the app locally

### 1. Backend (FastAPI)

From the project root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # On Windows PowerShell / CMD
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend will be available at:

- **API root**: `http://localhost:8000`
- **Health check**: `http://localhost:8000/health`
- **Interactive docs** (Swagger): `http://localhost:8000/docs`

On first run, the API will automatically:

1. Generate a synthetic asthma-like dataset.
2. Train a `RandomForestClassifier`.
3. Save the model and feature names under `backend/model/`.

You can also retrain manually:

```bash
cd backend
venv\Scripts\activate
python -m model.train
```

---

### 2. Frontend (Vite + React)

In another terminal, from the project root:

```bash
cd frontend
npm install          # if not already done
npm run dev
```

The frontend will be available at:

- **Web app**: `http://localhost:5173`

The Vite dev server is configured with a proxy so that any `/api/*` calls are forwarded to `http://localhost:8000`:

```js
// frontend/vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:8000',
  },
}
```

The `.env` file in `frontend/` also sets:

```bash
VITE_API_URL=http://localhost:8000
```

---

## Frontend UX

- **Home page**
  - Dark, mesh-style hero section.
  - Animated “breathing” orb visual.
  - Primary CTA button: “Start symptom check”.
  - Fixed disclaimer bar at the bottom of the screen.

- **Symptom Checker**
  - 3-step wizard with progress bar:
    1. *About you*: age, gender, smoking, physical activity.
    2. *Your environment*: pollen, dust, pet allergy, family history.
    3. *Your symptoms*: wheezing, shortness of breath, chest tightness, coughing.
  - Yes/No and activity fields use pill-style toggle buttons.
  - Submits to `POST /api/predict` and navigates to the Results page on success.

- **Results page**
  - Circular risk gauge showing risk percent.
  - Risk level label (Low / Moderate / High) color-coded.
  - Diagnosis text and personalized advice list.
  - Chips showing top contributing factors.
  - Prominent disclaimer card and “Start over” button.

---

## API details

- **POST `/api/predict`**
  - **Request body**: `SymptomInput`
  - **Response body**: `PredictionResult`
  - Uses the trained RandomForest model’s `predict_proba` to compute `riskScore`.
  - Risk level thresholds:
    - `< 0.40` → `Low`
    - `0.40 – 0.70` → `Moderate`
    - `> 0.70` → `High`

---

## Disclaimer

Asthma Insight is a learning and exploration tool only. It does **not** provide a medical diagnosis and must not be used as a substitute for advice from a licensed healthcare professional. If you suspect you have asthma or any serious condition, or you are experiencing a medical emergency, call 911 or your local emergency number immediately.

