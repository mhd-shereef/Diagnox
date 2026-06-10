import React, { useState, useEffect } from 'react';
import PageBackground from '../components/PageBackground';
import { motion } from 'framer-motion';
import { Droplets, AlertCircle, Heart, Activity, Pill, ArrowLeft, TrendingUp, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Link as LinkIcon, BookOpen, Clock, Brain, Apple, Syringe } from 'lucide-react';
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

export default function DiabetesInfo() {
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const stats = [
    { value: '537M', label: 'adults living with diabetes globally', color: '#f59e0b' },
    { value: '90%', label: 'of cases are Type 2 (preventable)', color: '#10b981' },
    { value: '1 in 2', label: 'adults with diabetes are undiagnosed', color: '#f43f5e' },
    { value: '~$967B', label: 'annual global healthcare spending', color: '#2563eb' },
  ];

  const types = [
    {
      title: 'Type 1 Diabetes',
      color: '#f43f5e',
      onset: 'Childhood / Adolescence',
      cause: 'Autoimmune destruction of insulin-producing beta cells',
      treatment: 'Insulin therapy (lifelong)',
      prevalence: '~5-10% of cases',
      key_facts: ['Cannot be prevented', 'Requires daily insulin', 'Blood sugar monitoring essential'],
    },
    {
      title: 'Type 2 Diabetes',
      color: '#f59e0b',
      onset: 'Usually >40, increasingly younger',
      cause: 'Insulin resistance + progressive beta cell failure',
      treatment: 'Lifestyle changes, oral medications, possibly insulin',
      prevalence: '~90-95% of cases',
      key_facts: ['Strongly linked to lifestyle', 'Often preventable', 'Can be managed or reversed early'],
    },
    {
      title: 'Gestational Diabetes',
      color: '#8b5cf6',
      onset: 'During pregnancy (usually 24-28 weeks)',
      cause: 'Placental hormones cause insulin resistance',
      treatment: 'Diet, exercise, sometimes insulin',
      prevalence: '~6-9% of pregnancies',
      key_facts: ['Usually resolves after delivery', 'Increases future T2D risk', 'Affects baby\'s health'],
    },
  ];

  const symptoms = [
    { icon: Droplets, text: 'Excessive thirst (polydipsia)', color: '#0ea5e9' },
    { icon: Clock, text: 'Frequent urination (polyuria)', color: '#f59e0b' },
    { icon: TrendingUp, text: 'Unexplained weight loss', color: '#f43f5e' },
    { icon: Brain, text: 'Fatigue and blurred vision', color: '#8b5cf6' },
    { icon: Activity, text: 'Slow-healing cuts and wounds', color: '#10b981' },
    { icon: AlertCircle, text: 'Tingling in hands or feet', color: '#f97316' },
  ];

  const prevention = [
    { icon: Apple, title: 'Healthy Diet', desc: 'Focus on whole grains, lean proteins, healthy fats. Limit refined carbs and sugary drinks. Monitor portion sizes.' },
    { icon: Activity, title: 'Regular Exercise', desc: '150+ minutes of moderate aerobic activity weekly. Include resistance training. Even daily walks reduce risk by 30%.' },
    { icon: Heart, title: 'Healthy Weight', desc: 'Losing 5-7% of body weight can reduce Type 2 risk by up to 58%. Focus on sustainable, gradual changes.' },
    { icon: ShieldCheck, title: 'Regular Screening', desc: 'Fasting glucose and HbA1c tests every 1-3 years after age 45, or earlier if at risk.' },
  ];

  const faqs = [
    { q: 'What is the difference between blood sugar and HbA1c?', a: 'Blood sugar (glucose) is a snapshot of your current level. HbA1c reflects your average blood sugar over the past 2-3 months. Normal HbA1c is below 5.7%; 5.7-6.4% indicates prediabetes; 6.5%+ indicates diabetes.' },
    { q: 'Can Type 2 diabetes be reversed?', a: 'In early stages, Type 2 diabetes can often be put into remission through significant lifestyle changes (diet, exercise, weight loss). However, it requires sustained effort and medical supervision.' },
    { q: 'What should my blood sugar levels be?', a: 'Fasting: 70-100 mg/dL (normal), 100-125 (prediabetes), 126+ (diabetes). After meals (2 hours): below 140 mg/dL is normal.' },
    { q: 'Is diabetes hereditary?', a: 'Genetics play a role in both Type 1 and Type 2 diabetes, but Type 2 is strongly influenced by lifestyle factors. Having a family history increases your risk but does not guarantee you will develop it.' },
  ];

  return (
    <div className="info-page-root">
      <PageBackground variant="warm" />
      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn-ghost" style={{ padding: '0.5rem 1rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(13, 58, 53, 0.4) 0%, rgba(13, 58, 53, 0.85) 100%)', zIndex: 1 }}></div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--bg-default)', padding: '0 2rem' }}>
            <Droplets size={56} style={{ margin: '0 auto 1.5rem' }} color="var(--bg-default)" />
            <h1 style={{ color: 'var(--bg-default)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Playfair Display', serif", marginBottom: '1rem' }}>Diabetes</h1>
            <p style={{ color: 'rgba(251, 246, 240, 0.9)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Understanding types, symptoms, prevention, and modern management strategies.
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

        {/* TYPES COMPARISON */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Types of Diabetes</h2>
            <p className="section-desc">Understanding the key differences between the three major forms.</p>
          </div>
        </FadeIn>

        <div className="info-types-grid">
          {types.map((type, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="info-type-card glass-panel" style={{ borderTop: `3px solid ${type.color}` }}>
                <h3 style={{ color: type.color, marginBottom: '1rem' }}>{type.title}</h3>
                <div className="info-type-row"><strong>Onset:</strong> {type.onset}</div>
                <div className="info-type-row"><strong>Cause:</strong> {type.cause}</div>
                <div className="info-type-row"><strong>Treatment:</strong> {type.treatment}</div>
                <div className="info-type-row"><strong>Prevalence:</strong> {type.prevalence}</div>
                <ul className="info-tips-list" style={{ marginTop: '1rem' }}>
                  {type.key_facts.map((f, j) => <li key={j}><CheckCircle2 size={14} color={type.color} /> {f}</li>)}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* SYMPTOMS */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Warning Signs</h2>
            <p className="section-desc">Recognizing symptoms early can lead to better outcomes.</p>
          </div>
        </FadeIn>

        <div className="info-symptoms-grid">
          {symptoms.map((s, i) => (
            <FadeIn key={i} delay={0.05 * i}>
              <div className="info-symptom-card glass-panel">
                <div className="info-symptom-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <s.icon size={22} />
                </div>
                <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{s.text}</span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* PREVENTION */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Prevention Strategies</h2>
            <p className="section-desc">Actionable steps to reduce your Type 2 diabetes risk.</p>
          </div>
        </FadeIn>

        <div className="info-pillars-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {prevention.map((p, i) => (
            <FadeIn key={i} delay={0.1 * i}>
              <div className="info-pillar-card glass-panel">
                <div className="info-pillar-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
                  <p.icon size={24} />
                </div>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA: Use our tools */}
        <FadeIn>
          <div style={{ textAlign: 'center', margin: '4rem 0', padding: '3rem 2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Assess Your Diabetes Risk</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Use our AI-powered diagnostic tool to run a prediction based on your health metrics.
            </p>
            <Link to="/login" className="btn-primary">Start Screening</Link>
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn>
          <div style={{ marginBottom: '4rem', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'is-open' : ''}`} onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                    <h4>{faq.q}</h4>
                    {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {openFaq === idx && <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}><p>{faq.a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* RELATED */}
        <FadeIn>
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>Related Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <Link to="/health" style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><LinkIcon size={18}/> Health & Wellness</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Comprehensive wellness fundamentals and lifestyle guidance.</p>
              </Link>
              <Link to="/cancer" style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
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
