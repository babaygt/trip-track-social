import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface User {
	id: string
	name: string
	email: string
	username: string
	bio?: string
	profilePicture?: string
	followers: string[]
	following: string[]
	bookmarks: string[]
	isAdmin: boolean
	createdAt: string
	updatedAt: string
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
