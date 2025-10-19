"use client"

import { useState, useEffect } from "react"
import { userAPI } from "../services/api"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAllUsers()
      setUsers(response.data)
    } catch (err) {
      setError("Failed to fetch users")
      console.error("Fetch users error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userAPI.deleteUser(userId)
        setUsers(users.filter((user) => user._id !== userId))
      } catch (err) {
        setError("Failed to delete user")
        console.error("Delete user error:", err)
      }
    }
  }

  if (loading) return <div className="loading">Loading users...</div>

  return (
    <div>
      <h1>Users Management</h1>

      {error && <div className="error">{error}</div>}

      <div className="trade-grid">
        {users.length === 0 ? (
          <div className="card">
            <p>No users found.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="card">
              <h3>{user.name}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {user.photo && (
                <img
                  src={user.photo || "/placeholder.svg"}
                  alt={user.name}
                  style={{ width: "60px", height: "60px", borderRadius: "50%", marginTop: "10px" }}
                />
              )}

              <div style={{ marginTop: "15px" }}>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>
                  Delete User
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Users
