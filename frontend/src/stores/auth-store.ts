import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface User {
	id: string
	name: string
	email: string
	isAdmin: boolean
}

interface AuthState {
	user: User | null
	setUser: (user: User | null) => void
	isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				isAuthenticated: false,
				setUser: (user) => set({ user, isAuthenticated: !!user }),
			}),
			{
				name: 'auth-storage',
			}
		)
	)
)
