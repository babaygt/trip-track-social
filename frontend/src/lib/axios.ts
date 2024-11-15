import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})
