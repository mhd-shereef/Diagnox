import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, Heart, Shield, Activity, Info } from 'lucide-react';
import './TopicDetail.css';
import cinematicVideo from '../assets/cinematic-video.mov';

const topicsData = {
  'diabetes': {
    title: 'Diabetes Management & Prevention',
    subtitle: 'Comprehensive strategies to balance blood sugar and maintain a vibrant lifestyle.',
    image: '/assets/diabetes.jpg',
    placeholder: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200',
    overview: 'Diabetes is a chronic (long-lasting) health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (also called glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin.',
    causes: [
      'Genetic factors and family history',
      'Overweight or obesity',
      'Physical inactivity',
      'Insulin resistance (Type 2)',
      'Autoimmune destruction of beta cells (Type 1)'
    ],
    symptoms: [
      'Frequent urination',
      'Excessive thirst and extreme hunger',
      'Unexplained weight loss',
      'Fatigue and irritability',
      'Blurred vision and slow-healing sores'
    ],
    prevention: [
      'Maintain a healthy body weight',
      'Engage in regular physical activity (at least 150 mins/week)',
      'Eat a balanced diet rich in whole grains and fiber',
      'Avoid sugary beverages and highly processed foods',
      'Routine medical screenings'
    ],
    lifestyle: [
      'Monitor blood sugar levels regularly',
      'Prioritize sleep and stress management',
      'Build a supportive care team (dietitian, endocrinologist)',
      'Stay hydrated and limit alcohol consumption'
    ],
    treatment: 'Treatment varies depending on the type of diabetes but may include insulin therapy, oral medications to manage blood sugar, lifestyle modifications, and continuous glucose monitoring.',
    faqs: [
      { q: 'Can diabetes be reversed?', a: 'Type 2 diabetes can often go into remission through significant lifestyle changes and weight loss, though it is not "cured." Type 1 diabetes cannot currently be reversed.' },
      { q: 'What is a normal blood sugar level?', a: 'For someone without diabetes, fasting blood sugar should generally be under 100 mg/dL. Two hours after a meal, it should be less than 140 mg/dL.' },
      { q: 'Are all carbohydrates bad?', a: 'No, complex carbohydrates like those found in whole grains, beans, and vegetables are important for energy. It is the simple, refined carbs that should be limited.' }
    ],
    related: [
      { title: 'Understanding HbA1c', link: '#' },
      { title: 'The Role of Insulin', link: '#' }
    ]
  },
  'cancer-prevention': {
    title: 'Cancer Prevention Strategies',
    subtitle: 'Proactive steps and evidence-based lifestyle choices to lower your risk.',
    image: '/assets/cancer.jpg',
    placeholder: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200',
    overview: 'Cancer prevention involves taking active measures to reduce the chance of developing cancer. While not all cancers are preventable, scientists estimate that a significant percentage of cancer cases could be prevented through healthy lifestyle habits, avoiding known carcinogens, and undergoing regular screenings.',
    causes: [
      'Tobacco use',
      'Exposure to harmful radiation (UV, radon)',
      'Certain viral infections (HPV, Hepatitis B/C)',
      'Genetic mutations and family history',
      'Environmental toxins and occupational hazards'
    ],
    symptoms: [
      'Unexplained weight loss',
      'Fatigue that does not improve with rest',
      'Skin changes or unusual moles',
      'Persistent cough or trouble breathing',
      'Unusual bleeding or discharge'
    ],
    prevention: [
      'Avoid tobacco in all forms',
      'Protect your skin from the sun',
      'Get vaccinated against viral infections like HPV and Hepatitis B',
      'Maintain a healthy weight and stay physically active',
      'Follow a diet rich in fruits, vegetables, and whole grains'
    ],
    lifestyle: [
      'Limit alcohol consumption',
      'Avoid processed meats and excessive red meat',
      'Practice safe sex and avoid risky behaviors',
      'Ensure regular medical checkups and self-exams'
    ],
    treatment: 'While this topic focuses on prevention, treatments for cancer include surgery, chemotherapy, radiation therapy, immunotherapy, and targeted therapies based on the cancer type and stage.',
    faqs: [
      { q: 'Does family history mean I will definitely get cancer?', a: 'No. While a family history increases your risk, it does not guarantee you will develop cancer. Preventive measures and early screening become even more important.' },
      { q: 'Are artificial sweeteners linked to cancer?', a: 'Current evidence from major health organizations indicates that commercially available artificial sweeteners do not cause cancer in humans when consumed in moderate amounts.' },
      { q: 'When should I start getting cancer screenings?', a: 'Screening guidelines vary by age, gender, and family history. Consult your doctor for a personalized screening schedule.' }
    ],
    related: [
      { title: 'Importance of Early Detection', link: '#' },
      { title: 'Nutrition and Cancer Risk', link: '#' }
    ]
  },
  'heart-health': {
    title: 'Heart Health & Cardiovascular Wellness',
    subtitle: 'Build a resilient heart through proactive care and informed daily habits.',
    image: '/assets/heart.jpg',
    placeholder: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=1200',
    overview: 'Heart health refers to maintaining the structural and functional integrity of the cardiovascular system. Cardiovascular diseases (CVDs) are the leading cause of death globally, but many risks can be mitigated through lifestyle changes, early detection, and managing conditions like high blood pressure and cholesterol.',
    causes: [
      'High blood pressure (Hypertension)',
      'High levels of LDL cholesterol',
      'Smoking and tobacco use',
      'Sedentary lifestyle',
      'Chronic stress'
    ],
    symptoms: [
      'Chest pain, tightness, or discomfort',
      'Shortness of breath',
      'Pain, numbness, or weakness in the legs or arms',
      'Racing heartbeat (tachycardia) or slow heartbeat (bradycardia)',
      'Dizziness or fainting'
    ],
    prevention: [
      'Monitor and control blood pressure and cholesterol',
      'Engage in aerobic exercises (walking, swimming, cycling)',
      'Adopt a heart-healthy diet (like the Mediterranean diet)',
      'Quit smoking immediately',
      'Manage stress through mindfulness or yoga'
    ],
    lifestyle: [
      'Limit sodium (salt) intake',
      'Ensure 7-9 hours of quality sleep per night',
      'Stay socially active and maintain strong relationships',
      'Limit alcohol and avoid illicit substances'
    ],
    treatment: 'Treatments for heart conditions range from lifestyle changes and medications (like statins or beta-blockers) to surgical interventions such as angioplasty, stents, or bypass surgery.',
    faqs: [
      { q: 'What is a healthy blood pressure reading?', a: 'A normal blood pressure reading is generally considered to be below 120/80 mm Hg.' },
      { q: 'Does stress really affect my heart?', a: 'Yes. Chronic stress can lead to high blood pressure, arterial damage, and unhealthy coping mechanisms like overeating or smoking, all of which harm the heart.' },
      { q: 'Is red wine good for the heart?', a: 'Moderate consumption of red wine has been linked to some heart benefits, but the risks of alcohol often outweigh the benefits. It is not recommended to start drinking for heart health.' }
    ],
    related: [
      { title: 'Understanding Cholesterol Numbers', link: '#' },
      { title: 'Exercising for Cardiovascular Health', link: '#' }
    ]
  }
};

export default function TopicDetail() {
  const { topicId } = useParams();
  const [activeFaq, setActiveFaq] = useState(null);
  
  const data = topicsData[topicId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicId]);

  if (!data) {
    return (
      <div className="topic-not-found">
        <h2>Topic not found</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleImageError = (e) => {
    e.target.src = data.placeholder;
  };

  return (
    <div className="topic-detail-page">
      {/* HERO SECTION */}
      <div className="topic-hero">
        <div className="topic-hero-bg">
          <img 
            src={data.image} 
            alt={data.title}
            onError={handleImageError}
            className="topic-hero-image" 
          />
          <div className="topic-hero-overlay"></div>
        </div>
        <div className="topic-hero-content">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="topic-title">{data.title}</h1>
          <p className="topic-subtitle">{data.subtitle}</p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="topic-body">
        <div className="topic-main-content">
          <section className="content-section fade-up">
            <h2><Info size={24} className="section-icon" /> Overview</h2>
            <p className="overview-text">{data.overview}</p>
          </section>

          <div className="split-grid fade-up">
            <section className="content-section card-section">
              <h2><Activity size={24} className="section-icon" /> Key Causes</h2>
              <ul className="custom-list">
                {data.causes.map((cause, i) => <li key={i}>{cause}</li>)}
              </ul>
            </section>
            <section className="content-section card-section">
              <h2><Heart size={24} className="section-icon" /> Common Symptoms</h2>
              <ul className="custom-list">
                {data.symptoms.map((sym, i) => <li key={i}>{sym}</li>)}
              </ul>
            </section>
          </div>

          <section className="content-section highlight-section fade-up">
            <h2><Shield size={24} className="section-icon" /> Prevention & Protection</h2>
            <div className="prevention-grid">
              {data.prevention.map((prev, i) => (
                <div key={i} className="prevention-item">
                  <div className="check-circle">✓</div>
                  <span>{prev}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section fade-up">
            <h2>Lifestyle Recommendations</h2>
            <ul className="custom-list">
              {data.lifestyle.map((life, i) => <li key={i}>{life}</li>)}
            </ul>
          </section>

          <section className="content-section treatment-section fade-up">
            <h2>Treatment Awareness</h2>
            <p>{data.treatment}</p>
          </section>

          <section className="content-section faq-section fade-up">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-accordion">
              {data.faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`faq-item ${activeFaq === i ? 'active' : ''}`}
                  onClick={() => toggleFaq(i)}
                >
                  <div className="faq-question">
                    <h3>{faq.q}</h3>
                    {activeFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="topic-sidebar fade-up">
          <div className="sidebar-card">
            <h3>Related Articles</h3>
            <ul className="related-links">
              {data.related.map((rel, i) => (
                <li key={i}>
                  <a href={rel.link}>{rel.title}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-card prompt-card">
            <h3>Need Clinical Insights?</h3>
            <p>Use our AI-powered diagnostics to get personalized risk assessments instantly.</p>
            <Link to="/login" className="btn-primary-small">Open Diagnostics</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
