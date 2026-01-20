import { useState } from 'react'
import { TreePine, Mail, Lock, User, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react'
import { authService } from '../utils/authService'
import './AuthScreen.css'

export default function AuthScreen({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        subject: ''
    })

    // Subjects list
    const subjects = [
        'Français', 'Philosophie', 'Histoire-Géo', 'Anglais',
        'Espagnol', 'SES', 'Mathématiques', 'SVT', 'Physique-Chimie'
    ]

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            let user
            if (isLogin) {
                user = await authService.login(formData.email, formData.password)
            } else {
                // Validation basic
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas.')
                }
                if (formData.password.length < 6) {
                    throw new Error('Le mot de passe doit faire au moins 6 caractères.')
                }

                user = await authService.register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password, // In real app, never send plain password
                    subject: formData.subject
                })
            }
            onLogin(user)
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
                    <h1>{isLogin ? 'Bon retour !' : 'Rejoindre Séquoia'}</h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Prêt à corriger plus efficacement ?'
                            : 'Créez votre compte pour transformer votre correction.'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="auth-error animate-shake">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">

                    {!isLogin && (
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

                    {!isLogin && (
                        <div className="input-field">
                            <BookOpen size={18} className="input-icon" />
                            <select
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className={!formData.subject ? 'placeholder-color' : ''}
                            >
                                <option value="" disabled>Matière enseignée</option>
                                {subjects.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
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

                    {!isLogin && (
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
                                <span>{isLogin ? 'Se connecter' : 'Créer mon compte'}</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Toggle */}
                <div className="auth-footer">
                    <p>
                        {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
                        <button
                            className="btn-link"
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError(null)
                                setFormData({ ...formData, password: '', confirmPassword: '' })
                            }}
                        >
                            {isLogin ? "S'inscrire" : 'Se connecter'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
