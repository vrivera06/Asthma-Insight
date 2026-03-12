# 🫁 Asthma Insight

An AI-driven web platform that analyzes user-submitted symptoms using machine learning to estimate the likelihood of asthma and deliver personalized medical advice. Built at the Georgetown Hackathon.

![React](https://img.shields.io/badge/React_Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![ML](https://img.shields.io/badge/Machine_Learning-FF6F00?style=flat&logo=scikit-learn&logoColor=white)

---

## 🧰 Technologies Used

- **Frontend:** React (Vite) · HTML · CSS
- **Backend / ML:** Python
- **ML Model:** Scikit-learn

---

## ✨ Features

- Simple symptom input form for users
- Machine learning model estimates asthma likelihood from submitted data
- Returns a probability score with a clear breakdown
- Personalized medical advice tailored to each result
- Clean, accessible UI designed for non-technical users

---

## ⚙️ Process

This project was built under hackathon pressure as a team, which meant fast decisions and clear communication. We focused on making the ML model as accurate as possible with the dataset we had, then wrapping it in an interface that felt approachable — not clinical or intimidating.

The biggest challenge was integrating the Python ML backend with the React frontend within a short timeframe while keeping the user experience simple and clear.

**What I learned:**
- How to build and integrate a machine learning model into a live web app
- Collaborating and shipping fast under real hackathon constraints
- Designing for non-technical users — clarity matters more than complexity

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/vrivera06/asthma-insight.git

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (in a new terminal)
cd backend
pip install -r requirements.txt
python app.py
```

---

## 🔮 How It Could Be Improved

- Expand the dataset to improve model accuracy
- Add a symptom history tracker for returning users
- Connect with real medical APIs for more precise recommendations
- Build a mobile app version
