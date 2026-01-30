import axios from "axios";
import api from "./api";

// axios.defaults.withCredentials = true;

const apiUrl = "/auth";

export const userLogin = async (identifier, password) => {

    const isEmail = identifier.includes('@');

    try {
        const response = await api.post(`${apiUrl}/login`, { 
            ...(isEmail ? { email: identifier} : { username: identifier }), // return email or username
            password
        });
        return response.data;
    } catch(err) {
        console.error("login error", err.response?.data || err.message);
        throw err;
    }
}

export const registerUser = async (username, email, password) => {
    try {
        const response = await api.post(`${apiUrl}/register`,{
            username, email, password
        });
        return response.data;
    } catch(err) {
        console.error("register error", err.message);
    }
}

export const logoutUser = async () => {
    try {
        await api.post(`${apiUrl}/logout`);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    } catch(err) {
        console.error("logout error", err.response?.data || err.message);
    }
}
