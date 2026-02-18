// frontend/src/auth/useAuth.js
import { useState } from "react";
import api from "../api/api";

export default function useAuth() {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (correo, password) => {
        const res = await api.post("/auth/login", { correo, password });

        const { access_token, ...userData } = res.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        window.location.href = "/login";
    };

    return { user, login, logout };
}
