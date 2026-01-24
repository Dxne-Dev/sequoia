import { useState, useRef, useEffect } from 'react'
import { TreePine, Mail, Lock, User, ArrowRight, BookOpen, Loader2, AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { authService } from '../utils/authService'
import './AuthScreen.css'

export default function AuthScreen({ onLogin }) {
    const [view, setView] = useState('login') // 'login', 'register', 'verify'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        subject: ''
    })

    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

    const subjects = [
        'Français', 'Philosophie', 'Histoire-Géo', 'Anglais',
        'Espagnol', 'SES', 'Mathématiques', 'SVT', 'Physique-Chimie',
        'Saisissez votre matière'
    ]

    const [customSubject, setCustomSubject] = useState('')
    const [showCustomSubject, setShowCustomSubject] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'subject') {
            if (value === 'Saisissez votre matière') {
                setShowCustomSubject(true)
                setFormData({ ...formData, subject: '' }) // Reset to empty to force user to type
            } else {
                setShowCustomSubject(false)
                setFormData({ ...formData, subject: value })
            }
        } else {
            setFormData({ ...formData, [name]: value })
        }
        setError(null)
        setSuccessMessage(null)
    }

    const handleCustomSubjectChange = (e) => {
        const val = e.target.value
        setCustomSubject(val)
        setFormData({ ...formData, subject: val })
    }

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        // Auto focus next
        if (value && index < 5) {
            otpRefs[index + 1].current.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (view === 'login') {
                const user = await authService.login(formData.email, formData.password)
                onLogin(user)
            } else if (view === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas.')
                }
                if (formData.password.length < 6) {
                    throw new Error('Le mot de passe doit faire au moins 6 caractères.')
                }

                await authService.initiateRegister(formData)
                setView('verify')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        const code = otp.join('')
        if (code.length < 6) return

        setIsLoading(true)
        setError(null)

        try {
            await authService.verifyAndRegister(formData.email, code)
            await authService.logout()

            setSuccessMessage('Compte vérifié avec succès ! Vous pouvez maintenant vous connecter.')
            setView('login')
            setFormData({ ...formData, password: '', confirmPassword: '' })
        } catch (err) {
            setError(err.message)
            // Reset OTP on error
            setOtp(['', '', '', '', '', ''])
            otpRefs[0].current.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const resendCode = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await authService.initiateRegister(formData)
            setSuccessMessage('Un nouveau code a été envoyé !')
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-screen">
            <div className="auth-container animate-fade-in-up">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <TreePine size={40} strokeWidth={1.5} />
                    </div>
                    <h1>
                        {view === 'login' && 'Bon retour !'}
                        {view === 'register' && 'Rejoindre Séquoia'}
                        {view === 'verify' && 'Vérification'}
                    </h1>
                    <p className="auth-subtitle">
                        {view === 'login' && 'Prêt à corriger plus efficacement ?'}
                        {view === 'register' && 'Créez votre compte pour transformer votre correction.'}
                        {view === 'verify' && `Entrez le code envoyé à ${formData.email}`}
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="auth-error animate-shake">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="auth-status success animate-fade-in">
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Forms */}
                {view !== 'verify' ? (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {view === 'register' && (
                            <div className="form-row">
                                <div className="input-field">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Prénom"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-field">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Nom"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '1rem' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-field">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email professionnel"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {view === 'register' && (
                            <>
                                <div className="input-field">
                                    <BookOpen size={18} className="input-icon" />
                                    <select
                                        name="subject"
                                        required
                                        value={showCustomSubject ? 'Saisissez votre matière' : formData.subject}
                                        onChange={handleChange}
                                        className={!formData.subject && !showCustomSubject ? 'placeholder-color' : ''}
                                    >
                                        <option value="" disabled>Matière enseignée</option>
                                        {subjects.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {showCustomSubject && (
                                    <div className="input-field animate-fade-in">
                                        <Plus size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Nom de votre matière"
                                            required
                                            value={customSubject}
                                            onChange={handleCustomSubjectChange}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div className="input-field">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {view === 'register' && (
                            <div className="input-field">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 size={20} className="spinning" />
                            ) : (
                                <>
                                    <span>{view === 'login' ? 'Se connecter' : 'Suivant'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="auth-form otp-form">
                        <div className="otp-container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={otpRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="otp-input"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn btn-primary btn-block auth-submit" disabled={isLoading || otp.join('').length < 6}>
                            {isLoading ? (
                                <Loader2 size={20} className="spinning" />
                            ) : (
                                <>
                                    <span>Vérifier le code</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <div className="resend-container">
                            <p>Vous n'avez rien reçu ?</p>
                            <button type="button" onClick={resendCode} className="btn-link" disabled={isLoading}>
                                Renvoyer un code
                            </button>
                        </div>
                    </form>
                )}

                {/* Footer Toggle */}
                {view !== 'verify' && (
                    <div className="auth-footer">
                        <p>
                            {view === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                            <button
                                className="btn-link"
                                onClick={() => {
                                    setView(view === 'login' ? 'register' : 'login')
                                    setError(null)
                                    setSuccessMessage(null)
                                    setShowCustomSubject(false)
                                    setCustomSubject('')
                                }}
                            >
                                {view === 'login' ? "S'inscrire" : 'Se connecter'}
                            </button>
                        </p>
                    </div>
                )}

                {view === 'verify' && (
                    <div className="auth-footer">
                        <button className="btn-link" onClick={() => setView('register')}>
                            Retour à l'inscription
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
