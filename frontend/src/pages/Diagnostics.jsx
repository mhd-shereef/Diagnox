import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { scanBackend } from '../services/backendScanner.js';
import { parseSchemaFields } from '../utils/schemaParser.js';
import SmartForm from '../utils/SmartForm.jsx';
import CancerScreening from './CancerScreening.jsx';
import DiabetesScreening from './DiabetesScreening.jsx';
import CardioScreening from './CardioScreening.jsx';
import PageBackground from '../components/PageBackground.jsx';
import {
  ActivitySquare, AlertCircle, CheckCircle2,
  Microscope, HeartPulse, Droplets,
  TrendingUp, ArrowLeft, ShieldCheck,
  BarChart3, ChevronRight
} from 'lucide-react';
import './Diagnostics.css';

/* ── Model registry ─────────────────────────────────────────── */
const MODELS = {
  cancer: {
    id:       'predict_cancer',
    title:    'Cancer Screening',
    subtitle: 'Breast cancer risk assessment',
    icon:     Microscope,
    color:    '#f43f5e',
    bg:       'rgba(244,63,94,0.08)',
    border:   'rgba(244,63,94,0.18)',
    accuracy: '99.4% AUC',
    dataset:  'Wisconsin Breast Cancer Dataset',
    desc:     'Two-mode screening: a quick symptom self-check or a full cytology analysis using AI trained on 569 clinical cases.',
    usesCustomUI: true,
  },
  blood: {
    id:       'predict_diabetes',
    title:    'Diabetes Risk',
    subtitle: 'Type 2 diabetes probability',
    icon:     Droplets,
    color:    '#38bdf8',
    bg:       'rgba(56,189,248,0.07)',
    border:   'rgba(56,189,248,0.18)',
    accuracy: '81% AUC',
    dataset:  'PIMA Indian Diabetes Dataset',
    desc:     'Predicts diabetes risk from 8 clinical indicators including glucose, BMI, and family history function.',
    usesCustomUI: true,
  },
  cardio: {
    id:       'predict_cardio',
    title:    'Cardiovascular Risk',
    subtitle: '10-year CHD probability',
    icon:     HeartPulse,
    color:    '#f59e0b',
    bg:       'rgba(245,158,11,0.07)',
    border:   'rgba(245,158,11,0.18)',
    accuracy: '81% AUC',
    dataset:  'Framingham Heart Study',
    desc:     'Estimates 10-year coronary heart disease risk using the Framingham model with 15 clinical variables.',
    usesCustomUI: true,
  },
};

/* ── Risk gauge ─────────────────────────────────────────────── */
function RiskGauge({ probability, color }) {
  const pct  = Math.round(probability * 100);
  const circ = 2 * Math.PI * 42;
  const off  = circ - (pct / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
      <circle
        cx="45" cy="45" r="42" fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="45" y="41" textAnchor="middle" fill={color}
        fontSize="17" fontWeight="700" fontFamily="Inter">{pct}%</text>
      <text x="45" y="55" textAnchor="middle" fill="rgba(255,255,255,0.3)"
        fontSize="7.5" fontFamily="Inter">probability</text>
    </svg>
  );
}

/* ── Result panel ─────────────────────────────────────────────── */
function ResultPanel({ result, model, onReset }) {
  const pct   = Math.round(result.probability * 100);
  const color = pct >= 70 ? '#f43f5e' : pct >= 40 ? '#f59e0b' : '#10b981';
  const isHigh = result.prediction.toLowerCase().includes('high') ||
                 result.prediction.toLowerCase().includes('malignant');

  return (
    <motion.div
      className="diag-result-panel"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="diag-result-top">
        <div className="diag-result-status">
          <CheckCircle2 size={15} color="#34d399" />
          <span>Analysis complete</span>
        </div>
        <button className="btn-ghost diag-result-reset" onClick={onReset} aria-label="Start a new assessment">
          <ArrowLeft size={13} aria-hidden="true" /> New assessment
        </button>
      </div>

      <div className="diag-result-body-new">
        {/* Gauge */}
        <div className="diag-result-gauge">
          <RiskGauge probability={result.probability} color={color} />
          <div
            className="diag-result-label"
            style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
          >
            {result.prediction.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Interpretation */}
        <div className="diag-result-interp">
          <p className="diag-result-interp-title">Interpretation</p>
          <p className="diag-result-interp-body">
            {isHigh
              ? `The model indicates elevated risk (${pct}%). Please consult a qualified healthcare provider promptly for proper clinical evaluation.`
              : `The model indicates lower risk (${pct}%). Continue regular health monitoring and scheduled screenings as recommended by your physician.`
            }
          </p>

          {result.top_features?.length > 0 && (
            <div className="diag-result-features">
              <p className="diag-result-features-title">
                <TrendingUp size={12} /> Key predictive factors
              </p>
              {result.top_features.map((f, i) => (
                <div className="diag-feature-row" key={f}>
                  <span className="diag-feature-rank">#{i + 1}</span>
                  <span className="diag-feature-name">
                    {f.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medical disclaimer */}
      <div className="diag-result-disclaimer">
        <ShieldCheck size={13} />
        This output is generated by a machine learning model and is <strong>not a clinical diagnosis</strong>.
        Do not make medical decisions based on this result alone.
      </div>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function Diagnostics() {
  const [backendStatus, setBackendStatus]     = useState({ loading: true, success: false, endpoints: [] });
  const [selectedKey, setSelectedKey]         = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError]                     = useState(null);

  useEffect(() => {
    scanBackend().then(status =>
      setBackendStatus({ loading: false, success: status.success, endpoints: status.endpoints || [] })
    );
  }, []);

  const selectedModel = selectedKey ? MODELS[selectedKey] : null;

  /* Find the matching endpoint from scanner */
  const selectedEndpoint = selectedModel
    ? backendStatus.endpoints.find(e => e.id === selectedModel.id)
    : null;

  const handleSelect = (key) => {
    setSelectedKey(key);
    setPredictionResult(null);
    setError(null);
  };

  const handleSubmit = async (data) => {
    setPredictionLoading(true);
    setError(null);
    setPredictionResult(null);
    try {
      const res = await axios({
        method: selectedEndpoint.method,
        url:    selectedEndpoint.fullUrl,
        data,
      });
      setPredictionResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Prediction failed');
    } finally {
      setPredictionLoading(false);
    }
  };

  const resetToHub = () => {
    setSelectedKey(null);
    setPredictionResult(null);
    setError(null);
  };

  /* ── Loading ── */
  if (backendStatus.loading) {
    return (
      <div className="diag-root">
        <div className="page-container diag-loading">
          <div className="diag-spinner-ring" />
          <span>Connecting to clinical backend…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="diag-root">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <PageBackground variant="cool" />
        <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Page header ── */}
          <div className="diag-page-header">
            <p className="diag-eyebrow">
              <ActivitySquare size={12} /> AI Diagnostics
            </p>
            <h1 className="diag-page-title">Clinical Prediction Models</h1>
            <p className="diag-page-desc">
              Three validated machine learning models for disease risk estimation.
              Each model requires clinical measurements — not a replacement for professional medical advice.
            </p>
          </div>

          {/* ── Backend offline ── */}
          {!backendStatus.success && (
            <motion.div
              className="diag-offline-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} color="#fb7185" />
              <div>
                <strong>Backend offline</strong>
                <p>Start the FastAPI server on <code>localhost:10000</code> to enable AI predictions.</p>
              </div>
            </motion.div>
          )}

          {/* ── Model hub ── */}
          <AnimatePresence mode="wait">
            {!selectedKey ? (
              <motion.div
                key="hub"
                className="diag-hub"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {Object.entries(MODELS).map(([key, model]) => (
                  <motion.button
                    key={key}
                    className="diag-model-card"
                    onClick={() => handleSelect(key)}
                    disabled={!backendStatus.success}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ '--model-color': model.color }}
                  >
                    {/* Accent line */}
                    <div className="diag-model-accent" style={{ background: model.color }} />

                    <div className="diag-model-card-inner">
                      <div className="diag-model-icon-row">
                        <div
                          className="diag-model-icon"
                          style={{ background: model.bg, color: model.color }}
                        >
                          <model.icon size={20} />
                        </div>
                        <div className="diag-model-accuracy">
                          <BarChart3 size={11} />
                          {model.accuracy}
                        </div>
                      </div>

                      <h3 className="diag-model-title">{model.title}</h3>
                      <p className="diag-model-subtitle">{model.subtitle}</p>
                      <p className="diag-model-desc">{model.desc}</p>

                      <div className="diag-model-footer">
                        <span className="diag-model-dataset">{model.dataset}</span>
                        <ChevronRight size={14} className="diag-model-arrow" aria-hidden="true" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* ── Panel header ── */}
                <div className="diag-panel-header-new">
                  <button className="diag-back-btn" onClick={resetToHub} aria-label="Back to all models">
                    <ArrowLeft size={14} aria-hidden="true" /> All models
                  </button>
                  <div className="diag-panel-meta">
                    <div
                      className="diag-panel-icon-sm"
                      style={{ background: selectedModel.bg, color: selectedModel.color }}
                    >
                      <selectedModel.icon size={16} />
                    </div>
                    <div>
                      <h2 className="diag-panel-title-new">{selectedModel.title}</h2>
                      <span className="diag-panel-dataset">{selectedModel.dataset}</span>
                    </div>
                  </div>
                </div>

                {/* ── Custom UIs ── */}
                {selectedModel.usesCustomUI ? (
                  <div className="diag-form-surface">
                    {selectedKey === 'cancer' && <CancerScreening />}
                    {selectedKey === 'blood' && <DiabetesScreening />}
                    {selectedKey === 'cardio' && <CardioScreening />}
                  </div>
                ) : predictionResult ? (
                  <ResultPanel
                    result={predictionResult}
                    model={selectedModel}
                    onReset={() => { setPredictionResult(null); setError(null); }}
                  />
                ) : (
                  <div className="diag-form-surface">
                    {selectedEndpoint?.requestSchema ? (
                      <>
                        {/* Medical context notice */}
                        <div className="diag-form-notice">
                          <ShieldCheck size={13} />
                          All values must match your actual clinical measurements from a recent medical report.
                          Do not estimate or guess.
                        </div>

                        <SmartForm
                          fields={parseSchemaFields(selectedEndpoint.requestSchema)}
                          onSubmit={handleSubmit}
                          isLoading={predictionLoading}
                        />

                        {/* Error */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              className="diag-error-inline"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <AlertCircle size={14} color="#fb7185" />
                              <span>{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <p className="diag-no-schema">No schema available for this model.</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
