"use client";

import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import { userAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔍 Check localStorage when component loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate("/"); // already logged in → go home
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;

      const newUser = {
        _id: loggedUser.uid,
        name: loggedUser.displayName,
        email: loggedUser.email,
        photo: loggedUser.photoURL,
      };

      setUser(newUser);
      // ✅ Call API with newUser directly, not stale state
      const response = await userAPI.createUser(newUser);
      console.log("User created response:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Navigate + reload
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to login with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login to Continue
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/20 p-2 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {user ? (
          <div className="flex flex-col items-center space-y-4 text-white">
            <img
              src={user.photo}
              alt={user.name}
              className="h-16 w-16 rounded-full shadow-lg"
            />
            <h3 className="font-semibold text-black">Welcome, {user.name}</h3>
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 font-medium text-gray-700 shadow-lg transition hover:scale-105 hover:shadow-2xl"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleLogin;
