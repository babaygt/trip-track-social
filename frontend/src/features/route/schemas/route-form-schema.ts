import * as z from 'zod'

export const routeFormSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must be at least 2 characters.' })
		.max(100, { message: 'Title cannot exceed 100 characters.' }),
	description: z.string(),
	visibility: z.enum(['public', 'private', 'followers'] as const),
	tags: z.string().optional(),
})

export type RouteFormValues = z.infer<typeof routeFormSchema>
