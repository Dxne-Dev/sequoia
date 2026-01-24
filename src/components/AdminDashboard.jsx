import { useState, useEffect } from 'react'
import { adminService } from '../utils/adminService'
import { LogOut, Users, CreditCard, Activity, Search, RefreshCw, ArrowLeft } from 'lucide-react'
import './AdminDashboard.css'

const AdminDashboard = ({ onLogout, onBack }) => {
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState({ totalUsers: 0, activeSubs: 0, mrr: 0, totalCopies: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview') // overview, users, subscriptions
    const [searchTerm, setSearchTerm] = useState('')

    const loadData = async () => {
        setIsLoading(true)
        try {
            const usersData = await adminService.getAllUsers()
            setUsers(usersData)
            setStats(adminService.getDashboardStats(usersData))
        } catch (error) {
            console.error("Failed to load admin data", error)
            alert("Erreur de chargement des données. Vérifiez vos permissions.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color + '20', color: color }}>
                <Icon size={24} />
            </div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
                <span className="stat-subtext">{subtext}</span>
            </div>
        </div>
    )

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Sequoia<span className="admin-badge">Admin</span></h2>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Activity size={20} /> Vue d'ensemble
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={20} /> Utilisateurs
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        <CreditCard size={20} /> Abonnements
                    </button>
                </nav>

                <div className="admin-footer">
                    <button className="nav-item back" onClick={onBack}>
                        <ArrowLeft size={20} /> Retour App
                    </button>
                    <button className="nav-item logout" onClick={onLogout}>
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <header className="admin-header">
                    <h1>
                        {activeTab === 'overview' && 'Tableau de Bord'}
                        {activeTab === 'users' && 'Gestion Utilisateurs'}
                        {activeTab === 'subscriptions' && 'Abonnements & Revenus'}
                    </h1>
                    <div className="header-actions">
                        <button className="icon-btn" onClick={loadData} disabled={isLoading}>
                            <RefreshCw size={20} className={isLoading ? 'spin' : ''} />
                        </button>
                        <div className="user-profile-preview">
                            <div className="avatar">A</div>
                            <span>Admin</span>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="admin-loading">Chargement des données...</div>
                ) : (
                    <div className="content-scroll">

                        {/* Overview Section */}
                        {activeTab === 'overview' && (
                            <>
                                <div className="stats-grid">
                                    <StatCard
                                        icon={Users}
                                        title="Utilisateurs Total"
                                        value={stats.totalUsers}
                                        subtext="+12% ce mois"
                                        color="#3B82F6"
                                    />
                                    <StatCard
                                        icon={CreditCard}
                                        title="Abonnements Actifs"
                                        value={stats.activeSubs}
                                        subtext="Taux de conversion 5%"
                                        color="#10B981"
                                    />
                                    <StatCard
                                        icon={Activity}
                                        title="MRR (Revenu Mensuel)"
                                        value={`${stats.mrr} €`}
                                        subtext="Basé sur plan Pro"
                                        color="#8B5CF6"
                                    />
                                    <StatCard
                                        icon={Activity}
                                        title="Copies Corrigées"
                                        value={stats.totalCopies}
                                        subtext="Usage global"
                                        color="#F59E0B"
                                    />
                                </div>

                                <div className="recent-activity-section">
                                    <h3>Activités Récentes</h3>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Utilisateur</th>
                                                <th>Action</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.slice(0, 5).map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.firstName} {user.lastName}</td>
                                                    <td>Inscription</td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Users / Subscription Table (reused somewhat) */}
                        {(activeTab === 'users' || activeTab === 'subscriptions') && (
                            <div className="table-container">
                                <div className="table-controls">
                                    <div className="search-bar">
                                        <Search size={18} />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un utilisateur..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Utilisateur</th>
                                            <th>Email</th>
                                            <th>Date d'inscription</th>
                                            {activeTab === 'subscriptions' && <th>Plan</th>}
                                            {activeTab === 'subscriptions' && <th>Statut</th>}
                                            {activeTab === 'users' && <th>Sessions</th>}
                                            {activeTab === 'users' && <th>Copies</th>}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">{user.firstName?.charAt(0)}</div>
                                                        <div>
                                                            <div className="user-name">{user.firstName} {user.lastName}</div>
                                                            {activeTab === 'subscriptions' && <div className="user-sub-id">ID: {user.id.slice(0, 8)}...</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                                                {activeTab === 'subscriptions' && (
                                                    <>
                                                        <td><span className="badge plan">{user.subscription.plan}</span></td>
                                                        <td>
                                                            <span className={`badge status ${user.subscription.status}`}>
                                                                {user.subscription.status}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}

                                                {activeTab === 'users' && (
                                                    <>
                                                        <td>{user.stats?.sessionsCount || 0}</td>
                                                        <td>{user.stats?.copiesCount || 0}</td>
                                                    </>
                                                )}

                                                <td>
                                                    <button className="action-btn">Détails</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                )}
            </main>
        </div>
    )
}

export default AdminDashboard
