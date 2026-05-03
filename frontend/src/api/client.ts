import axios from 'axios'
const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/'
const api = axios.create({ baseURL, timeout: 60000 })
api.interceptors.response.use((r) => r, (e) => { if (import.meta.env.DEV) console.error(e); return Promise.reject(e) })
export default api
