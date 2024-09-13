import { createContext, useEffect, useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../Services/auth-service';

export const AuthContext = createContext({
    user: null,
    authError: null,
    setAuthError: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    // Función para iniciar sesión con email y contraseña
    const loginWithEmail = async (email, password) => {
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
            setAuthError(error);
        } else {
            setUser(user);
            setAuthError(null);
        }
    };

    // Función para iniciar sesión con Google
    const loginWithGoogle = async () => {
        const { user, error } = await signInWithGoogle();
        if (error) {
            setAuthError(error);
        } else {
            setUser(user);
            setAuthError(null);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, authError, loginWithEmail, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
