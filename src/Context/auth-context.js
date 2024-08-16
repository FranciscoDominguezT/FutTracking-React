import { createContext, useEffect, useState } from 'react';
import { supabase } from '../Configs/supabaseClient';
import { createOrUpdateUser } from '../Services/auth-service';

export const AuthContext = createContext({
    user: null,
    authError: null,
    setAuthError: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                if (session?.user) {
                    try {
                        const userData = await createOrUpdateUser(session.user);
                        setUser(userData);
                        setAuthError(null);
                    } catch (error) {
                        console.error("Error updating user data:", error);
                        setAuthError("Error updating user data");
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, authError, setAuthError }}>
            {children}
        </AuthContext.Provider>
    );
};