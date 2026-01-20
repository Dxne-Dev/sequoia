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
import { emailService } from './emailService'

export const authService = {
    /**
     * Register a new user
     */
    /**
     * Step 1: Initialize Registration & Send OTP
     */
    initiateRegister: async (userData) => {
        try {
            // 1. Generate 6-digit code
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

            // 2. Store verification info in Firestore
            // We use email as key or a temporary ID
            await setDoc(doc(db, 'temp_verifications', userData.email), {
                ...userData,
                otpCode,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 10 * 60000).toISOString() // 10 mins
            })

            // 3. Send Email
            await emailService.sendOTP(userData.email, userData.firstName, otpCode)

            return true
        } catch (error) {
            console.error('Initiate Register Error:', error)
            throw new Error('Erreur lors de l\'envoi du code de vérification.')
        }
    },

    /**
     * Step 2: Verify OTP and Create Final Account
     */
    verifyAndRegister: async (email, inputCode) => {
        try {
            // 1. Get temp data
            const tempDoc = await getDoc(doc(db, 'temp_verifications', email))
            if (!tempDoc.exists()) throw new Error('Session expirée ou email invalide.')

            const data = tempDoc.data()

            // 2. Check code
            if (data.otpCode !== inputCode) {
                throw new Error('Code de vérification incorrect.')
            }

            // 3. Check expiration
            if (new Date() > new Date(data.expiresAt)) {
                throw new Error('Le code a expiré. Veuillez en demander un nouveau.')
            }

            // 4. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            const user = userCredential.user

            // 5. Create Final User Profile
            const userProfile = {
                id: user.uid,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                subject: data.subject,
                createdAt: new Date().toISOString(),
                stats: {
                    sessionsCount: 0,
                    copiesCount: 0,
                    timeSavedMinutes: 0
                }
            }

            await setDoc(doc(db, 'users', user.uid), userProfile)

            // 6. Cleanup
            // Note: In real app, we would delete the temp doc but for this demo let's keep it simple
            // await deleteDoc(doc(db, 'temp_verifications', email))

            return userProfile

        } catch (error) {
            console.error('Verify Register Error:', error)
            if (error.code === 'auth/email-already-in-use') throw new Error('Cet email est déjà utilisé.')
            throw error
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
