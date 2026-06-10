import React, { useState, useEffect } from 'react';
import PageBackground from '../components/PageBackground';
import { motion } from 'framer-motion';
import { Heart, Activity, Apple, Zap, ShieldCheck, Sun, ChevronDown, ChevronUp, Link as LinkIcon, ArrowLeft, Dumbbell, Moon, Brain, Droplets, CheckCircle2 } from 'lucide-react';
import BreathingExercise from './BreathingExercise';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const domRef = React.useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(domRef.current); } }, { threshold: 0.1 });
    if (domRef.current) obs.observe(domRef.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={domRef} className={`luxury-reveal ${vis ? 'is-revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
};

export default function HealthInfo() {
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const stats = [
    { value: '80%', label: 'of chronic diseases are preventable', color: '#10b981' },
    { value: '150 min', label: 'recommended weekly exercise', color: '#2563eb' },
    { value: '7-9 hrs', label: 'optimal nightly sleep', color: '#8b5cf6' },
    { value: '2.5L', label: 'daily water intake recommended', color: '#0ea5e9' },
  ];

  const pillars = [
    { icon: Apple, color: '#10b981', title: 'Nutrition', desc: 'Focus on whole, unprocessed foods rich in fiber, lean proteins, and essential fatty acids. Minimize refined sugars, processed meats, and synthetic additives. A colorful plate ensures diverse micronutrients.', tips: ['Eat 5+ servings of fruits/vegetables daily', 'Choose whole grains over refined', 'Limit added sugar to <25g/day'] },
    { icon: Dumbbell, color: '#f59e0b', title: 'Exercise', desc: 'Regular physical activity strengthens your heart, muscles, and bones while improving mental health. Mix cardio, strength training, and flexibility work for comprehensive fitness.', tips: ['150 min moderate or 75 min vigorous/week', 'Include 2+ days of strength training', 'Take movement breaks every 60 minutes'] },
    { icon: Moon, color: '#8b5cf6', title: 'Sleep', desc: 'Quality sleep is when your body repairs tissues, consolidates memories, and regulates hormones. Poor sleep is linked to obesity, heart disease, and cognitive decline.', tips: ['Maintain a consistent sleep schedule', 'Keep bedroom cool, dark, and quiet', 'Avoid screens 1 hour before bed'] },
    { icon: Brain, color: '#2563eb', title: 'Mental Wellness', desc: 'Chronic stress triggers inflammation and weakens immunity. Mindfulness, social connections, and purposeful activity are critical for psychological resilience.', tips: ['Practice 10 min daily mindfulness', 'Maintain strong social connections', 'Set boundaries between work and rest'] },
    { icon: Droplets, color: '#0ea5e9', title: 'Hydration', desc: 'Water is essential for every cellular process. Even mild dehydration impairs concentration, mood, and physical performance.', tips: ['Drink water first thing in the morning', 'Carry a water bottle throughout the day', 'Monitor urine color (pale yellow = good)'] },
    { icon: ShieldCheck, color: '#f43f5e', title: 'Preventive Care', desc: 'Regular health screenings catch issues early when they are most treatable. Vaccinations, dental checkups, and eye exams are all part of comprehensive preventive care.', tips: ['Annual physical with blood work', 'Stay current on vaccinations', 'Regular dental and eye checkups'] },
  ];

  const faqs = [
    { q: "What is considered a healthy baseline?", a: "A healthy baseline varies by individual, but generally includes a BMI of 18.5-24.9, blood pressure under 120/80 mmHg, fasting glucose between 70-100 mg/dL, and total cholesterol under 200 mg/dL." },
    { q: "How often should I get a checkup?", a: "For most healthy adults, an annual physical exam with basic blood work is recommended. Those over 50 or with chronic conditions may need more frequent monitoring." },
    { q: "What is the most important factor in longevity?", a: "While genetics play a role, consistent combination of nutrient-dense diet, daily movement, adequate sleep, stress management, and social connections are the most critical controllable factors." },
    { q: "Can lifestyle changes really prevent disease?", a: "Yes. Research shows that up to 80% of chronic diseases including heart disease, type 2 diabetes, and some cancers can be prevented through healthy lifestyle modifications." },
  ];

  return (
    <div className="info-page-root">
      <PageBackground variant="cool" />
      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn-ghost" style={{ padding: '0.5rem 1rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="info-header" style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(13, 58, 53, 0.4) 0%, rgba(13, 58, 53, 0.85) 100%)', zIndex: 1 }}></div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--bg-default)', padding: '0 2rem' }}>
            <Heart size={56} style={{ margin: '0 auto 1.5rem' }} color="var(--bg-default)" />
            <h1 className="info-title" style={{ color: 'var(--bg-default)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Health & Wellness</h1>
            <p className="info-subtitle" style={{ color: 'rgba(251, 246, 240, 0.9)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              A proactive approach to absolute physical and mental well-being.
            </p>
          </div>
        </motion.div>

        {/* STATISTICS */}
        <FadeIn>
          <div className="info-stats-grid">
            {stats.map((s, i) => (
              <div className="info-stat-card glass-panel" key={i}>
                <div className="info-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="info-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* PILLARS OF HEALTH */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Six Pillars of Health</h2>
            <p className="section-desc">Master these fundamentals for a thriving, resilient body and mind.</p>
          </div>
        </FadeIn>

        <div className="info-pillars-grid">
          {pillars.map((p, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="info-pillar-card glass-panel">
                <div className="info-pillar-icon" style={{ background: `${p.color}15`, color: p.color }}>
                  <p.icon size={24} />
                </div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>{p.desc}</p>
                <ul className="info-tips-list">
                  {p.tips.map((tip, j) => (
                    <li key={j}><CheckCircle2 size={14} color={p.color} /> {tip}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* BREATHING EXERCISE */}
        <div style={{ margin: '4rem 0' }}>
          <FadeIn>
            <BreathingExercise />
          </FadeIn>
        </div>

        {/* FAQ */}
        <FadeIn>
          <div className="faq-section" style={{ marginBottom: '4rem', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'is-open' : ''}`} onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 0' }}>
                  <div className="faq-question" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                    <h4>{faq.q}</h4>
                    {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {openFaq === idx && (
                    <div className="faq-answer" style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* RELATED */}
        <FadeIn>
          <div className="resources-section" style={{ marginBottom: '4rem' }}>
            <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>Related Information</h2>
            <div className="info-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <Link to="/diabetes" className="info-card-link" style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><LinkIcon size={18}/> Diabetes Guide</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Learn about managing blood sugar and diabetes risks.</p>
              </Link>
              <Link to="/cancer" className="info-card-link" style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><LinkIcon size={18}/> Cancer Prevention</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Information on screenings, symptoms, and risk reduction.</p>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
