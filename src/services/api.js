import axios from "axios"

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api" // Adjust this to match your backend port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// User API calls
export const userAPI = {
  // Create new user
  createUser: (userData) => api.post("/user/new", userData),

  // Get all users
  getAllUsers: () => api.get("/user"),

  // Get single user
  getUser: (id) => api.get(`/user/${id}`),

  // Delete user
  deleteUser: (id) => api.delete(`/user/${id}`),
}

// Trade API calls
export const tradeAPI = {
  
  // Create new trade
  createTrade: (tradeData) => api.post("/trades/new", tradeData),

  // Get all trades for a user
  getAllTrades: (userId) => api.get(`/trades/all${userId}`),

  // Get single trade
  getTrade: (id) => api.get(`/trades/${id}`),

  // Update trade
  updateTrade: (id, tradeData) => api.put(`/trades/${id}`, tradeData),

  // Close trade
  closeTrade: (id, closeData) => api.put(`/trades/${id}/close`, closeData),

  // Delete trade
  deleteTrade: (id) => api.delete(`/trades/${id}`),
}

export default api
