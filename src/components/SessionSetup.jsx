import { useState, useCallback } from 'react'
import {
    Settings, FileText, Calculator, Mic2, Sparkles,
    ArrowRight, ArrowLeft, Plus, X, Check, Rocket,
    ChevronDown, ChevronUp
} from 'lucide-react'
import './SessionSetup.css'

// Preset criteria templates
const CRITERIA_PRESETS = {
    dissertation: [
        { id: 'intro', name: 'Introduction', weight: 3, maxScore: 20 },
        { id: 'fond', name: 'Fond / Argumentation', weight: 5, maxScore: 20 },
        { id: 'forme', name: 'Forme / Rédaction', weight: 3, maxScore: 20 },
        { id: 'conclusion', name: 'Conclusion', weight: 2, maxScore: 20 },
        { id: 'orthographe', name: 'Orthographe', weight: 2, maxScore: 20 }
    ],
    exercice: [
        { id: 'comprehension', name: 'Compréhension', weight: 4, maxScore: 20 },
        { id: 'methode', name: 'Méthode', weight: 4, maxScore: 20 },
        { id: 'resultat', name: 'Résultat', weight: 4, maxScore: 20 },
        { id: 'presentation', name: 'Présentation', weight: 3, maxScore: 20 }
    ],
    oral: [
        { id: 'contenu', name: 'Contenu', weight: 5, maxScore: 20 },
        { id: 'expression', name: 'Expression orale', weight: 4, maxScore: 20 },
        { id: 'posture', name: 'Posture / Aisance', weight: 3, maxScore: 20 },
        { id: 'temps', name: 'Gestion du temps', weight: 2, maxScore: 20 }
    ],
    custom: []
}

const PRESET_LABELS = {
    dissertation: { icon: FileText, label: 'Dissertation / Rédaction' },
    exercice: { icon: Calculator, label: 'Exercice / Devoir' },
    oral: { icon: Mic2, label: 'Oral / Présentation' },
    custom: { icon: Sparkles, label: 'Personnalisé' }
}

export default function SessionSetup({ onSessionCreate, onBack }) {
    const [step, setStep] = useState(1)
    const [sessionName, setSessionName] = useState('')
    const [selectedPreset, setSelectedPreset] = useState(null)
    const [criteria, setCriteria] = useState([])
    const [maxGrade, setMaxGrade] = useState(20)
    const [studentCount, setStudentCount] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Add a new criterion
    const addCriterion = useCallback(() => {
        const newCriterion = {
            id: `custom-${Date.now()}`,
            name: '',
            weight: 3,
            maxScore: maxGrade
        }
        setCriteria(prev => [...prev, newCriterion])
    }, [maxGrade])

    // Update a criterion
    const updateCriterion = useCallback((id, field, value) => {
        setCriteria(prev => prev.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ))
    }, [])

    // Remove a criterion
    const removeCriterion = useCallback((id) => {
        setCriteria(prev => prev.filter(c => c.id !== id))
    }, [])

    // Select a preset
    const handlePresetSelect = useCallback((preset) => {
        setSelectedPreset(preset)
        if (preset === 'custom') {
            setCriteria([])
        } else {
            setCriteria(CRITERIA_PRESETS[preset].map(c => ({ ...c, maxScore: maxGrade })))
        }
    }, [maxGrade])

    // Validate and create session
    const handleCreateSession = () => {
        if (isSubmitting || criteria.length < 1 || criteria.some(c => !c.name.trim())) {
            return
        }

        setIsSubmitting(true)
        onSessionCreate({
            name: sessionName.trim() || `Session du ${new Date().toLocaleDateString('fr-FR')}`,
            criteria: criteria,
            maxGrade: maxGrade,
            studentCount: studentCount,
            createdAt: new Date().toISOString()
        })
    }

    // Calculate total weight
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0)

    return (
        <div className="session-setup">
            {/* Header */}
            <div className="setup-header">
                <button className="btn btn-ghost" onClick={onBack}>
                    <ArrowLeft size={18} />
                    <span>Retour</span>
                </button>
                <div className="setup-steps">
                    <div className={`setup-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Configuration</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`setup-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Critères</span>
                    </div>
                </div>
                <div style={{ width: '100px' }}></div>
            </div>

            {/* Step 1: Basic Configuration */}
            {step === 1 && (
                <div className="setup-content animate-fade-in-up">
                    <div className="setup-section">
                        <div className="section-icon">
                            <Settings size={28} />
                        </div>
                        <h2>Configuration de la session</h2>
                        <p>Définissez les paramètres de base pour votre session de correction</p>
                    </div>

                    <div className="setup-form">
                        <div className="input-group" data-tour="setup_config">
                            <label className="input-label">Nom de la session (optionnel)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Ex: Dissertation Philosophie TS3"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">Barème</label>
                                <div className="grade-selector">
                                    {[10, 20, 100].map(grade => (
                                        <button
                                            key={grade}
                                            className={`grade-option ${maxGrade === grade ? 'selected' : ''}`}
                                            onClick={() => setMaxGrade(grade)}
                                        >
                                            / {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Nombre de copies</label>
                                <div className="student-count-selector">
                                    <button
                                        className="count-btn"
                                        onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                    <span className="count-value">{studentCount}</span>
                                    <button
                                        className="count-btn"
                                        onClick={() => setStudentCount(Math.min(50, studentCount + 1))}
                                    >
                                        <ChevronUp size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="input-group" data-tour="setup_presets">
                            <label className="input-label">Type d'évaluation</label>
                            <div className="preset-grid">
                                {Object.entries(PRESET_LABELS).map(([key, { icon: Icon, label }]) => (
                                    <button
                                        key={key}
                                        className={`preset-card ${selectedPreset === key ? 'selected' : ''}`}
                                        onClick={() => handlePresetSelect(key)}
                                    >
                                        <div className="preset-icon-wrapper">
                                            <Icon size={28} />
                                        </div>
                                        <span className="preset-label">{label}</span>
                                        {selectedPreset === key && (
                                            <span className="preset-check">
                                                <Check size={14} />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="setup-actions">
                        <button
                            className="btn btn-primary btn-lg"
                            disabled={!selectedPreset}
                            onClick={() => setStep(2)}
                        >
                            <span>Suivant</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Criteria Configuration */}
            {step === 2 && (
                <div className="setup-content animate-fade-in-up">
                    <div className="setup-section">
                        <div className="section-icon">
                            <FileText size={28} />
                        </div>
                        <h2>Critères d'évaluation</h2>
                        <p>Personnalisez les critères et leurs poids pour votre évaluation</p>
                    </div>

                    <div className="criteria-list">
                        {criteria.map((criterion, index) => (
                            <div key={criterion.id} className="criterion-card animate-fade-in-scale" style={{ animationDelay: `${index * 0.05}s` }}>
                                <div className="criterion-header">
                                    <span className="criterion-number">{index + 1}</span>
                                    <input
                                        type="text"
                                        className="input criterion-name-input"
                                        placeholder="Nom du critère"
                                        value={criterion.name}
                                        onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                                    />
                                    <button
                                        className="btn btn-ghost btn-icon criterion-remove"
                                        onClick={() => removeCriterion(criterion.id)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="criterion-weight">
                                    <label className="weight-label">Poids :</label>
                                    <input
                                        type="range"
                                        className="slider weight-slider"
                                        min="1"
                                        max="10"
                                        value={criterion.weight}
                                        onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value))}
                                    />
                                    <span className="weight-value">{criterion.weight}</span>
                                    <span className="weight-percent">
                                        ({totalWeight > 0 ? Math.round((criterion.weight / totalWeight) * 100) : 0}%)
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button className="add-criterion-btn" onClick={addCriterion}>
                            <span className="add-icon">
                                <Plus size={20} />
                            </span>
                            <span>Ajouter un critère</span>
                        </button>
                    </div>

                    <div className="setup-summary">
                        <div className="summary-item">
                            <span className="summary-label">Critères</span>
                            <span className="summary-value">{criteria.length}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Copies</span>
                            <span className="summary-value">{studentCount}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Barème</span>
                            <span className="summary-value">/ {maxGrade}</span>
                        </div>
                    </div>

                    <div className="setup-actions">
                        <button className="btn btn-secondary" onClick={() => setStep(1)}>
                            <ArrowLeft size={18} />
                            <span>Retour</span>
                        </button>
                        <button
                            className="btn btn-primary btn-lg"
                            disabled={isSubmitting || criteria.length < 1 || criteria.some(c => !c.name.trim())}
                            onClick={handleCreateSession}
                        >
                            <Rocket size={18} className={isSubmitting ? 'animate-pulse' : ''} />
                            <span>{isSubmitting ? 'Création...' : 'Démarrer la correction'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
