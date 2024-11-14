import * as z from 'zod'

export const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		),
	bio: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
