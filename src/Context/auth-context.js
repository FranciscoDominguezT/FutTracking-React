import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../Configs/supabaseClient';
import { createOrUpdateUser } from '../Services/auth-service';
import axios from 'axios';

export const AuthContext = createContext({
    user: null,
    token: null,
    authError: null,
    setAuthError: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                if (session?.user) {
                    try {
                        const response = await axios.post('http://localhost:5001/api/login/google-login', {
                          name: session.user.user_metadata.full_name,
                          email: session.user.email,
                          picture: session.user.user_metadata.avatar_url
                        });
                      
                        const newToken = response.data.token;
                        localStorage.setItem('token', newToken);
                        setToken(newToken);
                      
                        setUser(response.data.user);  // Aquí debes asegurarte de que 'user' se devuelve en la respuesta
                        setAuthError(null);
                      } catch (error) {
                        console.error("Error updating user data:", error.response?.data || error.message);
                        setAuthError("Error updating user data: " + (error.response?.data?.details || error.message));
                      }                      
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5001/api/profile/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.profile);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setAuthError("Error fetching user data");
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, authError, setAuthError, logout }}>
            {children}
        </AuthContext.Provider>
    );
};