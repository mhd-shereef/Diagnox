import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  Microscope, Loader2, RotateCcw, ShieldAlert,
  FlaskConical, ClipboardList, Wand2, Info
} from 'lucide-react';
import './ScreeningUI.css';

/* ─── DISCLAIMER ───────────────────────────────────────────── */
const DISCLAIMER = [
  {
    icon: ShieldAlert,
    title: 'Screening tool — not a diagnosis',
    body: 'This tool provides a preliminary risk estimate only. It cannot diagnose cancer or any medical condition. Always consult a qualified physician.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk of false results',
    body: 'AI models carry inherent false positive and false negative rates. A low-risk result does not guarantee the absence of cancer.',
  },
  {
    icon: Info,
    title: 'Dataset limitations',
    body: 'The Clinical Analysis model is trained on the Wisconsin Breast Cancer dataset (cytology features). It has not been clinically validated for general use.',
  },
];

/* ─── MODE 1: SYMPTOM QUESTIONS ──────────────────────────────── */
const QUESTIONS = [
  {
    id: 'age', label: 'What is your current age range?',
    hint: 'Cancer risk generally increases with age.',
    type: 'choice',
    options: [
      { label: 'Under 30',  value: 'u30',  score: 0 },
      { label: '30 – 44',   value: '30_44', score: 5 },
      { label: '45 – 59',   value: '45_59', score: 15 },
      { label: '60 or older', value: '60p', score: 25 },
    ],
  },
  {
    id: 'family', label: 'Do you have a family history of cancer?',
    hint: 'First-degree relatives (parent, sibling, child) with cancer history.',
    type: 'choice',
    options: [
      { label: 'None known',                value: 'none',     score: 0 },
      { label: 'One close relative',        value: 'one',      score: 15 },
      { label: 'Multiple relatives',        value: 'multiple', score: 30 },
    ],
  },
  {
    id: 'weight_loss', label: 'Have you experienced unexplained weight loss?',
    hint: 'More than 10 lbs / 4.5 kg in 6 months without trying.',
    type: 'boolean',
  },
  {
    id: 'lump', label: 'Have you noticed any persistent lumps or unusual growths?',
    hint: 'A new lump, swelling, or thickening anywhere on the body.',
    type: 'boolean',
  },
  {
    id: 'fatigue', label: 'Are you experiencing chronic unexplained fatigue?',
    hint: 'Persistent extreme tiredness lasting more than 2 weeks.',
    type: 'boolean',
  }
];

const BOOLEAN_OPTS = [
  { label: 'Yes', value: 'yes', score: 1 },
  { label: 'No',  value: 'no',  score: 0 },
];

const BOOLEAN_WEIGHTS = {
  weight_loss: 15,
  lump:        25,
  fatigue:     10,
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
  if (score < 20) return { tier: 'Low',      color: 'var(--accent-emerald)', bg: 'var(--status-safe-bg)', label: 'Low Risk',      action: 'Maintain regular health check-ups and healthy lifestyle habits.' };
  if (score < 40) return { tier: 'Moderate', color: 'var(--accent-amber)', bg: 'var(--status-warn-bg)', label: 'Moderate Risk', action: 'Consider scheduling a wellness visit with your physician for personalized guidance.' };
  return          { tier: 'Elevated',  color: 'var(--accent-rose)', bg: 'var(--status-danger-bg)',  label: 'Elevated Risk', action: 'We strongly recommend booking an appointment with a healthcare professional soon.' };
}

/* ─── MODE 2: CLINICAL FIELDS ─────────── */
const CLINICAL_STEPS = [
  {
    title: 'Mean Cell Measurements',
    desc: 'Average values computed from all cell nuclei in the biopsy sample.',
    fields: [
      { key: 'radius_mean',              label: 'Mean Radius',              unit: 'mm' },
      { key: 'texture_mean',             label: 'Mean Texture',             unit: 'SD' },
      { key: 'perimeter_mean',           label: 'Mean Perimeter',           unit: 'mm' },
      { key: 'area_mean',                label: 'Mean Area',                unit: 'mm²' },
      { key: 'smoothness_mean',          label: 'Mean Smoothness' },
      { key: 'compactness_mean',         label: 'Mean Compactness' },
      { key: 'concavity_mean',           label: 'Mean Concavity' },
      { key: 'concave points_mean',      label: 'Mean Concave Points' },
      { key: 'symmetry_mean',            label: 'Mean Symmetry' },
      { key: 'fractal_dimension_mean',   label: 'Mean Fractal Dimension' },
    ],
  },
  {
    title: 'Standard Error Measurements',
    desc: 'Standard error of each feature across all cells in the sample.',
    fields: [
      { key: 'radius_se',              label: 'Radius SE',              unit: 'mm' },
      { key: 'texture_se',             label: 'Texture SE',             unit: 'SD' },
      { key: 'perimeter_se',           label: 'Perimeter SE',           unit: 'mm' },
      { key: 'area_se',                label: 'Area SE',                unit: 'mm²' },
      { key: 'smoothness_se',          label: 'Smoothness SE' },
      { key: 'compactness_se',         label: 'Compactness SE' },
      { key: 'concavity_se',           label: 'Concavity SE' },
      { key: 'concave points_se',      label: 'Concave Points SE' },
      { key: 'symmetry_se',            label: 'Symmetry SE' },
      { key: 'fractal_dimension_se',   label: 'Fractal Dimension SE' },
    ],
  },
  {
    title: 'Worst-Case Measurements',
    desc: 'Largest (worst) values for each feature across all cells.',
    fields: [
      { key: 'radius_worst',              label: 'Worst Radius',              unit: 'mm' },
      { key: 'texture_worst',             label: 'Worst Texture',             unit: 'SD' },
      { key: 'perimeter_worst',           label: 'Worst Perimeter',           unit: 'mm' },
      { key: 'area_worst',                label: 'Worst Area',                unit: 'mm²' },
      { key: 'smoothness_worst',          label: 'Worst Smoothness' },
      { key: 'compactness_worst',         label: 'Worst Compactness' },
      { key: 'concavity_worst',           label: 'Worst Concavity' },
      { key: 'concave points_worst',      label: 'Worst Concave Points' },
      { key: 'symmetry_worst',            label: 'Worst Symmetry' },
      { key: 'fractal_dimension_worst',   label: 'Worst Fractal Dimension' },
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
    currentStep.fields.every(f => values[f.key] !== undefined && values[f.key] !== '');

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {};
      // Ensure all 30 fields have a value (fallback to 0 if skipped somehow)
      CLINICAL_STEPS.forEach(s => s.fields.forEach(f => {
        payload[f.key] = Number(values[f.key]) || 0;
      }));
      const res = await axios.post('http://localhost:10000/predict/cancer', payload);
      onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const autoFillMalignant = () => {
    // Demo values that represent a malignant tumor pattern
    const mockData = {
      radius_mean: 17.99, texture_mean: 10.38, perimeter_mean: 122.8, area_mean: 1001, smoothness_mean: 0.1184, compactness_mean: 0.2776, concavity_mean: 0.3001, "concave points_mean": 0.1471, symmetry_mean: 0.2419, fractal_dimension_mean: 0.07871,
      radius_se: 1.095, texture_se: 0.9053, perimeter_se: 8.589, area_se: 153.4, smoothness_se: 0.006399, compactness_se: 0.04904, concavity_se: 0.05373, "concave points_se": 0.01587, symmetry_se: 0.03003, fractal_dimension_se: 0.006193,
      radius_worst: 25.38, texture_worst: 17.33, perimeter_worst: 184.6, area_worst: 2019, smoothness_worst: 0.1622, compactness_worst: 0.6656, concavity_worst: 0.7119, "concave points_worst": 0.2654, symmetry_worst: 0.4601, fractal_dimension_worst: 0.1189
    };
    setValues(mockData);
  };

  const autoFillBenign = () => {
    // Demo values that represent a benign tumor pattern
    const mockData = {
      radius_mean: 13.54, texture_mean: 14.36, perimeter_mean: 87.46, area_mean: 566.3, smoothness_mean: 0.09779, compactness_mean: 0.08129, concavity_mean: 0.06664, "concave points_mean": 0.04781, symmetry_mean: 0.1885, fractal_dimension_mean: 0.05766,
      radius_se: 0.2699, texture_se: 0.7886, perimeter_se: 2.058, area_se: 23.56, smoothness_se: 0.008462, compactness_se: 0.0146, concavity_se: 0.02387, "concave points_se": 0.01315, symmetry_se: 0.0198, fractal_dimension_se: 0.0023,
      radius_worst: 15.11, texture_worst: 19.26, perimeter_worst: 99.7, area_worst: 711.2, smoothness_worst: 0.144, compactness_worst: 0.1773, concavity_worst: 0.239, "concave points_worst": 0.1288, symmetry_worst: 0.2977, fractal_dimension_worst: 0.07259
    };
    setValues(mockData);
  };

  return (
    <div className="cs-clinical-wrap">
      {/* Auto fill toolbar for demo purposes to reduce form fatigue */}
      <div className="cs-autofill-bar glass-panel">
        <span className="cs-autofill-label"><Wand2 size={16}/> Smart Fill Demo:</span>
        <div className="cs-autofill-actions">
          <button className="btn-secondary" onClick={autoFillBenign}>Normal Sample</button>
          <button className="btn-secondary" onClick={autoFillMalignant}>Elevated Sample</button>
        </div>
      </div>

      {/* Step indicator */}
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
              Fine Needle Aspiration (FNA) cytology report
            </div>
            <p className="cs-step-desc">{currentStep.desc}</p>
            <div className="cs-field-grid">
              {currentStep.fields.map(f => (
                <div className="cs-field" key={f.key}>
                  <label className="cs-field-label">
                    {f.label}
                    {f.unit && <span className="cs-field-unit">{f.unit}</span>}
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input cs-field-input"
                    placeholder="0.000"
                    value={values[f.key] ?? ''}
                    onChange={e => set(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="cs-error glass-panel">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Navigation */}
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
              : <><Microscope size={16} /> Run Clinical Analysis</>
            }
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function CancerScreening() {
  const [mode, setMode]     = useState(null);   // null | 'symptom' | 'clinical'
  const [result, setResult] = useState(null);

  const resetToHub = () => { setMode(null); setResult(null); };

  const pct   = result ? Math.round(result.probability * 100) : 0;
  const rColor = pct >= 70 ? 'var(--accent-rose)' : pct >= 40 ? 'var(--accent-amber)' : 'var(--accent-emerald)';
  const circ   = 2 * Math.PI * 45;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="cs-root">

      {/* Mode hub */}
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
              Select between a quick symptom self-check or an advanced clinical cytology analysis.
            </p>
          </div>

          <div className="cs-mode-cards">
            {/* Mode 1 */}
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

            {/* Mode 2 */}
            <button className="cs-mode-card glass-panel" onClick={() => setMode('clinical')}>
              <div className="cs-mode-card-icon" style={{color: 'var(--accent-blue)'}}>
                <Microscope size={32} />
              </div>
              <div className="cs-mode-card-content">
                <p className="cs-mode-card-title">Clinical Data Analysis</p>
                <p className="cs-mode-card-desc">
                  AI analysis of FNA biopsy cytology using the Wisconsin Breast Cancer model.
                </p>
                <div className="cs-mode-card-badges">
                  <span className="badge badge-blue">Requires lab report</span>
                </div>
              </div>
            </button>
          </div>

          <DisclaimerPanel />
        </motion.div>
      )}

      {/* Symptom check mode */}
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

      {/* Clinical mode */}
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

      {/* Clinical result */}
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
            {/* Gauge */}
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
                {result.prediction}
              </div>
            </div>

            {/* Interpretation */}
            <div className="cs-clinical-interpretation">
              <h3 className="cs-interp-title">Model Interpretation</h3>
              <p className="cs-interp-body">
                {pct >= 70
                  ? 'The cytology features are consistent with patterns seen in malignant cells. Urgent clinical follow-up is strongly recommended.'
                  : pct >= 40
                  ? 'The features show some atypical characteristics. Clinical review with a pathologist is advisable.'
                  : 'The cytology features appear consistent with benign tissue patterns. Routine monitoring is still recommended.'
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
                          {f.replace(/_/g, ' ').replace('concave points', 'concave points')}
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
