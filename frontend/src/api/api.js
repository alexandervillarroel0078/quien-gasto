// src/api/api.js
import axios from "axios";

const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL, // ← usa .env en CRA
baseURL: "http://192.168.0.11:8000"
});

// Interceptor para token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
