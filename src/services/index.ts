import axios from 'axios'

const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE,
})

// Attach Authorization header if a valid auth_token exists
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth_token')
  const token = raw && raw !== 'null' && raw !== 'undefined' ? raw : ''
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
