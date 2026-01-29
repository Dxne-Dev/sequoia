import { useState, useEffect } from 'react'
import './LandingPage.css'

// Icon Components
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
  </svg>
)

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.77.77L12 20.65l7.65-7.65.77-.77a5.4 5.4 0 000-7.65z"></path>
  </svg>
)

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path>
    <path d="M19 10v2a7 7 0 01-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
)

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)

const TreeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-7"></path>
    <path d="M17 8L12 3L7 8"></path>
    <path d="M19 12L12 5L5 12"></path>
    <path d="M21 16L12 7L3 16"></path>
  </svg>
)

const LandingPage = ({ onGetStarted, onShowPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const painPoints = [
    {
      icon: <ClockIcon />,
      pain: "Vous passez vos week-ends à corriger",
      solution: "Réduisez votre temps de correction de 70%"
    },
    {
      icon: <HeartIcon />,
      pain: "Vos appréciations se ressemblent toutes",
      solution: "Chaque feedback devient unique et personnalisé"
    },
    {
      icon: <SparklesIcon />,
      pain: "Vous manquez d'inspiration après 30 copies",
      solution: "L'IA ne fatigue jamais, vous oui"
    }
  ]

  const features = [
    {
      icon: <MicIcon />,
      title: "Dictez, ne tapez plus",
      description: "Un simple enregistrement vocal de 10 secondes génère un feedback complet et nuancé."
    },
    {
      icon: <ZapIcon />,
      title: "Génération instantanée",
      description: "De vos critères à une appréciation professionnelle en moins de 3 secondes."
    },
    {
      icon: <ShieldIcon />,
      title: "Vie privée respectée",
      description: "Aucune copie uploadée. Vos données ne servent pas à entraîner l'IA. Prénoms uniquement."
    },
    {
      icon: <HeartIcon />,
      title: "Ton pédagogique parfait",
      description: "Bienveillant, constructif, encourageant : exactement ce que vous écririez si vous aviez le temps."
    }
  ]

  const testimonials = [
    {
      quote: "J'ai récupéré mes dimanches. Sincèrement, ça a changé ma vie.",
      author: "Marie D.",
      role: "Professeure de Français, Collège"
    },
    {
      quote: "Mes élèves me disent que mes commentaires les aident vraiment maintenant. Avant, j'écrivais 'Bien' partout.",
      author: "Thomas L.",
      role: "Professeur d'Histoire-Géo, Lycée"
    },
    {
      quote: "Je culpabilisais de bâcler les appréciations. Plus maintenant.",
      author: "Sophie M.",
      role: "Professeure de SVT, Collège"
    }
  ]

  const stats = [
    { value: "70%", label: "de temps gagné en moyenne" },
    { value: "2min", label: "par copie au lieu de 6" },
    { value: "100%", label: "appréciations personnalisées" }
  ]

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-logo">
            <TreeIcon />
            <span className="landing-logo-text">Séquoia</span>
          </div>
          <div className="landing-nav-links">
            <button className="nav-link" onClick={onShowPrivacy}>Confidentialité</button>
            <button className="btn btn-primary btn-glow" onClick={onGetStarted}>
              Commencer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <SparklesIcon />
            <span>Propulsé par Intelligence Artificielle</span>
          </div>
          
          <h1 className="hero-title">
            Vous méritez des <span className="highlight">week-ends</span>, 
            <br />pas des piles de copies.
          </h1>
          
          <p className="hero-subtitle">
            Séquoia transforme vos évaluations en appréciations <strong>personnalisées</strong>, 
            <strong> bienveillantes</strong> et <strong>pédagogiquement riches</strong>. 
            En quelques secondes. Pas en quelques heures.
          </p>

          <div className="hero-cta">
            <button className="btn btn-primary btn-lg btn-glow" onClick={onGetStarted}>
              Essayer gratuitement
              <ArrowRightIcon />
            </button>
            <p className="cta-subtext">Aucune carte bancaire requise • Prêt en 30 secondes</p>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="mini-slider">
              <span className="slider-label-mini">Méthode</span>
              <div className="slider-visual">
                <div className="slider-fill" style={{width: '80%'}}></div>
              </div>
              <span className="slider-value-mini">4/5</span>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="feedback-preview">
              <span className="feedback-label">✨ Feedback généré</span>
              <p className="feedback-text">"Emma démontre une excellente maîtrise de l'argumentation..."</p>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="voice-indicator">
              <div className="voice-waves">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span className="voice-text">Note vocale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="pain-section">
        <div className="section-content">
          <h2 className="section-title">
            On sait ce que vous vivez.<br/>
            <span className="highlight">On l'a vécu aussi.</span>
          </h2>

          <div className="pain-grid">
            {painPoints.map((point, index) => (
              <div key={index} className="pain-card">
                <div className="pain-icon">{point.icon}</div>
                <div className="pain-content">
                  <p className="pain-text">{point.pain}</p>
                  <div className="pain-arrow">→</div>
                  <p className="solution-text">{point.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-content">
          <div className="section-header">
            <span className="section-badge">Fonctionnalités</span>
            <h2 className="section-title">
              Simple. Rapide. <span className="highlight">Éthique.</span>
            </h2>
            <p className="section-description">
              Conçu par des enseignants, pour des enseignants. 
              Pas de jargon technique, pas de complexité inutile.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-section">
        <div className="section-content">
          <div className="section-header">
            <span className="section-badge">Comment ça marche</span>
            <h2 className="section-title">
              3 étapes. <span className="highlight">2 minutes max.</span>
            </h2>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Définissez vos critères</h3>
                <p>Méthode, rédaction, orthographe... Ajustez les curseurs selon votre grille.</p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Ajoutez vos notes (optionnel)</h3>
                <p>Dictez une observation en 10 secondes. Ou tapez un mot-clé. Ou rien du tout.</p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Générez le feedback</h3>
                <p>L'IA rédige une appréciation complète, nuancée, que vous pouvez copier en un clic.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-content">
          <div className="section-header">
            <span className="section-badge">Témoignages</span>
            <h2 className="section-title">
              Ce qu'en disent <span className="highlight">vos collègues</span>
            </h2>
          </div>

          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
              >
                <blockquote className="testimonial-quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="author-info">
                    <span className="author-name">{testimonial.author}</span>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Assurance Section */}
      <section className="privacy-section">
        <div className="section-content">
          <div className="privacy-card">
            <div className="privacy-icon">
              <ShieldIcon />
            </div>
            <div className="privacy-content">
              <h3>La confidentialité n'est pas une option. C'est notre fondation.</h3>
              <ul className="privacy-list">
                <li><CheckIcon /> Aucune copie d'élève uploadée</li>
                <li><CheckIcon /> Données non utilisées pour entraîner l'IA</li>
                <li><CheckIcon /> Suppression en un clic</li>
                <li><CheckIcon /> Serveurs en Europe (RGPD)</li>
              </ul>
              <button className="btn btn-ghost" onClick={onShowPrivacy}>
                Lire notre politique de confidentialité complète →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-content">
          <div className="cta-container">
            <h2 className="cta-title">
              Prêt à récupérer vos soirées ?
            </h2>
            <p className="cta-description">
              Rejoignez les enseignants qui ont choisi de corriger intelligemment.
            </p>
            <button className="btn btn-primary btn-lg btn-glow" onClick={onGetStarted}>
              Commencer maintenant — C'est gratuit
              <ArrowRightIcon />
            </button>
            <p className="cta-reassurance">
              ✓ Gratuit pendant la beta &nbsp;&nbsp; ✓ Pas de carte bancaire &nbsp;&nbsp; ✓ Prêt en 30 secondes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo">
              <TreeIcon />
              <span className="landing-logo-text">Séquoia</span>
            </div>
            <p className="footer-tagline">L'assistant de correction qui respecte votre temps.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Produit</h4>
              <button className="footer-link" onClick={onGetStarted}>Commencer</button>
            </div>
            <div className="footer-column">
              <h4>Légal</h4>
              <button className="footer-link" onClick={onShowPrivacy}>Politique de confidentialité</button>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:contact@sequoia.app" className="footer-link">contact@sequoia.app</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Séquoia. Fait avec ❤️ pour les enseignants.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
