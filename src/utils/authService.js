/**
 * Séquoia - Authentication Service (Firebase Real Implementation)
 */
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export const authService = {
    /**
     * Register a new user
     */
    register: async ({ email, password, firstName, lastName, subject }) => {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // 2. Create User Profile in Firestore
            const userProfile = {
                id: user.uid,
                firstName,
                lastName,
                email,
                subject,
                createdAt: new Date().toISOString(),
                stats: {
                    sessionsCount: 0,
                    copiesCount: 0,
                    timeSavedMinutes: 0
                }
            }

            await setDoc(doc(db, 'users', user.uid), userProfile)
            return userProfile

        } catch (error) {
            console.error('Registration Error:', error)
            if (error.code === 'auth/email-already-in-use') throw new Error('Cet email est déjà utilisé.')
            if (error.code === 'auth/weak-password') throw new Error('Le mot de passe est trop faible.')
            throw new Error('Erreur lors de l\'inscription: ' + error.message)
        }
    },

    /**
     * Login user and fetch profile
     */
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Fetch extended profile from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (userDoc.exists()) {
                return userDoc.data()
            } else {
                // Fallback if profile missing (should not happen)
                return {
                    id: user.uid,
                    email: user.email,
                    firstName: 'Enseignant',
                    lastName: '',
                    stats: { sessionsCount: 0, copiesCount: 0, timeSavedMinutes: 0 }
                }
            }

        } catch (error) {
            console.error('Login Error:', error)
            if (error.code === 'auth/invalid-credential') throw new Error('Email ou mot de passe incorrect.')
            if (error.code === 'auth/user-not-found') throw new Error('Aucun compte trouvé avec cet email.')
            if (error.code === 'auth/wrong-password') throw new Error('Mot de passe incorrect.')
            throw new Error('Erreur de connexion.')
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        await signOut(auth)
    },

    /**
     * Get current user profile depending on Auth State
     * Use this for initial load
     */
    getCurrentUser: () => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid))
                    resolve(userDoc.exists() ? userDoc.data() : null)
                } else {
                    resolve(null)
                }
                unsubscribe()
            })
        })
    },

    /**
     * Update user stats in Firestore
     */
    updateStats: async (userId, count) => {
        try {
            const userRef = doc(db, 'users', userId)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
                const currentStats = userSnap.data().stats || { sessionsCount: 0, copiesCount: 0, timeSavedMinutes: 0 }

                const newStats = {
                    sessionsCount: currentStats.sessionsCount + 1,
                    copiesCount: currentStats.copiesCount + count,
                    timeSavedMinutes: currentStats.timeSavedMinutes + (count * 5)
                }

                await updateDoc(userRef, { stats: newStats })
                return { ...userSnap.data(), stats: newStats }
            }
        } catch (error) {
            console.error('Error updating stats:', error)
        }
        return null
    }
}
