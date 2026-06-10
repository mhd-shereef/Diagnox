import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Weight, Apple, Activity, Droplets, Moon, Utensils } from 'lucide-react';
import './BMITracker.css';

const categories = [
  { max: 18.5, label: 'Underweight', color: '#60a5fa', bg: 'rgba(37,99,235,0.12)',  tip: 'Consider a nutrition plan to reach a healthy weight range.' },
  { max: 25,   label: 'Normal',      color: '#34d399', bg: 'rgba(16,185,129,0.12)', tip: 'Great! You\'re in a healthy weight range. Keep it up!' },
  { max: 30,   label: 'Overweight',  color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', tip: 'Moderate exercise and a balanced diet can help.' },
  { max: Infinity, label: 'Obese',   color: '#fb7185', bg: 'rgba(244,63,94,0.12)',  tip: 'Consult a healthcare provider for a personalised plan.' },
];

function getCategory(bmi) {
  return categories.find(c => bmi < c.max) || categories[3];
}

// BMI scale bar — thumb position
function BMIScale({ bmi }) {
  const pct = Math.min(Math.max(((bmi - 10) / (45 - 10)) * 100, 0), 100);
  return (
    <div className="bmi-scale">
      <div className="bmi-scale-track">
        <div className="bmi-scale-fill" style={{ width: `${pct}%` }} />
        <div className="bmi-scale-thumb" style={{ left: `${pct}%` }}>
          <div className="bmi-scale-tooltip">{bmi}</div>
        </div>
      </div>
      <div className="bmi-scale-labels">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </div>
  );
}

const COMMON_WEIGHTS = [50, 60, 70, 80, 90, 100];
const COMMON_HEIGHTS = [150, 160, 170, 180, 190];

export default function BMITracker() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi,    setBmi]    = useState(null);
  const [cat,    setCat]    = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loadingDiet, setLoadingDiet] = useState(false);

  // Auto-calculate on change
  useEffect(() => {
    if (weight && height && weight > 10 && height > 50) {
      const h = height / 100;
      const b = parseFloat((weight / (h * h)).toFixed(1));
      setBmi(b);
      const newCat = getCategory(b);
      setCat(newCat);
      
      // Fetch AI Diet Recommendations based on new BMI
      const timer = setTimeout(() => fetchDietPlan(b, newCat.label, height, weight), 1000);
      return () => clearTimeout(timer);
    } else {
      setBmi(null);
      setCat(null);
      setDietPlan(null);
    }
  }, [weight, height]);

  const fetchDietPlan = async (currentBmi, categoryLabel, h, w) => {
    setLoadingDiet(true);
    try {
      const backendUrl = 'http://localhost:10000/api/chat';

      const prompt = `You are an expert clinical nutritionist. A patient has a weight of ${w}kg, height of ${h}cm, resulting in a BMI of ${currentBmi} (${categoryLabel}). Provide a very concise, structured JSON response containing personalized diet and lifestyle recommendations. 
The JSON must have this exact structure: 
{
  "summary": "1 sentence health summary",
  "breakfast": "short breakfast idea",
  "lunch": "short lunch idea",
  "dinner": "short dinner idea",
  "snacks": "short healthy snack ideas",
  "water": "water intake guidance",
  "sleep": "sleep recommendations",
  "activity": "physical activity suggestion",
  "weeklyGoal": "1 sentence weekly improvement plan"
}
ONLY RETURN VALID JSON, no markdown formatting.`;


      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-oss:120b',
          messages: [{ role: 'system', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error('AI service unavailable');
      const data = await response.json();
      const content = data.content || '{}';
      
      // Try to parse JSON from AI response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setDietPlan(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      console.error('Failed to fetch diet plan:', err);
      // Fallback dummy data if AI fails
      setDietPlan({
        summary: `Personalized plan for ${categoryLabel} BMI range.`,
        breakfast: "Oatmeal with berries and nuts.",
        lunch: "Grilled chicken salad with olive oil dressing.",
        dinner: "Baked salmon with steamed vegetables.",
        snacks: "Greek yogurt or a handful of almonds.",
        water: "Drink at least 2.5 liters of water daily.",
        sleep: "Aim for 7-8 hours of quality sleep.",
        activity: "30 minutes of moderate exercise 5 times a week.",
        weeklyGoal: "Focus on consistency and building healthy habits."
      });
    } finally {
      setLoadingDiet(false);
    }
  };

  return (
    <div className="bmi-root">
      <div className="page-container">
        <div className="bmi-layout">

          {/* Card */}
          <motion.div
            className="bmi-card card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="bmi-header">
              <div className="bmi-icon">
                <Weight size={22} color="#fff" />
              </div>
              <div>
                <h1 className="bmi-title">BMI Tracker</h1>
                <p className="bmi-subtitle">Body Mass Index calculator</p>
              </div>
            </div>

            {/* Form */}
            <div className="bmi-form">
              <div className="bmi-inputs">
                <div className="form-group">
                  <label className="form-label">Weight</label>
                  <div className="bmi-input-wrap">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="70"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      min="10" max="300"
                    />
                    <span className="bmi-unit">kg</span>
                  </div>
                  <div className="bmi-quick-select">
                    {COMMON_WEIGHTS.map(w => (
                      <button key={w} type="button" className="bmi-quick-btn" onClick={() => setWeight(w)}>{w}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Height</label>
                  <div className="bmi-input-wrap">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="175"
                      value={height}
                      onChange={e => setHeight(e.target.value)}
                      min="50" max="300"
                    />
                    <span className="bmi-unit">cm</span>
                  </div>
                  <div className="bmi-quick-select">
                    {COMMON_HEIGHTS.map(h => (
                      <button key={h} type="button" className="bmi-quick-btn" onClick={() => setHeight(h)}>{h}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {bmi && cat && (
                <motion.div
                  className="bmi-result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="bmi-result-top">
                    <div className="bmi-score" style={{ color: cat.color }}>
                      {bmi}
                    </div>
                    <div className="bmi-cat-badge" style={{ background: cat.bg, color: cat.color }}>
                      {cat.label}
                    </div>
                  </div>

                  <BMIScale bmi={bmi} />

                  <div className="bmi-tip" style={{ borderColor: `${cat.color}30`, background: cat.bg }}>
                    <span style={{ color: cat.color }}>💡</span>
                    <p style={{ color: cat.color }}>{cat.tip}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Diet Recommendations */}
            <AnimatePresence>
              {bmi && (loadingDiet || dietPlan) && (
                <motion.div 
                  className="ai-diet-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="ai-diet-header">
                    <Apple size={20} color="#34d399" />
                    <h3 className="ai-diet-title">AI Personalized Plan</h3>
                  </div>
                  
                  {loadingDiet ? (
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Generating clinical recommendations...</div>
                  ) : (
                    <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                        {dietPlan.summary}
                      </p>
                      
                      <div className="ai-diet-grid">
                        <div className="ai-diet-card">
                          <h4><Utensils size={14} style={{ display: 'inline', marginRight: '6px' }}/>Nutrition</h4>
                          <ul>
                            <li><strong>Breakfast:</strong> {dietPlan.breakfast}</li>
                            <li><strong>Lunch:</strong> {dietPlan.lunch}</li>
                            <li><strong>Dinner:</strong> {dietPlan.dinner}</li>
                            <li><strong>Snacks:</strong> {dietPlan.snacks}</li>
                          </ul>
                        </div>
                        
                        <div className="ai-diet-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <h4><Activity size={14} style={{ display: 'inline', marginRight: '6px' }}/>Activity</h4>
                            <p>{dietPlan.activity}</p>
                          </div>
                          <div>
                            <h4><Droplets size={14} style={{ display: 'inline', marginRight: '6px', color: '#60a5fa' }}/>Hydration</h4>
                            <p>{dietPlan.water}</p>
                          </div>
                          <div>
                            <h4><Moon size={14} style={{ display: 'inline', marginRight: '6px', color: '#a78bfa' }}/>Rest & Recovery</h4>
                            <p>{dietPlan.sleep}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ai-diet-card" style={{ marginTop: '1rem', background: 'rgba(52, 211, 153, 0.1)', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
                        <h4 style={{ color: '#34d399' }}>Weekly Goal</h4>
                        <p style={{ color: 'var(--text-primary)' }}>{dietPlan.weeklyGoal}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* Reference table */}
          <motion.div
            className="bmi-ref card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="bmi-ref-title">BMI Reference</h3>
            <div className="bmi-ref-rows">
              {[
                { range: '< 18.5', label: 'Underweight', color: '#60a5fa' },
                { range: '18.5 – 24.9', label: 'Normal weight', color: '#34d399' },
                { range: '25 – 29.9', label: 'Overweight', color: '#fbbf24' },
                { range: '≥ 30', label: 'Obese', color: '#fb7185' },
              ].map(row => (
                <div key={row.label} className="bmi-ref-row">
                  <span className="bmi-ref-dot" style={{ background: row.color }} />
                  <span className="bmi-ref-range">{row.range}</span>
                  <span className="bmi-ref-label" style={{ color: row.color }}>{row.label}</span>
                </div>
              ))}
            </div>

            <div className="bmi-disclaimer">
              BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for medical advice.
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
