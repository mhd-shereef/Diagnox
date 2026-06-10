import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Activity, ShieldCheck, Cpu, 
  Lock, CheckCircle2, ChevronDown, ChevronUp,
  Heart, ActivitySquare, Brain, Droplets, Microscope,
  UserCheck, Database
} from 'lucide-react';
import './Home.css';
import InteractiveCard from '../components/InteractiveCard';

// Helper component for scroll animations
const FadeIn = ({ children, delay = 0, className = '' }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { threshold: 0.15 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={domRef} 
      className={`luxury-reveal ${isVisible ? 'is-revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

/* ── Adaptive video loader: only loads on fast connections ── */
function AdaptiveHeroVideo() {
  const [canLoad, setCanLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      const dominated = conn.saveData;
      const fast = ['4g', 'wifi'].includes(conn.effectiveType) || !conn.effectiveType;
      setCanLoad(!dominated && fast);
    } else {
      // No connection API — assume desktop with good connection
      setCanLoad(true);
    }
  }, []);

  if (!canLoad) return null;

  return (
    <video
      src="/cinematic-video.mov"
      autoPlay loop muted playsInline
      className={`hero-video ${loaded ? 'hero-video--loaded' : ''}`}
      poster="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee4?auto=format&fit=crop&q=80&w=2000"
      onLoadedData={() => setLoaded(true)}
    />
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="home-root">
      
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className="home-hero">
        <div className="hero-video-wrapper">
          <AdaptiveHeroVideo />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="page-container hero-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', width: '100%' }}>
          <h1 className="hero-title-container" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.5rem, 2vw, 3rem)', flexWrap: 'nowrap', marginBottom: '1.5rem', margin: 0, padding: 0, width: '100%' }}>
            <FadeIn delay={0.2}><span className="hero-title" style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 5.5rem)', color: 'var(--bg-default)', margin: 0, whiteSpace: 'nowrap' }}>Assess.</span></FadeIn>
            <FadeIn delay={0.4}><span className="hero-title" style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 5.5rem)', color: 'var(--bg-default)', margin: 0, whiteSpace: 'nowrap' }}>Prevent.</span></FadeIn>
            <FadeIn delay={0.6}><span className="hero-title" style={{ display: 'block', fontSize: 'clamp(2rem, 5vw, 5.5rem)', color: 'var(--bg-default)', margin: 0, whiteSpace: 'nowrap' }}>Thrive.</span></FadeIn>
          </h1>
          <FadeIn delay={0.3}>
            <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.25rem', color: 'rgba(251, 246, 240, 0.85)' }}>
              Diagnox combines clinical-grade precision with intuitive technology to help you proactively monitor and elevate your lifelong health journey.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} className="hero-ctas">
            <Link to="/login" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              Start Assessment
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* =========================================
          2. SERVICES SECTION
          ========================================= */}
      <section id="services" className="home-section services-section">
        <div className="page-container">
          <FadeIn>
            <div className="section-header text-center">
              <h2 className="section-title">Premium Care Capabilities</h2>
              <p className="section-desc">Comprehensive tools designed to give you absolute clarity about your health.</p>
            </div>
          </FadeIn>
          
          <div className="services-grid">
            <FadeIn delay={0.1}>
              <InteractiveCard className="service-card glass-panel">
                <div className="service-icon"><ActivitySquare size={24} /></div>
                <h3>AI Health Screening</h3>
                <p>Advanced algorithmic analysis of clinical symptoms and biopsy cytology.</p>
              </InteractiveCard>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <InteractiveCard className="service-card glass-panel">
                <div className="service-icon"><Heart size={24} /></div>
                <h3>Health Risk Assessment</h3>
                <p>Predictive modeling for cardiovascular and metabolic conditions.</p>
              </InteractiveCard>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <InteractiveCard className="service-card glass-panel">
                <div className="service-icon"><Activity size={24} /></div>
                <h3>Wellness Tracking</h3>
                <p>Continuous monitoring of vitals, BMI, and long-term health trends.</p>
              </InteractiveCard>
            </FadeIn>

            <FadeIn delay={0.4}>
              <InteractiveCard className="service-card glass-panel">
                <div className="service-icon"><Microscope size={24} /></div>
                <h3>Health Reports</h3>
                <p>Detailed, clinical-grade reporting generated instantly for your physician.</p>
              </InteractiveCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================================
          3. HEALTH INFORMATION MODULES
          ========================================= */}
      <section className="home-section info-cards-section">
        <div className="page-container">
          <FadeIn>
            <div className="section-header text-center">
              <h2 className="section-title">Explore Health Intelligence</h2>
              <p className="section-desc">Learn more about vital health topics and how to proactively manage your well-being.</p>
            </div>
          </FadeIn>

          <div className="info-cards-grid">
            <FadeIn delay={0.1}>
              <InteractiveCard className="info-card">
                <div className="info-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800')" }}>
                  <div className="info-card-overlay"></div>
                </div>
                <div className="info-card-content">
                  <Heart size={36} className="info-card-icon" color="var(--primary-color)" />
                  <h3>Health</h3>
                  <p>Understand the foundations of wellness, nutrition, and proactive lifestyle choices to maintain peak condition.</p>
                  <Link to="/health" className="btn-ghost info-card-btn">Learn More <ArrowRight size={16} /></Link>
                </div>
              </InteractiveCard>
            </FadeIn>

            <FadeIn delay={0.2}>
              <InteractiveCard className="info-card">
                <div className="info-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800')" }}>
                  <div className="info-card-overlay"></div>
                </div>
                <div className="info-card-content">
                  <Droplets size={36} className="info-card-icon" color="var(--accent-cyan)" />
                  <h3>Diabetes</h3>
                  <p>Comprehensive guidance on types, symptoms, risk factors, and modern lifestyle management strategies.</p>
                  <Link to="/diabetes" className="btn-ghost info-card-btn">Learn More <ArrowRight size={16} /></Link>
                </div>
              </InteractiveCard>
            </FadeIn>

            <FadeIn delay={0.3}>
              <InteractiveCard className="info-card">
                <div className="info-card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800')" }}>
                  <div className="info-card-overlay"></div>
                </div>
                <div className="info-card-content">
                  <Microscope size={36} className="info-card-icon" color="var(--primary-color)" />
                  <h3>Cancer</h3>
                  <p>Vital information on screening, prevention, common types, and understanding the road to recovery.</p>
                  <Link to="/cancer" className="btn-ghost info-card-btn">Learn More <ArrowRight size={16} /></Link>
                </div>
              </InteractiveCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================================
          4. WHY CHOOSE US
          ========================================= */}
      <section className="home-section why-us-section alt-bg">
        <div className="page-container">
          <FadeIn>
            <div className="section-header text-center">
              <h2 className="section-title">The Diagnox Advantage</h2>
              <p className="section-desc">Why thousands trust us as their primary digital health companion.</p>
            </div>
          </FadeIn>

          <div className="why-us-grid">
            {[
              { icon: Brain, title: 'AI Powered', desc: 'Utilizing validated clinical datasets for unmatched precision.' },
              { icon: Lock, title: 'Secure Data', desc: 'Enterprise-grade encryption keeps your medical records private.' },
              { icon: Activity, title: 'Fast Results', desc: 'Real-time analysis means no waiting for critical insights.' },
              { icon: UserCheck, title: 'Personalized Insights', desc: 'Recommendations tailored entirely to your unique biology.' }
            ].map((feature, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <InteractiveCard className="why-card">
                  <feature.icon size={32} className="why-icon" />
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </InteractiveCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          5. INNOVATION
          ========================================= */}
      <section className="home-section innovation-section">
        <div className="page-container">
          <div className="innovation-grid">
            <div className="innovation-content">
              <FadeIn>
                <span className="section-eyebrow">Technology</span>
                <h2 className="section-title">Pioneering Health Tech</h2>
                <p className="section-desc text-left">
                  We leverage state-of-the-art predictive healthcare models to keep you one step ahead. 
                  Our smart recommendations adapt as your health profile evolves.
                </p>
                <ul className="innovation-list">
                  <li><CheckCircle2 size={18} className="text-accent" /> Predictive Healthcare Models</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Dynamic Smart Recommendations</li>
                  <li><CheckCircle2 size={18} className="text-accent" /> Conversational AI Assistant</li>
                </ul>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="innovation-visual">
               <InteractiveCard className="innovation-card glass-panel">
                 <Cpu size={40} className="innovation-hero-icon" />
                 <div className="innovation-pulse"></div>
               </InteractiveCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* =========================================
          6. SECURITY & PRIVACY
          ========================================= */}
      <section className="home-section security-section alt-bg">
        <div className="page-container text-center">
          <FadeIn>
            <ShieldCheck size={48} className="security-icon-large" style={{ margin: '0 auto', display: 'block' }} />
            <h2 className="section-title">Uncompromising Security</h2>
            <p className="section-desc" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Your health data is your most private asset. We protect it with military-grade 
              encryption, strict privacy controls, and secure storage.
            </p>
          </FadeIn>
          
          <div className="security-badges">
            <FadeIn delay={0.1} className="badge-pill"><Lock size={14}/> End-to-End Encryption</FadeIn>
            <FadeIn delay={0.2} className="badge-pill"><Database size={14}/> Secure Storage</FadeIn>
            <FadeIn delay={0.3} className="badge-pill"><UserCheck size={14}/> Privacy Controls</FadeIn>
          </div>
        </div>
      </section>

      {/* =========================================
          7. FAQ SECTION
          ========================================= */}
      <section className="home-section faq-section">
        <div className="page-container">
          <FadeIn>
            <div className="section-header text-center">
              <h2 className="section-title">Common Questions</h2>
            </div>
          </FadeIn>

          <div className="faq-list">
            {[
              { q: 'Is this a replacement for my doctor?', a: 'No. Diagnox provides preliminary risk estimates and wellness tracking. Always consult a qualified physician for medical diagnoses.' },
              { q: 'How accurate are the AI models?', a: 'Our models are trained on heavily validated clinical datasets (e.g., Wisconsin Breast Cancer dataset with 99.4% AUC), but they carry inherent false positive/negative rates.' },
              { q: 'Is my data shared with third parties?', a: 'Absolutely not. Your personal and clinical data is encrypted and never sold or shared with external advertisers.' },
            ].map((faq, idx) => (
              <FadeIn key={idx} delay={0.1 * idx}>
                <div className={`faq-item ${openFaq === idx ? 'is-open' : ''}`} onClick={() => toggleFaq(idx)}>
                  <div className="faq-question">
                    <h4>{faq.q}</h4>
                    {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          8. FINAL CTA
          ========================================= */}
      <section className="home-section cta-section">
        <div className="page-container">
          <FadeIn className="cta-box glass-panel text-center">
            <h2>Take Control of Your Health Journey</h2>
            <p>Experience the luxury of absolute clarity today.</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-primary btn-large">
                Start Assessment <ArrowRight size={18} className="btn-icon" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
