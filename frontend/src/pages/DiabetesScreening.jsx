import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  Droplets, Loader2, RotateCcw, ShieldAlert,
  FlaskConical, ClipboardList, Wand2, Info
} from 'lucide-react';
import './ScreeningUI.css';

/* ─── DISCLAIMER ───────────────────────────────────────────── */
const DISCLAIMER = [
  {
    icon: ShieldAlert,
    title: 'Screening tool — not a diagnosis',
    body: 'This tool provides a preliminary risk estimate only. It cannot diagnose diabetes or any medical condition. Always consult a qualified physician.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk of false results',
    body: 'AI models carry inherent false positive and false negative rates. A low-risk result does not guarantee the absence of diabetes.',
  },
  {
    icon: Info,
    title: 'Dataset limitations',
    body: 'The Clinical Analysis model is trained on the PIMA Indian Diabetes dataset. Results may vary across different demographic groups.',
  },
];

/* ─── MODE 1: SYMPTOM QUESTIONS ──────────────────────────────── */
const QUESTIONS = [
  {
    id: 'age', label: 'What is your current age range?',
    hint: 'Diabetes risk generally increases with age.',
    type: 'choice',
    options: [
      { label: 'Under 30',  value: 'u30',  score: 0 },
      { label: '30 – 44',   value: '30_44', score: 5 },
      { label: '45 – 59',   value: '45_59', score: 15 },
      { label: '60 or older', value: '60p', score: 25 },
    ],
  },
  {
    id: 'thirst_urination', label: 'Do you experience excessive thirst or frequent urination?',
    hint: 'Particularly noticeable at night.',
    type: 'boolean',
  },
  {
    id: 'fatigue', label: 'Are you experiencing unexplained fatigue?',
    hint: 'Feeling more tired than usual without a clear reason.',
    type: 'boolean',
  },
  {
    id: 'vision', label: 'Have you noticed blurred vision recently?',
    hint: 'Difficulty focusing or blurry eyesight.',
    type: 'boolean',
  },
  {
    id: 'tingling', label: 'Do you feel tingling or numbness in your hands or feet?',
    hint: 'Often described as a "pins and needles" sensation.',
    type: 'boolean',
  }
];

const BOOLEAN_OPTS = [
  { label: 'Yes', value: 'yes', score: 1 },
  { label: 'No',  value: 'no',  score: 0 },
];

const BOOLEAN_WEIGHTS = {
  thirst_urination: 25,
  fatigue:          10,
  vision:           15,
  tingling:         20,
};

function calcScore(answers) {
  let total = 0;
  QUESTIONS.forEach(q => {
    const val = answers[q.id];
    if (!val) return;
    if (q.type === 'choice') {
      const opt = q.options.find(o => o.value === val);
      if (opt) total += opt.score;
    } else {
      if (val === 'yes') total += BOOLEAN_WEIGHTS[q.id] || 0;
    }
  });
  return total;
}

function getRisk(score) {
  if (score < 25) return { tier: 'Low',      color: 'var(--accent-emerald)', bg: 'var(--status-safe-bg)', label: 'Low Risk',      action: 'Maintain regular health check-ups and healthy lifestyle habits.' };
  if (score < 50) return { tier: 'Moderate', color: 'var(--accent-amber)', bg: 'var(--status-warn-bg)', label: 'Moderate Risk', action: 'Consider scheduling a wellness visit with your physician for personalized guidance and a blood glucose test.' };
  return          { tier: 'Elevated',  color: 'var(--accent-rose)', bg: 'var(--status-danger-bg)',  label: 'Elevated Risk', action: 'We strongly recommend booking an appointment with a healthcare professional soon for a comprehensive evaluation.' };
}

/* ─── MODE 2: CLINICAL FIELDS ─────────── */
const CLINICAL_STEPS = [
  {
    title: 'Patient Profile',
    desc: 'Basic demographic and physical information.',
    fields: [
      { key: 'Gender', label: 'Biological Sex', type: 'radio', options: [{label: 'Female', value: 'female'}, {label: 'Male', value: 'male'}] },
      { key: 'Age', label: 'Age', unit: 'years' },
      { key: 'Pregnancies', label: 'Number of Pregnancies', unit: 'count', showIf: (values) => values.Gender === 'female' },
      { key: 'BMI', label: 'Body Mass Index (BMI)', unit: 'kg/m²' },
      { key: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function', unit: 'score' },
    ],
  },
  {
    title: 'Metabolic & Vitals',
    desc: 'Clinical measurements related to metabolic health.',
    fields: [
      { key: 'Glucose', label: 'Plasma Glucose Concentration', unit: 'mg/dL' },
      { key: 'BloodPressure', label: 'Diastolic Blood Pressure', unit: 'mm Hg' },
      { key: 'SkinThickness', label: 'Triceps Skin Fold Thickness', unit: 'mm' },
      { key: 'Insulin', label: '2-Hour Serum Insulin', unit: 'mu U/ml' },
    ],
  },
];

/* ─── SUBCOMPONENT: DisclaimerPanel ─────────────────────────── */
function DisclaimerPanel() {
  return (
    <div className="cs-disclaimer">
      <div className="cs-disclaimer-inner">
        {DISCLAIMER.map((d, i) => (
          <div className="cs-disclaimer-item" key={i}>
            <d.icon size={16} className="cs-disclaimer-icon" />
            <div>
              <span className="cs-disclaimer-title">{d.title}: </span>
              <span className="cs-disclaimer-body">{d.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SUBCOMPONENT: SymptomCheck (Mode 1) ─────────────────────── */
function SymptomCheck() {
  const [step, setStep]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]     = useState(false);

  const q = QUESTIONS[step];
  const opts = q.type === 'boolean' ? BOOLEAN_OPTS : q.options;
  const isLast = step === QUESTIONS.length - 1;

  const select = (val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (isLast) {
      setTimeout(() => setDone(true), 300);
    } else {
      setTimeout(() => setStep(s => s + 1), 280);
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(false); };

  if (done) {
    const score = calcScore(answers);
    const risk  = getRisk(score);
    return (
      <motion.div
        className="cs-result glass-panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="cs-result-header">
          <span className="cs-result-eyebrow">Symptom Check Result</span>
          <div className="cs-result-tier" style={{ color: risk.color, background: risk.bg }}>
            {risk.label}
          </div>
        </div>

        <p className="cs-result-action">{risk.action}</p>

        <div className="cs-result-factors">
          <p className="cs-result-factors-title">Factors considered</p>
          <div className="cs-result-factors-grid">
            {QUESTIONS.map(q => {
              const val = answers[q.id];
              if (!val) return null;
              const label = q.type === 'choice'
                ? q.options.find(o => o.value === val)?.label
                : (val === 'yes' ? 'Yes' : 'No');
              return (
                <div className="cs-factor-row" key={q.id}>
                  <span className="cs-factor-q">{q.label}</span>
                  <span className="cs-factor-a">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <DisclaimerPanel />

        <button className="btn-secondary cs-reset" onClick={reset}>
          <RotateCcw size={14} /> Start over
        </button>
      </motion.div>
    );
  }

  return (
    <div className="cs-symptom-wrap">
      {/* Progress */}
      <div className="cs-progress">
        <div className="cs-progress-bar">
          <div
            className="cs-progress-fill"
            style={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="cs-progress-label">{step + 1} / {QUESTIONS.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="cs-question-card glass-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <p className="cs-question-label">{q.label}</p>
          {q.hint && <p className="cs-question-hint">{q.hint}</p>}

          <div className={`cs-options ${q.type === 'boolean' ? 'cs-options--two' : 'cs-options--multi'}`}>
            {opts.map(opt => (
              <button
                key={opt.value}
                className={`btn-secondary cs-option ${answers[q.id] === opt.value ? 'cs-option--selected' : ''}`}
                onClick={() => select(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back nav */}
      {step > 0 && (
        <button className="btn-ghost cs-back" onClick={() => setStep(s => s - 1)}>
          <ChevronLeft size={16} /> Back
        </button>
      )}
    </div>
  );
}

/* ─── SUBCOMPONENT: ClinicalAnalysis (Mode 2) ───────────────── */
function ClinicalAnalysis({ onResult }) {
  const [step, setStep]     = useState(0);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const currentStep = CLINICAL_STEPS[step];
  const isFirst = step === 0;
  const isLast  = step === CLINICAL_STEPS.length - 1;

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }));

  const allFilled = () =>
    currentStep.fields.every(f => {
      if (f.showIf && !f.showIf(values)) return true;
      return values[f.key] !== undefined && values[f.key] !== '';
    });

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {};
      CLINICAL_STEPS.forEach(s => s.fields.forEach(f => {
        if (f.key !== 'Gender') {
          payload[f.key] = Number(values[f.key]) || 0;
        }
      }));
      // Force pregnancies to 0 if male
      if (values.Gender === 'male') {
        payload.Pregnancies = 0;
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';
      const res = await axios.post(`${API_URL}/predict/diabetes`, payload);
      onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const autoFillElevated = () => {
    const mockData = {
      Gender: 'female', Pregnancies: 5, Glucose: 166, BloodPressure: 72, SkinThickness: 19,
      Insulin: 175, BMI: 25.8, DiabetesPedigreeFunction: 0.587, Age: 51
    };
    setValues(mockData);
  };

  const autoFillNormal = () => {
    const mockData = {
      Gender: 'female', Pregnancies: 1, Glucose: 85, BloodPressure: 66, SkinThickness: 29,
      Insulin: 0, BMI: 26.6, DiabetesPedigreeFunction: 0.351, Age: 31
    };
    setValues(mockData);
  };

  return (
    <div className="cs-clinical-wrap">
      <div className="cs-autofill-bar glass-panel">
        <span className="cs-autofill-label"><Wand2 size={16}/> Smart Fill Demo:</span>
        <div className="cs-autofill-actions">
          <button className="btn-secondary" onClick={autoFillNormal}>Normal Sample</button>
          <button className="btn-secondary" onClick={autoFillElevated}>Elevated Sample</button>
        </div>
      </div>

      <div className="cs-steps-indicator">
        {CLINICAL_STEPS.map((s, i) => (
          <div
            key={i}
            className={`cs-step-dot ${i === step ? 'cs-step-dot--active' : i < step ? 'cs-step-dot--done' : ''}`}
          >
            <div className="cs-step-pip">
              {i < step ? <CheckCircle2 size={12} /> : i + 1}
            </div>
            <span className="cs-step-name">{s.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="cs-step-layout"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <div className="glass-panel cs-step-main">
            <div className="cs-source-badge">
              <FlaskConical size={14} />
              Metabolic & Vitals Report
            </div>
            <p className="cs-step-desc">{currentStep.desc}</p>
            <div className="cs-field-grid">
              {currentStep.fields.map(f => {
                if (f.showIf && !f.showIf(values)) return null;
                return (
                  <div className="cs-field" key={f.key}>
                    <label className="cs-field-label">
                      {f.label}
                      {f.unit && <span className="cs-field-unit">{f.unit}</span>}
                    </label>
                    {f.type === 'radio' ? (
                      <div className="cs-radio-group">
                        {f.options.map(o => (
                          <button
                            key={o.value}
                            type="button"
                            className={`cs-radio-option ${values[f.key] === o.value ? 'cs-radio-option--selected' : ''}`}
                            onClick={() => set(f.key, o.value)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    ) : f.type === 'select' ? (
                      <select
                        className="form-input cs-field-input"
                        value={values[f.key] ?? ''}
                        onChange={e => set(f.key, e.target.value)}
                      >
                        <option value="" disabled>Select {f.label}</option>
                        {f.options.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        className="form-input cs-field-input"
                        placeholder="0"
                        value={values[f.key] ?? ''}
                        onChange={e => set(f.key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="cs-error glass-panel">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      <div className="cs-clinical-nav">
        {!isFirst ? (
          <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>
            <ChevronLeft size={16} /> Previous
          </button>
        ) : <div></div>}
        
        {!isLast ? (
          <button
            className="btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!allFilled()}
          >
            Next Step <ChevronRight size={16} />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={submit}
            disabled={!allFilled() || loading}
          >
            {loading
              ? <><Loader2 size={16} className="cs-spin" /> Analysing…</>
              : <><Droplets size={16} /> Run Clinical Analysis</>
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function DiabetesScreening() {
  const [mode, setMode]     = useState(null);
  const [result, setResult] = useState(null);

  const resetToHub = () => { setMode(null); setResult(null); };

  const pct   = result ? Math.round(result.probability * 100) : 0;
  const rColor = pct >= 70 ? 'var(--accent-rose)' : pct >= 40 ? 'var(--accent-amber)' : 'var(--accent-emerald)';
  const circ   = 2 * Math.PI * 45;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="cs-root">

      {!mode && (
        <motion.div
          className="cs-hub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="cs-hub-header">
            <h2 className="cs-hub-heading">Choose Assessment Mode</h2>
            <p className="cs-hub-body">
              Select between a quick symptom self-check or an advanced clinical data analysis.
            </p>
          </div>

          <div className="cs-mode-cards">
            <button className="cs-mode-card glass-panel" onClick={() => setMode('symptom')}>
              <div className="cs-mode-card-icon" style={{color: 'var(--accent-emerald)'}}>
                <ClipboardList size={32} />
              </div>
              <div className="cs-mode-card-content">
                <p className="cs-mode-card-title">Quick Symptom Check</p>
                <p className="cs-mode-card-desc">
                  5 simple questions about your symptoms and history. No lab results needed.
                </p>
                <div className="cs-mode-card-badges">
                  <span className="badge badge-green">Self-assessment</span>
                </div>
              </div>
            </button>

            <button className="cs-mode-card glass-panel" onClick={() => setMode('clinical')}>
              <div className="cs-mode-card-icon" style={{color: '#38bdf8'}}>
                <Droplets size={32} />
              </div>
              <div className="cs-mode-card-content">
                <p className="cs-mode-card-title">Clinical Data Analysis</p>
                <p className="cs-mode-card-desc">
                  AI analysis of clinical metrics using the PIMA Indian Diabetes model.
                </p>
                <div className="cs-mode-card-badges">
                  <span className="badge badge-blue" style={{background: 'rgba(56,189,248,0.1)', color: '#38bdf8', borderColor: 'rgba(56,189,248,0.2)'}}>Requires lab report</span>
                </div>
              </div>
            </button>
          </div>

          <DisclaimerPanel />
        </motion.div>
      )}

      {mode === 'symptom' && !result && (
        <div className="cs-mode-wrap">
          <div className="cs-mode-header">
            <button className="btn-ghost" onClick={resetToHub}>
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="cs-mode-title">Quick Symptom Check</h2>
          </div>
          <SymptomCheck />
        </div>
      )}

      {mode === 'clinical' && !result && (
        <div className="cs-mode-wrap">
          <div className="cs-mode-header">
            <button className="btn-ghost" onClick={resetToHub}>
              <ChevronLeft size={16} /> Back
            </button>
            <h2 className="cs-mode-title">Clinical Data Analysis</h2>
          </div>
          <ClinicalAnalysis onResult={setResult} />
          <DisclaimerPanel />
        </div>
      )}

      {mode === 'clinical' && result && (
        <motion.div
          className="cs-mode-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cs-mode-header">
            <button className="btn-ghost" onClick={resetToHub}>
              <ChevronLeft size={16} /> New screening
            </button>
            <h2 className="cs-mode-title">Analysis Result</h2>
          </div>

          <div className="cs-clinical-result glass-panel">
            <div className="cs-gauge-wrap">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={rColor} strokeWidth="7"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <text x="50" y="46" textAnchor="middle" fill={rColor}
                  fontSize="20" fontWeight="700" fontFamily="Inter">{pct}%</text>
                <text x="50" y="62" textAnchor="middle" fill="var(--text-muted)"
                  fontSize="8" fontFamily="Inter">probability</text>
              </svg>
              <div
                className="cs-result-badge"
                style={{ color: rColor, background: `${rColor}18`, border: `1px solid ${rColor}35` }}
              >
                {result.prediction.replace(/_/g, ' ')}
              </div>
            </div>

            <div className="cs-clinical-interpretation">
              <h3 className="cs-interp-title">Model Interpretation</h3>
              <p className="cs-interp-body">
                {pct >= 70
                  ? 'The clinical indicators strongly suggest an elevated risk for diabetes. Immediate consultation with a healthcare provider is recommended.'
                  : pct >= 40
                  ? 'The features show moderate indicators associated with diabetes risk. Clinical review with your physician is advisable.'
                  : 'The clinical features appear normal. Routine monitoring is still recommended.'
                }
              </p>

              {result.top_features?.length > 0 && (
                <div className="cs-top-features">
                  <p className="cs-features-label">Key Diagnostic Drivers</p>
                  <div className="cs-features-list">
                    {result.top_features.map((f, i) => (
                      <div className="cs-feature-row" key={f}>
                        <span className="cs-feature-rank">#{i + 1}</span>
                        <span className="cs-feature-name">
                          {f.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DisclaimerPanel />
        </motion.div>
      )}
    </div>
  );
}
