import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

export const adminService = {
    /**
     * Fetch all users for the admin dashboard
     */
    getAllUsers: async () => {
        try {
            const usersRef = collection(db, 'users')
            const q = query(usersRef, orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => {
                const data = doc.data()
                // Initialize default subscription data if missing
                // This answers the requirement: "everything concerning user subscription must be included even if not used"
                return {
                    id: doc.id,
                    ...data,
                    subscription: data.subscription || {
                        plan: 'Free Trial', // Default plan
                        status: 'active',   // active, cancelled, expired
                        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                        amount: 0
                    }
                }
            })
        } catch (error) {
            console.error('Error fetching users:', error)
            throw error
        }
    },

    /**
     * Calculate global stats for dashboard
     */
    getDashboardStats: (users) => {
        const totalUsers = users.length
        const activeSubs = users.filter(u => u.subscription?.status === 'active').length
        const totalCopies = users.reduce((acc, user) => acc + (user.stats?.copiesCount || 0), 0)
        const totalSessions = users.reduce((acc, user) => acc + (user.stats?.sessionsCount || 0), 0)

        return {
            totalUsers,
            activeSubs,
            mrr: activeSubs * 29, // Mocking 29€/mo pricing
            totalCopies,
            totalSessions
        }
    }
}
