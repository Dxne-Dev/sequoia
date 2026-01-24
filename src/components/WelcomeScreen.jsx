import { useState, useEffect, useMemo } from 'react'
import { TreePine, ArrowRight, Clock, FileText, User, CheckCircle2, ChevronRight, Archive, Calendar, Trash2, FolderPen, FolderCheck } from 'lucide-react'
import './WelcomeScreen.css'

export default function WelcomeScreen({ user, userSessions, onStart, onResume, onDelete, onOpenAdmin }) {
    const [showToast, setShowToast] = useState(false)
    const [activeTab, setActiveTab] = useState('active') // 'active' or 'archived'

    // Separate active and archived sessions
    const { activeSessions, archivedSessions } = useMemo(() => {
        if (!userSessions) return { activeSessions: [], archivedSessions: [] }

        const active = []
        const archived = []

        userSessions.forEach(session => {
            if (session.status === 'completed') {
                archived.push(session)
            } else {
                active.push(session)
            }
        })

        return { activeSessions: active, archivedSessions: archived }
    }, [userSessions])

    // Show login confirmation toast on mount
    useEffect(() => {
        setShowToast(true)
        const timer = setTimeout(() => setShowToast(false), 4000)
        return () => clearTimeout(timer)
    }, [])

    // Personalized message based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bonjour'
        if (hour < 18) return 'Bon après-midi'
        return 'Bonsoir'
    }

    // Format date relative (Aujourd'hui, Hier, ou date)
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Aujourd\'hui'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hier'
        } else {
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        }
    }

    const currentList = activeTab === 'active' ? activeSessions : archivedSessions

    return (
        <div className="welcome-screen">
            {/* Login Success Toast */}
            <div className={`login-toast ${showToast ? 'show' : ''}`}>
                <div className="toast-avatar">
                    <User size={20} />
                </div>
                <div className="toast-content">
                    <span className="toast-title">Connexion réussie</span>
                    <span className="toast-user">{user.firstName} {user.lastName}</span>
                </div>
                <CheckCircle2 size={20} className="toast-icon-success" />
            </div>

            <div className="welcome-content">
                {/* Main Header Section */}
                <div className="welcome-header-section animate-fade-in-up">
                    <h1 className="welcome-greeting">
                        {getGreeting()} <span className="highlight">{user.firstName}</span>,
                    </h1>
                    <h2 className="welcome-subtitle">Prêt à libérer votre soirée ?</h2>

                    <button
                        className="btn btn-primary btn-lg welcome-cta"
                        onClick={onStart}
                    >
                        <span>Commencer un nouveau paquet</span>
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="welcome-stats animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat">
                        <div className="stat-icon-wrapper">
                            <Clock size={16} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{Math.round(user.stats?.timeSavedMinutes / 60) || 0}h</span>
                            <span className="stat-label">Temps économisé</span>
                        </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                        <div className="stat-icon-wrapper">
                            <FileText size={16} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{user.stats?.copiesCount || 0}</span>
                            <span className="stat-label">Copies corrigées</span>
                        </div>
                    </div>
                </div>

                {/* Sessions Section with Tabs */}
                {(activeSessions.length > 0 || archivedSessions.length > 0) && (
                    <div className="sessions-section animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

                        {/* Custom Tabs */}
                        <div className="sessions-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => setActiveTab('active')}
                            >
                                <FolderPen size={16} />
                                <span>En cours ({activeSessions.length})</span>
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
                                onClick={() => setActiveTab('archived')}
                            >
                                <FolderCheck size={16} />
                                <span>Terminées ({archivedSessions.length})</span>
                            </button>
                        </div>

                        <div className="sessions-grid">
                            {currentList.length === 0 ? (
                                <div className="empty-tab-message">
                                    {activeTab === 'active'
                                        ? "Aucune session en cours."
                                        : "Aucune session archivée."}
                                </div>
                            ) : (
                                currentList.map(session => {
                                    const total = session.studentCount || session.totalStudents || 0
                                    const done = session.completedCount || 0
                                    const progress = total > 0 ? Math.round((done / total) * 100) : 0
                                    const isArchived = session.status === 'completed'

                                    return (
                                        <div
                                            key={session.id}
                                            className={`session-card ${isArchived ? 'archived-card' : ''}`}
                                            onClick={() => onResume(session.id)}
                                        >
                                            <div className="session-info-row">
                                                <div className={`session-icon ${isArchived ? 'icon-archived' : ''}`}>
                                                    {isArchived ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div className="session-details">
                                                    <span className="session-name">{session.name}</span>
                                                    <span className="session-date">
                                                        {isArchived ? 'Terminée ' : 'Modifiée '}
                                                        {formatDate(session.updatedAt)}
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn-delete-session"
                                                    onClick={(e) => { e.stopPropagation(); onDelete(session.id) }}
                                                    title="Supprimer la session"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="session-progress-row">
                                                <div className="progress-labels">
                                                    <span>{done} / {total} copies</span>
                                                    <span>{isArchived ? 'Terminé' : `${progress}%`}</span>
                                                </div>
                                                <div className={`mini-progress-bar ${isArchived ? 'bar-archived' : ''}`}>
                                                    <div
                                                        className="mini-progress-fill"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="welcome-footer">
                <p>Séquoia v1.0 • Conçu pour les enseignants</p>
                {user.isAdmin && (
                    <button onClick={onOpenAdmin} className="admin-link-btn">
                        Admin Dashboard
                    </button>
                )}
            </footer>
        </div>
    )
}
