import * as z from 'zod'

export const routeFormSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters.' })
		.max(100, { message: 'Title cannot exceed 100 characters.' }),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters.' })
		.max(2000, { message: 'Description cannot exceed 2000 characters.' }),
	visibility: z.enum(['public', 'private', 'followers'] as const),
	tags: z.string().optional(),
})

export type RouteFormValues = z.infer<typeof routeFormSchema>
