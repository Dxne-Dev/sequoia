/**
 * Séquoia - Session Service (Firebase Real Implementation)
 * Handles session storage and retrieval using Firestore.
 */
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    deleteDoc,
    orderBy
} from 'firebase/firestore'
import { db } from './firebase'

export const sessionService = {
    /**
     * Create a new session in Firestore
     */
    createSession: async (userId, config) => {
        try {
            const newSessionData = {
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                name: config.name || `Session du ${new Date().toLocaleDateString()}`,
                maxGrade: config.maxGrade,
                criteria: config.criteria,
                studentCount: config.studentCount,
                // We will store students as a JSON string or subcollection? 
                // For < 100 students, an array in the doc is fine and cheapter/faster.
                students: [],
                completedCount: 0
            }

            const docRef = await addDoc(collection(db, 'sessions'), newSessionData)
            return { id: docRef.id, ...newSessionData }
        } catch (error) {
            console.error('Error creating session:', error)
            throw error
        }
    },

    /**
     * Update an existing session (auto-save)
     */
    updateSession: async (sessionId, updates) => {
        try {
            const sessionRef = doc(db, 'sessions', sessionId)

            const payload = {
                ...updates,
                updatedAt: new Date().toISOString()
            }

            // Auto update completedCount if students array is provided
            if (updates.students) {
                payload.completedCount = updates.students.filter(s => s.isCompleted).length
            }

            await updateDoc(sessionRef, payload)
            return { id: sessionId, ...payload } // Optimistic return
        } catch (error) {
            console.error('Error updating session:', error)
            // Silent fail in UI, but log it
        }
    },

    /**
     * Get all active sessions for a user
     */
    getUserSessions: async (userId) => {
        try {
            const q = query(
                collection(db, 'sessions'),
                where('userId', '==', userId),
                // orderBy('updatedAt', 'desc') // Requires index creation in Firestore console
            )

            const querySnapshot = await getDocs(q)
            const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            // Manual sort until index is ready
            return sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        } catch (error) {
            console.error('Error fetching sessions:', error)
            return []
        }
    },

    /**
     * Get a specific session
     */
    getSession: async (sessionId) => {
        try {
            const docRef = doc(db, 'sessions', sessionId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() }
            } else {
                return null
            }
        } catch (error) {
            console.error('Error fetching session:', error)
            return null
        }
    },

    /**
     * Delete a session
     */
    deleteSession: async (sessionId) => {
        try {
            await deleteDoc(doc(db, 'sessions', sessionId))
        } catch (error) {
            console.error('Error deleting session:', error)
            throw error
        }
    }
}
