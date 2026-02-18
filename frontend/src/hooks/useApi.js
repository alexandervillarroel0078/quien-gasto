// frontend\src\hooks\useApi.js
import { useState } from "react";
import api from "../api/api";

export default function useApi(endpoint) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await api.get(endpoint);
        setData(res.data);
        setLoading(false);
    };

    return { data, loading, load };
}
