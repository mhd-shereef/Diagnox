<div align="center">

# 🧬 Diagnox — AI-Powered Healthcare Platform

**Intelligent disease prediction · Clinical AI assistant · Real-time health analytics**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PyTorch](https://img.shields.io/badge/AI-PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Vite](https://img.shields.io/badge/Build-Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

> A next-generation healthcare intelligence platform that brings clinical AI predictions directly to patients, doctors, and diagnostic centres — through an elegant, fast, and privacy-first interface.

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Architecture](#-architecture)
- [Existing Features](#-existing-features)
- [Frontend Architecture v2](#-frontend-architecture-v2)
- [Planned Features](#-planned-features)
- [Tech Stack](#-tech-stack)
- [AI Models & Performance](#-ai-models--performance)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Installation & Running](#-installation--running)
- [Deployment](#-deployment)
- [Security & Compliance](#-security--compliance)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🔬 Overview

**Diagnox** is a full-stack healthcare AI platform consisting of three tightly integrated layers:

| Layer | Technology | Role |
|---|---|---|
| **ML Training** | PyTorch · scikit-learn | Train tabular binary classifiers on clinical datasets |
| **Backend API** | FastAPI · Python | Serve inference, feature importance, and health endpoints |
| **Frontend Web App** | React 19 · Vite · Tailwind CSS | Dynamic UI for diagnostics, health overview, BMI, and AI chat |

The platform dynamically introspects the FastAPI backend at runtime via its OpenAPI schema — no hardcoded endpoint lists. Any new clinical model registered in the backend automatically appears in the frontend Diagnostics interface.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Diagnox Platform                      │
│                                                          │
│  ┌─────────────────┐      ┌──────────────────────────┐  │
│  │   React Frontend │◄────►│     FastAPI Backend       │  │
│  │                 │      │                          │  │
│  │  • Home         │      │  POST /predict/cancer    │  │
│  │  • Diagnostics  │      │  POST /predict/blood     │  │
│  │  • Health Dash  │      │  POST /predict/cardio    │  │
│  │  • BMI Tracker  │      │  GET  /health            │  │
│  │  • AI Assistant │      │  GET  /openapi.json      │  │
│  │  • Admin Panel  │      │                          │  │
│  └─────────────────┘      └──────────┬───────────────┘  │
│                                       │                   │
│                           ┌───────────▼──────────────┐   │
│                           │     PredictorService      │   │
│                           │                          │   │
│                           │  ┌─────────────────────┐ │   │
│                           │  │ TabularBinaryClassif│ │   │
│                           │  │  Input → 32/64 →    │ │   │
│                           │  │  16/32 → 1 (Sigmoid)│ │   │
│                           │  └─────────────────────┘ │   │
│                           │  + sklearn Preprocessor   │   │
│                           │  + Permutation Importance │   │
│                           └──────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              ML Artifact Store (ml/venv/)            │ │
│  │  cancer_model.pt · diabetes_model.pt · framingham…  │ │
│  │  *_preprocessor.pkl · *_metrics.json                │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Key Design Decision**: Training and serving are fully separated. Models are compiled during the ML training phase and stored as `.pt` + `.pkl` artifacts. The backend loads all models once at startup (not per-request), ensuring sub-millisecond inference latency.

---

## ✅ Existing Features

### 🤖 AI Disease Prediction Engine
- **Breast Cancer Classification** — 30-feature cytology analysis (Malignant / Benign)
- **Diabetes Risk Prediction** — 8-feature PIMA Indian Diabetes risk screening (High / Low Risk)
- **Cardiovascular Risk Prediction** — 15-feature Framingham Heart Study 10-year CHD risk

All models return:
- Predicted label with configurable decision threshold
- Probability score (0–1 sigmoid output)
- Top-3 contributing features (global permutation importance × local feature magnitude)

### 🔍 Dynamic Backend Discovery
The frontend scans the FastAPI OpenAPI schema at runtime (`/openapi.json`) and automatically maps all `POST` prediction routes — no hardcoded endpoint list required. New models registered in the backend appear in the UI without any frontend changes.

### 📊 Health Overview Dashboard
Real-time health metric cards displaying:
- Heart Rate monitoring
- Blood Pressure readings
- Glucose Level tracking
- Body Temperature status
- Weekly activity trends panel
- AI Insights panel

### ⚖️ BMI Tracker
Interactive BMI calculator with instant categorization (Underweight / Normal / Overweight / Obese) and visual health feedback.

### 🤖 AI Chat Assistant
Conversational health assistant (`Diagnox AI`) powered by a configurable LLM endpoint (Ollama-compatible API). Supports:
- Health Q&A in a **fully markdown-rendered** chat interface
- System-prompted clinical context with structured output instructions
- Streaming-compatible message flow
- **Formatted replies**: bold terms, bullet lists, numbered steps, code values, blockquotes, headers, tables
- **Timestamps** on every message and a **one-click copy** button for AI responses
- Animated typing indicator with pulsing dots and status label

### 🔐 Authentication System
- Role-based access control (Patient / Admin roles)
- JWT-style session management via `localStorage`
- Protected route guards — unauthenticated users are redirected to login
- Admin-only dashboard with system log viewer

### 🛠️ Admin Control Center
- Active users counter
- API request metrics
- Server uptime monitoring
- System alert tracker
- Real-time system log table (service, status, message)

### 🎨 Modern UI/UX
- Glassmorphism design system with dark-mode aesthetic
- Framer Motion animations and hover micro-interactions
- Three.js / React Three Fiber 3D particle canvas on landing
- Lucide React icon library
- Responsive layout with sidebar + navbar navigation

---

## 🎨 Frontend Architecture v2

> The frontend was completely redesigned in v2 as a **premium medical SaaS interface** while preserving 100% backend compatibility. All existing API integrations, routing, and auth logic remain intact.

### Design System

| Token | Value | Purpose |
|---|---|---|
| `--bg-base` | `#080d1a` | Page background |
| `--bg-card` | `rgba(255,255,255,0.04)` | Glassmorphism card surface |
| `--accent-blue` | `#2563eb` | Primary CTA & active states |
| `--accent-cyan` | `#06b6d4` | Gradient partner & secondary accents |
| `--text-primary` | `#f1f5f9` | Main readable text |
| `--text-secondary` | `#94a3b8` | Supporting copy |
| `--grad-primary` | `135deg, #2563eb → #06b6d4` | Buttons, badges, rings |

### Page-by-Page Upgrades

| Page | What Changed |
|---|---|
| **Landing** | Full-viewport hero, animated stat counters, floating model cards, feature grid, steps, CTA |
| **Login** | Glassmorphism card, demo quick-fill buttons, show/hide password, shake-on-error animation |
| **Diagnostics** | Color-coded model sidebar, SVG probability gauge ring, feature driver pills |
| **Health Overview** | SVG health-score ring (0–100), metric cards with trend pills, AI insights, animated bar chart |
| **BMI Tracker** | Gradient scale bar with tooltip thumb, category badge, health tip, reference table |
| **AI Assistant** | Full-height ChatGPT-style layout, **markdown-rendered replies** (headings, lists, code, tables, blockquotes), message timestamps, copy button, animated typing indicator |
| **Admin** | Animated stat cards, color-coded log table with zebra hover |

### Component Architecture

```
src/
├── components/
│   └── Navbar.jsx          ← Scroll-aware, pill active state, gradient logo
├── pages/                  ← Each page is self-contained (JSX + CSS module)
├── services/               ← Unchanged: backendScanner + apiMapper
├── context/                ← Unchanged: AuthContext
└── utils/                  ← Unchanged logic; DynamicFormGenerator.css updated
```

### Animation Strategy (Framer Motion)

- **Page entrance**: `fadeInUp` with `staggerChildren` per grid
- **Hover**: `whileHover={{ y: -3 }}` on cards, `whileHover={{ x: 2 }}` on list items
- **SVG rings**: CSS `stroke-dashoffset` transition on mount
- **Bar charts**: `height` spring animation with delay stagger
- **Modals & error banners**: `AnimatePresence` with `opacity + y` transitions

### Screenshots

| Page | Preview |
|---|---|
| Landing | _Add screenshot here_ |
| Diagnostics | _Add screenshot here_ |
| Dashboard | _Add screenshot here_ |
| AI Chat | _Add screenshot here_ |

---

## 🚧 Planned Features

The following features are part of the Diagnox product vision and are **not yet implemented** in the current codebase:

| Feature | Category | Priority |
|---|---|---|
| 🚧 Face recognition login | Auth & Security | High |
| 🚧 Fingerprint / biometric authentication | Auth & Security | High |
| 🚧 Hypertension & Kidney disease prediction | AI Models | High |
| 🚧 OCR/NLP extraction from uploaded medical reports | Health Records | High |
| 🚧 Medical history timeline & document upload | Health Records | Medium |
| 🚧 Wearable device integration (Apple Health, Fitbit) | Health Monitoring | Medium |
| 🚧 Personalized diet & exercise recommendations | Wellness | Medium |
| 🚧 Medication reminders & sleep tracking | Wellness | Medium |
| ✅ Markdown-formatted AI replies | AI Chat | Done |
| 🚧 Multilingual AI assistant support | AI Chat | Medium |
| 🚧 Doctor / clinic reviews & sentiment analysis | Patient Engagement | Medium |
| 🚧 X-ray / MRI / CT scan AI analysis (Radiology AI) | AI Diagnostics | High |
| 🚧 Blockchain-based health record protection | Security | Low |
| 🚧 Digital Twin patient simulation | Innovation | Future |
| 🚧 AR exercise coach | Innovation | Future |
| 🚧 DNA/genetic risk integration | Innovation | Future |
| 🚧 AI second-opinion system | Innovation | Future |
| 🚧 Insurance claim AI assistant | Innovation | Future |

---

## 🧰 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Core language |
| FastAPI | Latest | REST API framework |
| Uvicorn | Latest | ASGI server |
| PyTorch | Latest | Neural network inference |
| scikit-learn | Latest | Preprocessing (StandardScaler, ColumnTransformer, SimpleImputer) |
| Pandas | Latest | Feature dataframe construction |
| NumPy | Latest | Tensor/array operations |
| Joblib | Latest | Preprocessor serialization (.pkl) |
| Pydantic | v2 | Request/response schema validation |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | Component framework |
| Vite | 7.x | Build tooling & dev server |
| React Router DOM | 7.x | Client-side routing |
| Framer Motion | 12.x | Animations & transitions |
| Three.js + R3F | 0.184 / 9.x | 3D particle effects |
| Axios | 1.x | HTTP client for API calls |
| Lucide React | 1.x | Icon library |
| **react-markdown** | **latest** | **Markdown rendering in AI chat replies** |
| **remark-gfm** | **latest** | **GFM: tables, task lists, strikethrough in chat** |
| Tailwind CSS | 4.x | Utility CSS (dev dependency) |

### ML Training Pipeline
| Technology | Purpose |
|---|---|
| PyTorch (BCEWithLogitsLoss) | Binary classification training |
| scikit-learn (LogisticRegression) | Baseline comparison |
| Permutation Importance | Global explainability |
| StandardScaler + ColumnTransformer | Feature preprocessing |
| DataLoader (mini-batch) | Training loop |

---

## 📈 AI Models & Performance

All three models follow the same `TabularBinaryClassifier` architecture:

```
Input(n_features)
    ↓
Linear(n, hidden1) → ReLU → Dropout
    ↓
Linear(hidden1, hidden2) → ReLU → Dropout
    ↓
Linear(hidden2, 1) → BCEWithLogitsLoss (training) / Sigmoid (inference)
```

Class imbalance is handled via PyTorch `pos_weight` scaling. Decision thresholds are tuned per model for recall-sensitive clinical operation.

### Model Benchmark Results

| Model | ROC-AUC | Precision | Recall | F1 | Status |
|---|---|---|---|---|---|
| **Cancer (Neural Net)** | 0.9940 | 1.0000 | 0.9286 | 0.9630 | ✅ Accepted |
| Cancer (Logistic Baseline) | 0.9954 | 0.9756 | 0.9524 | 0.9639 | Baseline |
| **Diabetes (Neural Net)** | 0.8109 | 0.5263 | 0.9259 | 0.6711 | ✅ Accepted |
| Diabetes (Logistic Baseline) | 0.8248 | 0.5253 | 0.9630 | 0.6797 | Baseline |
| **Cardio/Framingham (Neural Net)** | 0.6794 | 0.1902 | 0.8760 | 0.3126 | ⚠️ Needs Improvement |
| Cardio (Logistic Baseline) | 0.7008 | 0.1687 | 0.9535 | 0.2867 | Baseline |

> **Note on Cardio Model**: The Framingham dataset is highly imbalanced. The model is tuned for **high recall** (0.876) over precision, prioritising patient safety by minimising false negatives. AUC improvement is planned in the next iteration.

### Explainability

Every prediction response includes `top_features` — the three clinical variables that most influenced the result. This is computed by combining:

1. **Global permutation importance** (stored in `*_metrics.json` from training)
2. **Local feature magnitude** (per-request transformed value scale)

Example output for a diabetes prediction:
```json
{
  "prediction": "High Risk",
  "probability": 0.87,
  "top_features": ["Glucose", "BMI", "Age"]
}
```

---

## 📡 API Reference

Base URL: `http://localhost:8000`

### Health Check

```http
GET /health
```
```json
{ "status": "ok" }
```

---

### Predict Cancer Risk

```http
POST /predict/cancer
Content-Type: application/json
```

**Request Body** (30 cytology features from Breast Cancer Wisconsin dataset):

```json
{
  "radius_mean": 17.99,
  "texture_mean": 10.38,
  "perimeter_mean": 122.8,
  "area_mean": 1001.0,
  "smoothness_mean": 0.1184,
  "compactness_mean": 0.2776,
  "concavity_mean": 0.3001,
  "concave points_mean": 0.1471,
  "symmetry_mean": 0.2419,
  "fractal_dimension_mean": 0.07871
  // ... + 20 more _se and _worst features
}
```

---

### Predict Diabetes Risk

```http
POST /predict/blood
Content-Type: application/json
```

**Request Body** (PIMA Indian Diabetes dataset features):

```json
{
  "Pregnancies": 6,
  "Glucose": 148.0,
  "BloodPressure": 72.0,
  "SkinThickness": 35.0,
  "Insulin": 0.0,
  "BMI": 33.6,
  "DiabetesPedigreeFunction": 0.627,
  "Age": 50.0
}
```

---

### Predict Cardiovascular Risk

```http
POST /predict/cardio
Content-Type: application/json
```

**Request Body** (Framingham Heart Study features):

```json
{
  "male": 1,
  "age": 55.0,
  "education": 2.0,
  "currentSmoker": 0,
  "cigsPerDay": 0.0,
  "BPMeds": 0.0,
  "prevalentStroke": 0,
  "prevalentHyp": 1,
  "diabetes": 0,
  "totChol": 225.0,
  "sysBP": 140.0,
  "diaBP": 90.0,
  "BMI": 26.97,
  "heartRate": 80.0,
  "glucose": 77.0
}
```

---

### Standard Response Format

All prediction endpoints return the same structure:

```json
{
  "prediction": "High Risk",
  "probability": 0.73,
  "top_features": ["glucose", "BMI", "age"]
}
```

| Field | Type | Description |
|---|---|---|
| `prediction` | `string` | Human-readable label (e.g., `"High Risk"`, `"Malignant"`, `"Low Risk"`) |
| `probability` | `float` | Sigmoid probability score between 0.0 and 1.0 |
| `top_features` | `string[]` | Top-3 features driving the prediction |

The full OpenAPI schema is auto-generated and available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **JSON Schema**: `http://localhost:8000/openapi.json`

---

## 📁 Project Structure

```
Diagnox/
│
├── backend/                         # FastAPI inference server
│   ├── main.py                      # App entry point, CORS, router registration
│   ├── schemas.py                   # Pydantic request/response models
│   ├── model_definition.py          # TabularBinaryClassifier (PyTorch nn.Module)
│   ├── inference.py                 # Standalone inference helper (training pipeline use)
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Backend environment variables (not committed)
│   │
│   ├── routes/
│   │   ├── cancer.py                # POST /predict/cancer endpoint
│   │   ├── diabetes.py              # POST /predict/blood endpoint
│   │   └── cardio.py                # POST /predict/cardio endpoint
│   │
│   ├── utils/
│   │   └── predictor_service.py     # Model loading, inference, feature importance
│   │
│   ├── models/                      # Copied .pt model files for serving
│   │   ├── cancer_model.pt
│   │   ├── diabetes_model.pt
│   │   └── framingham_model.pt
│   │
│   └── preprocessors/               # Copied .pkl preprocessors for serving
│
├── frontend/                        # React 19 + Vite web application
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                         # Frontend environment variables (not committed)
│   │
│   └── src/
│       ├── App.jsx                  # Root router + protected route logic
│       ├── main.jsx                 # React entry point
│       ├── index.css                # Global design system & CSS variables
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state, login/logout, role management
│       │
│       ├── components/
│       │   ├── Navbar.jsx           # Top navigation bar with auth state
│       │   ├── Sidebar.jsx          # Sidebar navigation (protected area)
│       │   ├── Particles.jsx        # Three.js 3D particle canvas
│       │   └── Header.jsx           # Page header component
│       │
│       ├── pages/
│       │   ├── Home.jsx             # Landing page with feature highlights
│       │   ├── Login.jsx            # Login form with mock auth
│       │   ├── Diagnostics.jsx      # Dynamic AI prediction interface
│       │   ├── HealthOverview.jsx   # Health metrics dashboard
│       │   ├── BMITracker.jsx       # BMI calculator
│       │   ├── AIAssistant.jsx      # LLM-powered health chat
│       │   ├── Profile.jsx          # User profile
│       │   ├── AdminDashboard.jsx   # Admin-only system panel
│       │   ├── HealthRecords.jsx    # (Stub) Health records page
│       │   └── Predictions.jsx      # (Stub) Predictions history page
│       │
│       ├── services/
│       │   ├── backendScanner.js    # Discovers FastAPI endpoints via /openapi.json
│       │   └── apiMapper.js         # Maps OpenAPI paths to route config objects
│       │
│       └── utils/
│           ├── schemaParser.js      # Parses OpenAPI schemas to form field definitions
│           └── dynamicFormGenerator.jsx  # Renders input forms from parsed schemas
│
└── ml/                              # ML training environment
    └── venv/
        ├── training/                # Training scripts (train_cancer.py, etc.)
        ├── models/
        │   └── artifacts/           # Trained model artifacts
        │       ├── *_model.pt       # PyTorch checkpoints
        │       ├── *_preprocessor.pkl
        │       ├── *_metrics.json   # Evaluation results + feature importance
        │       └── evaluation/      # Confusion matrices, ROC curves
        └── utils/                   # Preprocessing utilities
```

---

## 🔧 Environment Setup

### Backend — `backend/.env`

```env
# Required for AI assistant LLM proxy (Ollama-compatible endpoint)
AI_API_KEY=your_api_key_here
```

### Frontend — `frontend/.env`

```env
# LLM API key for AI chat assistant
VITE_AI_API_KEY=your_api_key_here

# Optional: Override the default Ollama endpoint
# VITE_OLLAMA_URL=http://localhost:11434/api/chat
```

> **Security Notice**: Never commit `.env` files containing real credentials. Both `.env` files are included in `.gitignore`.

---

## 🚀 Installation & Running

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm 9 or higher

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/diagnox.git
cd diagnox
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be live at: **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start the development server
npm run dev
```

The web app will be live at: **http://localhost:5173**

---

### 4. ML Training (Optional)

The trained model artifacts are already included in `ml/venv/models/artifacts/`. To retrain from scratch:

```bash
cd ml/venv

# Install ML dependencies
pip install torch scikit-learn pandas numpy joblib

# Run training scripts
python training/train_cancer.py
python training/train_diabetes.py
python training/train_framingham.py
```

Artifacts are automatically copied to `backend/models/` and `backend/preprocessors/` on next server startup.

---

## ☁️ Deployment

### Render (Recommended for Backend)

1. Connect your GitHub repository to [Render](https://render.com)
2. Create a new **Web Service** pointing to the `backend/` directory
3. Set the build command:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the start command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 10000
   ```
5. Add environment variables in the Render dashboard

### Vercel / Netlify (Frontend)

```bash
cd frontend
npm run build
# Deploy the generated dist/ folder
```

Set the following environment variable in your hosting dashboard:
```
VITE_AI_API_KEY=your_production_api_key
```

### Docker (Full Stack)

```dockerfile
# Backend Dockerfile (backend/Dockerfile)
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔒 Security & Compliance

### Current Security Measures

| Measure | Status | Implementation |
|---|---|---|
| CORS policy | ✅ Active | Configured in `main.py` via FastAPI middleware |
| Protected routes | ✅ Active | `ProtectedRoute` guard in `App.jsx`, localStorage session |
| Role-based access | ✅ Active | Patient / Admin roles enforced on the Admin Dashboard |
| Environment variable isolation | ✅ Active | `.env` files excluded from version control |
| Input validation | ✅ Active | Pydantic v2 schema validation on all POST endpoints |
| Local inference | ✅ Active | Patient data never leaves the local inference server |

### Planned Compliance Features

| Standard | Status | Details |
|---|---|---|
| 🚧 HIPAA Compliance | Planned | Data encryption at rest and in transit, audit logs, access controls |
| 🚧 GDPR | Planned | Explicit consent flows, right-to-erasure, data minimisation |
| 🚧 Data Anonymisation | Planned | PII removal pipeline before any model training |
| 🚧 Explainable AI (XAI) | Partial | `top_features` per prediction (**live**); full SHAP integration planned |
| 🚧 Doctor-in-the-Loop | Planned | Human oversight gate before critical diagnosis delivery |
| 🚧 Blockchain Records | Planned | Hyperledger Fabric for tamper-proof medical record storage |

> **Important**: Diagnox is a clinical decision **support** tool, not a replacement for qualified medical professionals. All AI predictions should be reviewed by a licensed clinician before acting upon them.

---

## 🗺️ Roadmap

### Phase 1 — MVP (Current)
- [x] Three tabular disease prediction models (Cancer, Diabetes, Cardio)
- [x] FastAPI backend with Pydantic validation
- [x] React frontend with dynamic OpenAPI schema discovery
- [x] Health overview dashboard, BMI tracker, AI chat assistant
- [x] Role-based authentication and admin panel
- [x] Feature importance explainability in prediction responses

### Phase 2 — Advanced AI (Q3 2026)
- [ ] Hypertension and kidney disease prediction models
- [ ] X-ray / radiology image classification (CNN models)
- [ ] Full SHAP explainability integration
- [ ] OCR/NLP for medical document parsing
- [ ] Cardio model improvement (AUC target: >0.75)

### Phase 3 — Patient Platform (Q4 2026)
- [ ] Wearable device integration (Apple Health, Fitbit, Garmin)
- [ ] Personalized diet & exercise recommendations
- [ ] Medication reminder system
- [ ] Medical history timeline and record uploads
- [ ] Multilingual AI assistant

### Phase 4 — Compliance & Scale (Q1 2027)
- [ ] HIPAA / GDPR compliance audit and implementation
- [ ] Blockchain health record protection (Hyperledger)
- [ ] Biometric authentication (Face ID, Fingerprint)
- [ ] Multi-tenant deployment for diagnostic centres
- [ ] REST → GraphQL API migration for complex queries

### Phase 5 — Innovation (2027+)
- [ ] Digital Twin patient simulation
- [ ] AR exercise coaching
- [ ] DNA/genetic risk integration
- [ ] AI second-opinion system
- [ ] Insurance claim processing assistant

---

## 🤝 Contributing

We welcome contributions from developers, healthcare professionals, and AI researchers.

### Getting Started

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Contribution Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- All new ML models must include:
  - Baseline comparison (LogisticRegression)
  - AUC, Precision, Recall, F1 metrics
  - Feature importance output
  - Pydantic schema in `backend/schemas.py`
- All frontend components must use the existing design system CSS variables
- Never commit `.env` files, model binaries, or dataset CSVs
- Add tests where applicable

### Issue Labels

| Label | Description |
|---|---|
| `ai-model` | New or improved prediction models |
| `frontend` | React UI/UX improvements |
| `backend` | FastAPI / inference improvements |
| `compliance` | HIPAA, GDPR, security |
| `good first issue` | Suitable for new contributors |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for full details.

---

## 🙏 Acknowledgements

- [Framingham Heart Study](https://www.framinghamheartstudy.org/) — Cardiovascular dataset
- [UCI Breast Cancer Wisconsin Dataset](https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic) — Cancer dataset
- [PIMA Indian Diabetes Dataset](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database) — Diabetes dataset
- [FastAPI](https://fastapi.tiangolo.com/) — For elegant async API design
- [PyTorch](https://pytorch.org/) — For neural network training and inference
- [Framer Motion](https://www.framer.com/motion/) — For beautiful React animations

---

<div align="center">

**Built with ❤️ for a healthier world**

*Diagnox — Intelligent Healthcare, Powered by AI*

</div>
