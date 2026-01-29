import { useState, useEffect } from 'react'
import './PrivacyPolicy.css'

// Icon Components
const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
)

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
)

const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
)

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
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

const PrivacyPolicy = ({ onBack }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        window.scrollTo(0, 0)
    }, [])

    const lastUpdated = "29 janvier 2025"

    return (
        <div className={`privacy-page ${isVisible ? 'visible' : ''}`}>
            {/* Navigation */}
            <nav className="privacy-nav">
                <div className="privacy-nav-content">
                    <button className="back-button" onClick={onBack}>
                        <ArrowLeftIcon />
                        <span>Retour</span>
                    </button>
                    <div className="landing-logo">
                        <TreeIcon />
                        <span className="landing-logo-text">Séquoia</span>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="privacy-hero">
                <div className="privacy-hero-content">
                    <div className="privacy-icon-large">
                        <ShieldIcon />
                    </div>
                    <h1>Politique de Confidentialité</h1>
                    <p className="privacy-subtitle">
                        La confidentialité de vos données et de celles de vos élèves est notre priorité absolue.
                    </p>
                    <span className="last-updated">Dernière mise à jour : {lastUpdated}</span>
                </div>
            </header>

            {/* TL;DR Summary */}
            <section className="tldr-section">
                <div className="tldr-card">
                    <h2>📌 En résumé (pour les profs pressés)</h2>
                    <div className="tldr-grid">
                        <div className="tldr-item positive">
                            <CheckIcon />
                            <span>Nous ne vendons <strong>jamais</strong> vos données</span>
                        </div>
                        <div className="tldr-item positive">
                            <CheckIcon />
                            <span>Vos données <strong>n'entraînent pas</strong> l'IA</span>
                        </div>
                        <div className="tldr-item positive">
                            <CheckIcon />
                            <span>Suppression <strong>en un clic</strong></span>
                        </div>
                        <div className="tldr-item positive">
                            <CheckIcon />
                            <span>Utilisez des <strong>prénoms seuls</strong>, pas de noms de famille</span>
                        </div>
                        <div className="tldr-item negative">
                            <XIcon />
                            <span><strong>Aucune copie</strong> d'élève uploadée</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="privacy-content">
                {/* Section 1 */}
                <section className="privacy-section" id="introduction">
                    <h2>1. Introduction</h2>
                    <p>
                        Bienvenue sur <strong>Séquoia</strong> (ci-après "le Service", "l'Application", "nous").
                    </p>
                    <p>
                        Séquoia est une application d'assistance à la rédaction de feedbacks pédagogiques destinée aux enseignants.
                        Nous accordons une importance primordiale à la protection de vos données personnelles et à celles de vos élèves.
                    </p>
                    <p>
                        La présente politique de confidentialité décrit les données que nous collectons, comment nous les utilisons,
                        et les droits dont vous disposez conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679).
                    </p>
                </section>

                {/* Section 2 */}
                <section className="privacy-section" id="responsable">
                    <h2>2. Responsable du traitement</h2>
                    <p>Le responsable du traitement des données est :</p>
                    <div className="info-box">
                        <p><strong>Séquoia</strong></p>
                        <p>Email de contact : <a href="mailto:contact@sequoia.app">contact@sequoia.app</a></p>
                    </div>
                    <p>Pour toute question relative à vos données personnelles, vous pouvez nous contacter à l'adresse ci-dessus.</p>
                </section>

                {/* Section 3 */}
                <section className="privacy-section" id="donnees-collectees">
                    <h2>3. Données collectées</h2>

                    <h3>3.1 Données du compte utilisateur (enseignant)</h3>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Donnée</th>
                                    <th>Finalité</th>
                                    <th>Base légale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Adresse email</td>
                                    <td>Création de compte, authentification, communication</td>
                                    <td>Exécution du contrat</td>
                                </tr>
                                <tr>
                                    <td>Mot de passe (chiffré)</td>
                                    <td>Sécurité du compte</td>
                                    <td>Exécution du contrat</td>
                                </tr>
                                <tr>
                                    <td>Prénom / Nom (optionnel)</td>
                                    <td>Personnalisation de l'interface</td>
                                    <td>Consentement</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>3.2 Données relatives aux élèves</h3>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Donnée</th>
                                    <th>Finalité</th>
                                    <th>Base légale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Prénom de l'élève</td>
                                    <td>Identification dans les feedbacks générés</td>
                                    <td>Intérêt légitime</td>
                                </tr>
                                <tr>
                                    <td>Évaluations par critères (scores)</td>
                                    <td>Génération du feedback personnalisé</td>
                                    <td>Exécution du contrat</td>
                                </tr>
                                <tr>
                                    <td>Notes vocales ou textuelles</td>
                                    <td>Enrichissement du feedback</td>
                                    <td>Exécution du contrat</td>
                                </tr>
                                <tr>
                                    <td>Note finale</td>
                                    <td>Calcul et cohérence du feedback</td>
                                    <td>Exécution du contrat</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>3.3 Données NON collectées</h3>
                    <p>Nous tenons à préciser que Séquoia <strong>ne collecte PAS</strong> :</p>
                    <ul className="negative-list">
                        <li><XIcon /> Les copies ou travaux des élèves (aucun upload de documents)</li>
                        <li><XIcon /> Les noms de famille des élèves (seul le prénom est requis)</li>
                        <li><XIcon /> Les photos ou images</li>
                        <li><XIcon /> Les données de géolocalisation</li>
                        <li><XIcon /> Les données sensibles (origine, religion, santé, etc.)</li>
                    </ul>

                    <h3>3.4 Données techniques</h3>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Donnée</th>
                                    <th>Finalité</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Adresse IP</td>
                                    <td>Sécurité et prévention des abus</td>
                                </tr>
                                <tr>
                                    <td>Type de navigateur</td>
                                    <td>Optimisation de l'affichage</td>
                                </tr>
                                <tr>
                                    <td>Pages visitées</td>
                                    <td>Amélioration du service</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="privacy-section" id="finalites">
                    <h2>4. Finalités du traitement</h2>
                    <p>Vos données sont utilisées exclusivement pour :</p>
                    <ol>
                        <li><strong>Fournir le Service</strong> : Générer des feedbacks pédagogiques basés sur vos évaluations</li>
                        <li><strong>Gérer votre compte</strong> : Authentification, paramètres, préférences</li>
                        <li><strong>Améliorer le Service</strong> : Analyse d'usage anonymisée, correction de bugs</li>
                        <li><strong>Communiquer avec vous</strong> : Support technique, mises à jour importantes</li>
                    </ol>
                </section>

                {/* Section 5 */}
                <section className="privacy-section" id="partage">
                    <h2>5. Partage des données</h2>

                    <h3>5.1 Sous-traitants techniques</h3>
                    <p>Pour fournir notre Service, nous faisons appel aux sous-traitants suivants :</p>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Sous-traitant</th>
                                    <th>Service</th>
                                    <th>Localisation</th>
                                    <th>Conformité</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Google Firebase</strong></td>
                                    <td>Authentification, base de données</td>
                                    <td>Union Européenne (europe-west)</td>
                                    <td>Certifié RGPD</td>
                                </tr>
                                <tr>
                                    <td><strong>Vercel</strong></td>
                                    <td>Hébergement de l'application</td>
                                    <td>Union Européenne</td>
                                    <td>Certifié RGPD</td>
                                </tr>
                                <tr>
                                    <td><strong>Groq</strong></td>
                                    <td>Génération de texte par IA</td>
                                    <td>États-Unis</td>
                                    <td>Clauses contractuelles types (SCC)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>5.2 Aucune revente de données</h3>
                    <div className="highlight-box">
                        <strong>Nous ne vendons JAMAIS vos données personnelles ni celles de vos élèves à des tiers.</strong>
                    </div>

                    <h3>5.3 Divulgation légale</h3>
                    <p>Nous pouvons divulguer vos données si la loi l'exige (demande judiciaire, réquisition).</p>
                </section>

                {/* Section 6 */}
                <section className="privacy-section" id="conservation">
                    <h2>6. Durée de conservation</h2>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Type de données</th>
                                    <th>Durée de conservation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Données de compte</td>
                                    <td>Tant que le compte est actif</td>
                                </tr>
                                <tr>
                                    <td>Sessions d'évaluation</td>
                                    <td>12 mois après création, ou suppression manuelle</td>
                                </tr>
                                <tr>
                                    <td>Notes vocales</td>
                                    <td>Supprimées après génération du feedback</td>
                                </tr>
                                <tr>
                                    <td>Données techniques</td>
                                    <td>12 mois maximum</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>À la clôture du compte :</strong> Toutes vos données sont supprimées dans un délai de 30 jours.
                    </p>
                </section>

                {/* Section 7 */}
                <section className="privacy-section" id="securite">
                    <h2>7. Sécurité des données</h2>
                    <p>Nous mettons en œuvre les mesures suivantes pour protéger vos données :</p>
                    <div className="security-grid">
                        <div className="security-item">
                            <span className="security-icon">🔐</span>
                            <div>
                                <strong>Chiffrement en transit</strong>
                                <p>HTTPS (TLS 1.3) pour toutes les communications</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <span className="security-icon">🔐</span>
                            <div>
                                <strong>Chiffrement au repos</strong>
                                <p>Données chiffrées sur les serveurs Firebase</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <span className="security-icon">🔑</span>
                            <div>
                                <strong>Authentification sécurisée</strong>
                                <p>Gestion des mots de passe via Firebase Auth</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <span className="security-icon">🛡️</span>
                            <div>
                                <strong>Accès restreint</strong>
                                <p>Seul l'utilisateur accède à ses propres données</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 8 */}
                <section className="privacy-section" id="droits">
                    <h2>8. Vos droits (RGPD)</h2>
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Droit</th>
                                    <th>Description</th>
                                    <th>Comment l'exercer</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Accès</strong></td>
                                    <td>Obtenir une copie de vos données</td>
                                    <td>Email à contact@sequoia.app</td>
                                </tr>
                                <tr>
                                    <td><strong>Rectification</strong></td>
                                    <td>Corriger des données inexactes</td>
                                    <td>Dans l'application ou par email</td>
                                </tr>
                                <tr>
                                    <td><strong>Effacement</strong></td>
                                    <td>Supprimer vos données ("droit à l'oubli")</td>
                                    <td>Dans les paramètres ou par email</td>
                                </tr>
                                <tr>
                                    <td><strong>Portabilité</strong></td>
                                    <td>Recevoir vos données dans un format lisible</td>
                                    <td>Email à contact@sequoia.app</td>
                                </tr>
                                <tr>
                                    <td><strong>Opposition</strong></td>
                                    <td>Refuser certains traitements</td>
                                    <td>Email à contact@sequoia.app</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>Délai de réponse :</strong> Nous répondons à toute demande dans un délai maximum de 30 jours.
                    </p>
                    <p>
                        <strong>Réclamation :</strong> Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer
                        une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
                        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                    </p>
                </section>

                {/* Section 9 */}
                <section className="privacy-section" id="ia">
                    <h2>9. Utilisation de l'Intelligence Artificielle</h2>

                    <h3>9.1 Fonctionnement</h3>
                    <p>
                        Séquoia utilise des modèles de langage (IA générative) pour transformer vos évaluations en feedbacks rédigés.
                        Nous utilisons l'API de <strong>Groq</strong> (faisant tourner le modèle Llama 3) pour générer les textes.
                    </p>

                    <h3>9.2 Ce que l'IA reçoit</h3>
                    <ul className="positive-list">
                        <li><CheckIcon /> Les scores de vos curseurs d'évaluation</li>
                        <li><CheckIcon /> Vos notes textuelles ou vocales (transcrites)</li>
                        <li><CheckIcon /> Le prénom de l'élève</li>
                    </ul>

                    <h3>9.3 Ce que l'IA NE reçoit PAS</h3>
                    <ul className="negative-list">
                        <li><XIcon /> Les copies des élèves</li>
                        <li><XIcon /> L'historique des autres sessions</li>
                        <li><XIcon /> Vos données personnelles (email, etc.)</li>
                    </ul>

                    <h3>9.4 Pas d'entraînement sur vos données</h3>
                    <div className="highlight-box important">
                        <strong>Vos données ne sont PAS utilisées pour entraîner nos modèles d'IA.</strong>
                        <p>Les requêtes sont traitées en temps réel puis supprimées. Elles ne servent pas à rendre l'IA "plus intelligente" pour d'autres utilisateurs.</p>
                    </div>
                </section>

                {/* Section 10 */}
                <section className="privacy-section" id="cookies">
                    <h2>10. Cookies</h2>

                    <h3>10.1 Cookies utilisés</h3>
                    <div className="table-wrapper">
                        <table className="privacy-table">
                            <thead>
                                <tr>
                                    <th>Cookie</th>
                                    <th>Type</th>
                                    <th>Finalité</th>
                                    <th>Durée</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Session Firebase</td>
                                    <td>Essentiel</td>
                                    <td>Maintenir votre connexion</td>
                                    <td>Session</td>
                                </tr>
                                <tr>
                                    <td>Préférences</td>
                                    <td>Fonctionnel</td>
                                    <td>Sauvegarder vos paramètres</td>
                                    <td>1 an</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>10.2 Cookies tiers</h3>
                    <p>
                        Nous n'utilisons <strong>pas</strong> de cookies publicitaires ni de tracking tiers
                        (Google Analytics, Facebook Pixel, etc.).
                    </p>
                </section>

                {/* Section 11 */}
                <section className="privacy-section" id="mineurs">
                    <h2>11. Mineurs et données scolaires</h2>

                    <h3>11.1 Utilisateurs du Service</h3>
                    <p>
                        Séquoia est destiné aux <strong>enseignants majeurs</strong>.
                        Nous ne collectons pas directement de données auprès de mineurs.
                    </p>

                    <h3>11.2 Données des élèves</h3>
                    <p>
                        Les prénoms et évaluations des élèves sont saisis par l'enseignant sous sa responsabilité.
                        L'enseignant garantit qu'il dispose des autorisations nécessaires dans le cadre de ses fonctions pédagogiques.
                    </p>

                    <h3>11.3 Recommandation</h3>
                    <div className="recommendation-box">
                        Nous recommandons l'utilisation de <strong>prénoms seuls</strong> (sans nom de famille)
                        ou d'identifiants anonymisés (Élève 1, Élève 2) pour minimiser les données personnelles traitées.
                    </div>
                </section>

                {/* Section 12 */}
                <section className="privacy-section" id="transferts">
                    <h2>12. Transferts internationaux</h2>
                    <p>
                        Nos serveurs principaux sont situés dans l'<strong>Union Européenne</strong> (Firebase region europe-west).
                    </p>
                    <p>
                        Pour les services localisés hors UE (ex: Groq aux États-Unis), nous nous assurons que des garanties
                        appropriées sont en place :
                    </p>
                    <ul>
                        <li>Clauses contractuelles types (SCC) approuvées par la Commission Européenne</li>
                        <li>Certifications de conformité des prestataires</li>
                    </ul>
                </section>

                {/* Section 13 */}
                <section className="privacy-section" id="modifications">
                    <h2>13. Modifications de cette politique</h2>
                    <p>Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification substantielle :</p>
                    <ul>
                        <li>Notification par email aux utilisateurs enregistrés</li>
                        <li>Affichage d'un bandeau dans l'application</li>
                        <li>Mise à jour de la date "Dernière mise à jour"</li>
                    </ul>
                    <p>Nous vous encourageons à consulter régulièrement cette page.</p>
                </section>

                {/* Section 14 */}
                <section className="privacy-section" id="contact">
                    <h2>14. Contact</h2>
                    <p>Pour toute question concernant cette politique ou vos données personnelles :</p>
                    <div className="info-box">
                        <p>📧 Email : <a href="mailto:contact@sequoia.app">contact@sequoia.app</a></p>
                        <p>⏱️ Délai de réponse : 30 jours maximum</p>
                    </div>
                </section>

                {/* Final Summary */}
                <section className="privacy-section summary-section" id="resume">
                    <h2>15. Résumé simplifié</h2>
                    <div className="summary-table">
                        <div className="summary-row">
                            <span className="summary-question">Quelles données ?</span>
                            <span className="summary-answer">Email, prénom élèves, évaluations, notes vocales</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-question">Les copies sont uploadées ?</span>
                            <span className="summary-answer negative">❌ Non, jamais</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-question">Données revendues ?</span>
                            <span className="summary-answer negative">❌ Non, jamais</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-question">Où sont stockées les données ?</span>
                            <span className="summary-answer">Serveurs en Europe (Firebase)</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-question">Puis-je supprimer mes données ?</span>
                            <span className="summary-answer positive">✅ Oui, à tout moment</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-question">L'IA s'entraîne sur mes données ?</span>
                            <span className="summary-answer negative">❌ Non</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="privacy-footer">
                <p>Cette politique de confidentialité est effective à compter du {lastUpdated}.</p>
                <button className="btn btn-secondary" onClick={onBack}>
                    <ArrowLeftIcon />
                    Retour à l'accueil
                </button>
            </footer>
        </div>
    )
}

export default PrivacyPolicy
