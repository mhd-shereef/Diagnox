import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Play, ToggleLeft, ToggleRight } from 'lucide-react';
import './SmartForm.css';

/**
 * SmartForm — Replaces DynamicFormGenerator with context-aware fields:
 * - Toggle switches for binary fields
 * - Units shown inline
 * - Field groups
 * - Reference range hints
 */

/* ── Field meta: labels, units, hints, type overrides ─── */
const FIELD_META = {
  /* Cardio / Framingham */
  male:               { label: 'Biological sex',                type: 'toggle',  onLabel: 'Male', offLabel: 'Female', group: 'Demographics' },
  age:                { label: 'Age',                           unit: 'years',   group: 'Demographics',   hint: '30–70',  min: 20, max: 90 },
  education:          { label: 'Education level',               unit: '1–4',     group: 'Demographics',   hint: '1=Some HS, 2=HS, 3=Some college, 4=College+', min: 1, max: 4 },
  currentSmoker:      { label: 'Current smoker',                type: 'toggle',  onLabel: 'Yes', offLabel: 'No', group: 'Lifestyle' },
  cigsPerDay:         { label: 'Cigarettes per day',            unit: 'cigs/day',group: 'Lifestyle',      hint: '0 if non-smoker', min: 0, max: 70 },
  BPMeds:             { label: 'On blood pressure medication',  type: 'toggle',  onLabel: 'Yes', offLabel: 'No', group: 'Medical history' },
  prevalentStroke:    { label: 'History of stroke',             type: 'toggle',  onLabel: 'Yes', offLabel: 'No', group: 'Medical history' },
  prevalentHyp:       { label: 'Hypertension diagnosed',        type: 'toggle',  onLabel: 'Yes', offLabel: 'No', group: 'Medical history' },
  diabetes:           { label: 'Diabetes diagnosed',            type: 'toggle',  onLabel: 'Yes', offLabel: 'No', group: 'Medical history' },
  totChol:            { label: 'Total cholesterol',             unit: 'mg/dL',   group: 'Labs',           hint: 'Normal: <200', min: 100, max: 700 },
  sysBP:              { label: 'Systolic blood pressure',       unit: 'mm Hg',   group: 'Labs',           hint: 'Normal: <120', min: 80, max: 300 },
  diaBP:              { label: 'Diastolic blood pressure',      unit: 'mm Hg',   group: 'Labs',           hint: 'Normal: <80',  min: 40, max: 180 },
  BMI:                { label: 'Body mass index (BMI)',         unit: 'kg/m²',   group: 'Labs',           hint: 'Normal: 18.5–24.9', min: 10, max: 60 },
  heartRate:          { label: 'Resting heart rate',            unit: 'BPM',     group: 'Labs',           hint: 'Normal: 60–100', min: 30, max: 200 },
  glucose:            { label: 'Fasting blood glucose',         unit: 'mg/dL',   group: 'Labs',           hint: 'Normal: 70–100', min: 40, max: 600 },

  /* Diabetes / PIMA */
  Pregnancies:        { label: 'Number of pregnancies',                          group: 'History',        hint: '0 if male/N/A', min: 0, max: 20 },
  Glucose:            { label: 'Plasma glucose (2h oral GTT)',  unit: 'mg/dL',   group: 'Labs',           hint: 'Normal: <140', min: 0, max: 400 },
  BloodPressure:      { label: 'Diastolic blood pressure',      unit: 'mm Hg',   group: 'Labs',           hint: 'Normal: <80',  min: 0, max: 200 },
  SkinThickness:      { label: 'Triceps skin fold thickness',   unit: 'mm',      group: 'Labs',           hint: 'Typical: 10–40', min: 0, max: 100 },
  Insulin:            { label: '2-hour serum insulin',          unit: 'μU/mL',   group: 'Labs',           hint: 'Fasting normal: 2–25', min: 0, max: 900 },
  DiabetesPedigreeFunction: { label: 'Diabetes pedigree function', unit: '',     group: 'History',        hint: 'Genetic influence score (0.08–2.42)' },
  Age:                { label: 'Age',                           unit: 'years',   group: 'Demographics',   min: 1, max: 110 },
};

function getGroups(fields) {
  const groups = {};
  fields.forEach(f => {
    const meta = FIELD_META[f.name] || {};
    const g = meta.group || 'General';
    if (!groups[g]) groups[g] = [];
    groups[g].push({ ...f, meta });
  });
  return groups;
}

function ToggleField({ field, value, onChange }) {
  const on = value === 1 || value === '1' || value === true;
  return (
    <div className="sf-toggle-row">
      <span className="sf-toggle-label">
        {field.meta.label}
      </span>
      <button
        type="button"
        className={`sf-toggle-btn ${on ? 'sf-toggle-btn--on' : ''}`}
        onClick={() => onChange(field.name, on ? 0 : 1)}
        aria-label={field.meta.label}
      >
        {on
          ? <><ToggleRight size={18} /> <span>{field.meta.onLabel || 'Yes'}</span></>
          : <><ToggleLeft  size={18} /> <span>{field.meta.offLabel || 'No'}</span></>
        }
      </button>
    </div>
  );
}

export default function SmartForm({ fields, onSubmit, isLoading }) {
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach(f => {
      const meta = FIELD_META[f.name] || {};
      init[f.name] = meta.type === 'toggle' ? 0 : '';
    });
    return init;
  });

  const set = (name, val) => setValues(v => ({ ...v, [name]: val }));

  const handleSubmit = e => {
    e.preventDefault();
    const processed = {};
    fields.forEach(f => {
      processed[f.name] = Number(values[f.name]);
    });
    onSubmit(processed);
  };

  const groups = getGroups(fields);

  return (
    <form onSubmit={handleSubmit} className="sf-root">
      {Object.entries(groups).map(([groupName, groupFields]) => (
        <div className="sf-group" key={groupName}>
          <p className="sf-group-label">{groupName}</p>
          <div className="sf-grid">
            {groupFields.map(f => {
              const meta = f.meta;
              if (meta.type === 'toggle') {
                return (
                  <div className="sf-field sf-field--toggle" key={f.name}>
                    <ToggleField
                      field={f}
                      value={values[f.name]}
                      onChange={set}
                    />
                  </div>
                );
              }
              return (
                <div className="sf-field" key={f.name}>
                  <label className="sf-label">
                    {meta.label || f.name.replace(/_/g, ' ')}
                    {meta.unit && <span className="sf-unit">{meta.unit}</span>}
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-input sf-input"
                    value={values[f.name]}
                    onChange={e => set(f.name, e.target.value)}
                    required={f.required}
                    min={meta.min}
                    max={meta.max}
                    placeholder="—"
                  />
                  {meta.hint && <span className="sf-hint">{meta.hint}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <motion.button
        type="submit"
        disabled={isLoading}
        className="btn-primary sf-submit"
        whileHover={!isLoading ? { y: -1 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading
          ? <><Loader2 size={15} className="sf-spin" /> Analysing…</>
          : <><Play size={14} /> Run Prediction</>
        }
      </motion.button>
    </form>
  );
}
