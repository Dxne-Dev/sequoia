import { useState, useEffect } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import SessionSetup from './components/SessionSetup'
import GradingInterface from './components/GradingInterface'
import ResultsScreen from './components/ResultsScreen'
import AuthScreen from './components/AuthScreen'
import AdminDashboard from './components/AdminDashboard'
import { authService } from './utils/authService'
import { sessionService } from './utils/sessionService'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentScreen, setCurrentScreen] = useState('auth') // auth, welcome, setup, grading, results
  const [currentSession, setCurrentSession] = useState(null)
  const [students, setStudents] = useState([])
  const [userSessions, setUserSessions] = useState([]) // Sessions saved in DB
  const [isLoading, setIsLoading] = useState(true)

  // Check auth and load sessions on load
  useEffect(() => {
    const initApp = async () => {
      // Safety timeout: if Firestore hangs (e.g. database not created), stop loading after 5s
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout Firebase')), 5000)
      )

      try {
        // Race between Auth/DB load and Timeout
        await Promise.race([
          (async () => {
            // Seed admin if needed
            await authService.ensureAdminExists()

            const savedUser = await authService.getCurrentUser()
            if (savedUser) {
              setUser(savedUser)
              if (savedUser.isAdmin) {
                setCurrentScreen('admin')
              } else {
                await loadUserSessions(savedUser.id)
                setCurrentScreen('welcome')
              }
            }
          })(),
          timeoutPromise
        ])
      } catch (error) {
        console.error("Auth init failed or Timed out:", error)
        // If it fails, strictly go to Auth screen, don't block
        setCurrentScreen('auth')
      } finally {
        setIsLoading(false)
      }
    }
    initApp()
  }, [])

  const loadUserSessions = async (userId) => {
    const sessions = await sessionService.getUserSessions(userId)
    setUserSessions(sessions)
  }

  const handleLogin = async (userData) => {
    setUser(userData)
    if (userData.isAdmin) {
      setCurrentScreen('admin')
    } else {
      await loadUserSessions(userData.id)
      setCurrentScreen('welcome')
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    setCurrentScreen('auth')
    setCurrentSession(null)
    setStudents([])
    setUserSessions([])
  }

  const startNewSession = () => {
    setCurrentScreen('setup')
  }

  // Create a new fresh session
  const handleSessionCreate = async (sessionConfig) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      // Create in Firestore
      const newSession = await sessionService.createSession(user.id, sessionConfig)

      // Initialize students
      const initialStudents = Array.from({ length: sessionConfig.studentCount }, (_, i) => ({
        id: i + 1,
        name: `Élève ${i + 1}`,
        scores: {},
        voiceNote: '',
        feedback: '',
        finalGrade: 0,
        isCompleted: false
      }))

      // Save initial students to Firestore
      // Note: we update the same session doc
      await sessionService.updateSession(newSession.id, { students: initialStudents })

      // Update session count stat (only once at creation)
      await authService.incrementSessionCount(user.id)

      // Set State
      setCurrentSession(newSession)
      setStudents(initialStudents)
      setCurrentScreen('grading')
    } catch (error) {
      console.error("Failed to create session", error)
      alert("Erreur lors de la création de la session. Vérifiez votre connexion.")
    } finally {
      setIsLoading(false)
    }
  }

  // Resume an existing session
  const handleResumeSession = async (sessionId) => {
    setIsLoading(true)
    try {
      const session = await sessionService.getSession(sessionId)
      if (session) {
        setCurrentSession(session)
        setStudents(session.students || [])

        // Logic: specific redirection based on status
        if (session.status === 'completed') {
          setCurrentScreen('results')
        } else {
          setCurrentScreen('grading')
        }
      }
    } catch (error) {
      console.error("Failed to resume session", error)
      alert("Impossible de charger la session.")
    } finally {
      setIsLoading(false)
    }
  }

  // Archive a session (Mark as completed)
  const handleArchiveSession = async (sessionId) => {
    try {
      await sessionService.updateSession(sessionId, { status: 'completed' })
      await loadUserSessions(user.id) // Refresh lists
      return true
    } catch (error) {
      console.error("Archive failed", error)
      return false
    }
  }

  // Delete a session
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Voulez-vous vraiment supprimer définitivement cette session ?')) {
      try {
        await sessionService.deleteSession(sessionId)
        await loadUserSessions(user.id) // Refresh list
      } catch (error) {
        console.error("Delete failed", error)
        alert("Erreur lors de la suppression.")
      }
    }
  }

  // Auto-save on every student update
  const handleStudentUpdate = (id, updates) => {
    // Optimistic update in UI immediately
    const updatedStudents = students.map(s =>
      s.id === id ? { ...s, ...updates } : s
    )
    setStudents(updatedStudents)

    // Background Save to DB (Fire and forget, no await to not block UI)
    if (currentSession) {
      sessionService.updateSession(currentSession.id, {
        students: updatedStudents
      }).catch(err => console.error("Auto-save failed", err))
    }
  }

  const finishGrading = async () => {
    setIsLoading(true)
    try {
      // Update user stats (but keep session active for now)
      const completedCount = students.filter(s => s.isCompleted).length

      // Just save the progress, don't mark as 'completed' status yet
      if (currentSession) {
        await sessionService.updateSession(currentSession.id, {
          completedCount
        })
      }

      if (completedCount > 0 && currentSession) {
        const updatedUser = await authService.updateStats(user.id, completedCount, currentSession.id)
        if (updatedUser) setUser(updatedUser)
      }

      // Reload sessions to update progress
      await loadUserSessions(user.id)
      setCurrentScreen('results')
    } catch (error) {
      console.error("Finish grading error", error)
      alert("Erreur lors de la sauvegarde finale.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading screen mostly during initial auth check
  if (isLoading && !user && currentScreen === 'auth') {
    // We can render a simple loader here if needed, or return null
    return <div className="loading-screen">Chargement...</div>
  }

  // General loading overlay for transitions
  const LoadingOverlay = () => (
    <div className="loading-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999, color: 'white'
    }}>
      <div className="spinner"></div>
    </div>
  )

  return (
    <div className="app-container">
      {/* Background Ambience */}
      <div className="ambient-light"></div>

      {isLoading && user && <LoadingOverlay />}

      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <>
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              user={user}
              userSessions={userSessions}
              onStart={startNewSession}
              onResume={handleResumeSession}
              onDelete={handleDeleteSession}
              onOpenAdmin={() => setCurrentScreen('admin')}
            />
          )}

          {currentScreen === 'setup' && (
            <SessionSetup
              onSessionCreate={handleSessionCreate}
              onBack={() => setCurrentScreen('welcome')}
            />
          )}

          {currentScreen === 'grading' && currentSession && (
            <GradingInterface
              session={currentSession}
              students={students}
              onStudentUpdate={handleStudentUpdate}
              onFinish={finishGrading}
              onBack={async () => {
                // Refresh sessions before going back
                setIsLoading(true)
                await loadUserSessions(user.id)
                setIsLoading(false)
                setCurrentScreen('welcome')
              }}
            />
          )}

          {currentScreen === 'results' && currentSession && (
            <ResultsScreen
              session={currentSession}
              students={students}
              onNewSession={async () => {
                setCurrentScreen('setup')
                await loadUserSessions(user.id)
              }}
              onArchiveSession={handleArchiveSession}
              onBackToGrading={() => setCurrentScreen('grading')}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'admin' && (
            <AdminDashboard
              onBack={() => setCurrentScreen('welcome')}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
