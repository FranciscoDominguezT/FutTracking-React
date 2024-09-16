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
    try {
        // Crear o actualizar el usuario en la tabla 'usuarios'
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .upsert({
                auth_id: authUser.id,
                email: authUser.email,
                nombre: authUser.user_metadata.full_name.split(' ')[0],
                apellido: authUser.user_metadata.full_name.split(' ').slice(1).join(' '),
                rol: 'Aficionado'  // default role
            }, { onConflict: 'auth_id' })
            .select()
            .single();

        if (userError) throw userError;

        // Crear o actualizar el perfil en la tabla 'perfil_aficionados'
        const { data: profileData, error: profileError } = await supabase
            .from('perfil_aficionados')
            .upsert({
                usuario_id: userData.id,  // Relacionar con el usuario
                avatar_url: authUser.user_metadata.avatar_url  // URL del avatar de Google
            }, { onConflict: 'usuario_id' })
            .select()
            .single();

        if (profileError) throw profileError;

        return userData;
    } catch (error) {
        console.error("Error in createOrUpdateUser:", error);
        throw error;
    }
};