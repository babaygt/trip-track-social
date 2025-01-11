import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { generateUploadButton } from '@uploadthing/react'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

export const UploadButton = generateUploadButton({
	url: import.meta.env.VITE_API_URL + '/api/uploadthing',
})
