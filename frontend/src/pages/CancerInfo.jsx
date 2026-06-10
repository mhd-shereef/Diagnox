import React, { useState, useEffect } from 'react';
import PageBackground from '../components/PageBackground';
import { motion } from 'framer-motion';
import { Microscope, AlertCircle, Heart, Activity, ArrowLeft, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Link as LinkIcon, Clock, Brain, Apple, Eye, Stethoscope, Sun, Shield } from 'lucide-react';
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

export default function CancerInfo() {
  const [openFaq, setOpenFaq] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const stats = [
    { value: '19.3M', label: 'new cancer cases globally per year', color: '#f43f5e' },
    { value: '30-50%', label: 'of cancers are preventable', color: '#10b981' },
    { value: '70%+', label: 'survival rate with early detection', color: '#2563eb' },
    { value: '#2', label: 'leading cause of death worldwide', color: '#f59e0b' },
  ];

  const commonTypes = [
    { name: 'Breast Cancer', prevalence: '2.26M cases/yr', survival: '90%+ (early stage)', color: '#ec4899', screening: 'Mammogram every 1-2 years (age 40+)', icon: Heart },
    { name: 'Lung Cancer', prevalence: '2.21M cases/yr', survival: '23% (all stages)', color: '#64748b', screening: 'Low-dose CT for high-risk (age 50-80)', icon: Activity },
    { name: 'Colorectal Cancer', prevalence: '1.93M cases/yr', survival: '65% (all stages)', color: '#f59e0b', screening: 'Colonoscopy every 10 years (age 45+)', icon: Stethoscope },
    { name: 'Prostate Cancer', prevalence: '1.41M cases/yr', survival: '98% (localized)', color: '#2563eb', screening: 'PSA test discussion with doctor (age 50+)', icon: Shield },
    { name: 'Skin Cancer', prevalence: '1.20M cases/yr', survival: '99% (melanoma, early)', color: '#f97316', screening: 'Annual skin exam, monthly self-checks', icon: Sun },
    { name: 'Cervical Cancer', prevalence: '604K cases/yr', survival: '92% (localized)', color: '#8b5cf6', screening: 'Pap smear every 3 years (age 21-65)', icon: Eye },
  ];

  const warningSignsCancer = [
    { letter: 'C', sign: 'Change in bowel or bladder habits' },
    { letter: 'A', sign: 'A sore that does not heal' },
    { letter: 'U', sign: 'Unusual bleeding or discharge' },
    { letter: 'T', sign: 'Thickening or lump in breast or elsewhere' },
    { letter: 'I', sign: 'Indigestion or difficulty swallowing' },
    { letter: 'O', sign: 'Obvious change in a wart or mole' },
    { letter: 'N', sign: 'Nagging cough or hoarseness' },
  ];

  const prevention = [
    { icon: Apple, title: 'Healthy Diet', desc: 'Eat plenty of fruits, vegetables, and whole grains. Limit processed meat, red meat, and alcohol. Maintain a healthy weight.' },
    { icon: Activity, title: 'Regular Exercise', desc: 'At least 150 minutes of moderate activity weekly. Physical activity reduces risk of colon, breast, and endometrial cancers.' },
    { icon: Sun, title: 'Sun Protection', desc: 'Use SPF 30+ sunscreen, wear protective clothing, avoid tanning beds. Skin cancer is the most preventable cancer type.' },
    { icon: Shield, title: 'Vaccination', desc: 'HPV vaccine prevents cervical and other cancers. Hepatitis B vaccine reduces liver cancer risk. Talk to your doctor about eligibility.' },
    { icon: ShieldCheck, title: 'Regular Screening', desc: 'Follow age-appropriate screening guidelines. Early detection dramatically improves survival rates across all cancer types.' },
    { icon: Brain, title: 'Avoid Carcinogens', desc: 'Don\'t smoke or use tobacco. Limit alcohol. Avoid exposure to known environmental carcinogens in workplace and home.' },
  ];

  const screeningSchedule = [
    { age: '21+', tests: ['Pap smear (every 3 years)', 'Skin self-exam (monthly)'] },
    { age: '40+', tests: ['Mammogram (every 1-2 years)', 'Annual skin exam by dermatologist'] },
    { age: '45+', tests: ['Colonoscopy (every 10 years)', 'Stool-based test (annually)'] },
    { age: '50+', tests: ['Lung CT scan (if high-risk smoker)', 'PSA discussion (men)', 'Prostate exam discussion'] },
  ];

  const faqs = [
    { q: 'Does cancer always show symptoms?', a: 'No. Many cancers are asymptomatic in early stages, which is why regular screening is critical. By the time symptoms appear, cancer may have advanced. Screening catches cancers when they are most treatable.' },
    { q: 'Is cancer hereditary?', a: 'About 5-10% of cancers are caused by inherited genetic mutations (e.g., BRCA1/2 for breast cancer). However, most cancers result from acquired mutations due to aging, lifestyle, and environmental factors.' },
    { q: 'What does our AI cancer screening tool do?', a: 'Our clinical analysis tool uses the Wisconsin Breast Cancer dataset model to analyze Fine Needle Aspiration (FNA) cytology features. It provides a preliminary risk estimate — not a diagnosis. Always follow up with your physician.' },
    { q: 'Can lifestyle changes really prevent cancer?', a: 'Yes. The WHO estimates that 30-50% of all cancers are preventable through modifiable risk factors: not smoking, healthy diet, regular exercise, limiting alcohol, and sun protection.' },
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
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: "url('https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(13, 58, 53, 0.4) 0%, rgba(13, 58, 53, 0.85) 100%)', zIndex: 1 }}></div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--bg-default)', padding: '0 2rem' }}>
            <Microscope size={56} style={{ margin: '0 auto 1.5rem' }} color="var(--bg-default)" />
            <h1 style={{ color: 'var(--bg-default)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Playfair Display', serif", marginBottom: '1rem' }}>Cancer Awareness</h1>
            <p style={{ color: 'rgba(251, 246, 240, 0.9)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Knowledge is your most powerful weapon. Understand prevention, screening, and early detection.
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

        {/* COMMON TYPES */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Common Cancer Types</h2>
            <p className="section-desc">Understanding prevalence, survival rates, and recommended screenings.</p>
          </div>
        </FadeIn>

        <div className="info-types-grid">
          {commonTypes.map((type, i) => (
            <FadeIn key={i} delay={0.08 * i}>
              <div className="info-type-card glass-panel" style={{ borderTop: `3px solid ${type.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: `${type.color}15`, color: type.color, borderRadius: '12px', padding: '0.5rem', display: 'flex' }}>
                    <type.icon size={20} />
                  </div>
                  <h3 style={{ color: type.color, margin: 0 }}>{type.name}</h3>
                </div>
                <div className="info-type-row"><strong>Prevalence:</strong> {type.prevalence}</div>
                <div className="info-type-row"><strong>5-yr Survival:</strong> {type.survival}</div>
                <div className="info-type-row"><strong>Screening:</strong> {type.screening}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* WARNING SIGNS — CAUTION mnemonic */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">7 Warning Signs</h2>
            <p className="section-desc">Remember <strong>"CAUTION"</strong> — the classic 7 warning signs of cancer.</p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="info-caution-grid">
            {warningSignsCancer.map((w, i) => (
              <div className="info-caution-card glass-panel" key={i}>
                <span className="info-caution-letter">{w.letter}</span>
                <span className="info-caution-text">{w.sign}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* SCREENING SCHEDULE */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Screening Schedule</h2>
            <p className="section-desc">Age-appropriate screening guidelines recommended by major health organizations.</p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="info-schedule-grid">
            {screeningSchedule.map((s, i) => (
              <div className="info-schedule-card glass-panel" key={i}>
                <div className="info-schedule-age">{s.age}</div>
                <ul className="info-tips-list">
                  {s.tests.map((t, j) => <li key={j}><CheckCircle2 size={14} color="#10b981" /> {t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* PREVENTION */}
        <FadeIn>
          <div className="section-header text-center" style={{ marginTop: '4rem' }}>
            <h2 className="section-title">Prevention Strategies</h2>
            <p className="section-desc">Up to 50% of cancers are preventable with these lifestyle modifications.</p>
          </div>
        </FadeIn>

        <div className="info-pillars-grid">
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

        {/* CTA */}
        <FadeIn>
          <div style={{ textAlign: 'center', margin: '4rem 0', padding: '3rem 2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Try Our Cancer Screening Tool</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Use the quick symptom check or clinical cytology analysis powered by validated ML models.
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
                <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><LinkIcon size={18} /> Health & Wellness</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Comprehensive wellness fundamentals and lifestyle guidance.</p>
              </Link>
              <Link to="/diabetes" style={{ padding: '2rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <h3 style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><LinkIcon size={18} /> Diabetes Guide</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Understanding types, symptoms, risk factors, and management.</p>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
