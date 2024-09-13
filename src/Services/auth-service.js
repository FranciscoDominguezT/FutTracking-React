import axios from 'axios';

const apiUrl = "http://localhost:5001/api"; // Cambia esto por tu URL real

export const signInWithEmail = async (email, password) => {
    try {
        const response = await axios.post(`${apiUrl}/login/login`, { email, password });
        const { token, user } = response.data;

        if (token) {
            localStorage.setItem("token", token);
            return { user, error: null };
        }
    } catch (error) {
        console.error("Error in signInWithEmail:", error);
        return { user: null, error: error.response?.data?.message || "Error de autenticación" };
    }
};

export const signInWithGoogle = async () => {
    try {
        const response = await axios.post(`${apiUrl}/login/google-login`);
        const { token, user } = response.data;

        if (token) {
            localStorage.setItem("token", token);
            return { user, error: null };
        }
    } catch (error) {
        console.error("Error during Google sign-in", error);
        return { user: null, error: error.response?.data?.message || "Error de autenticación" };
    }
};
