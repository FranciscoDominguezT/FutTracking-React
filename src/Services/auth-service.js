import { supabase } from "../Configs/supabaseClient";

export const signInWithEmail = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // Fetch user data from 'usuarios' table
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('auth_id', data.user.id)
            .single();

        if (userError) throw userError;

        return { user: { ...userData, auth_id: data.user.id }, error: null };
    } catch (error) {
        console.error("Error in signInWithEmail:", error);
        return { user: null, error: error.message };
    }
};

export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/home'
            }
        });
        if (error) throw error;
        return { data };
    } catch (error) {
        console.error('Error during Google sign-in', error);
        return { error };
    }
};

export const createOrUpdateUser = async (authUser) => {
    const { data, error } = await supabase
        .from('usuarios')
        .upsert({
            auth_id: authUser.id,
            email: authUser.email,
            nombre: authUser.user_metadata.full_name.split(' ')[0],
            apellido: authUser.user_metadata.full_name.split(' ').slice(1).join(' '),
            rol: 'Jugador'  // default role
        }, { onConflict: 'auth_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
};