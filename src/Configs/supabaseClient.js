import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cryvkjhhbrsdmffgqmbj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeXZramhoYnJzZG1mZmdxbWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg0NzA2ODcsImV4cCI6MjAzNDA0NjY4N30.cMsxCSZjo_f80dzggwpRIreO10r8szOKohmKyDrSPYE"

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getVideoData = async (videoId) => {

    const { data, error } = await supabase
   
        .from('videos')
        .select('*')
        .eq('id', videoId) // Assuming you want to get data for video with ID 1
        .single();
   
    if (error) {
        console.error("Error obteniendo datos del video:", error);
        return null;
    }
    return data;
}

export const getVideoLikes = async (videoId) => {
    const { data, error } = await supabase
       
        .from('videos')
        .select('likes')
        .eq('id',videoId );
        if (error) {
            console.error("Error obteniendo likes del video:", error);
            return [];
        }
        return data;
}
export const getComentarioLikes = async (videoId) => {
    const { data, error } = await supabase
       
        .from('comentarios')
        .select('likes')
        .eq('videoid',videoId );
        console.log("Prueba",videoId)
        if (error) {
            console.error("Error obteniendo likes del video:", error);
            return [];
        }
        console.log("prueba select likes",data)
        return data;
       
}
export const getVideoComments = async (videoId) => {
    const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('videoid', videoId)
        .is('parent_id', null); // Comentarios principales

    if (error) {
        console.error("Error obteniendo comentarios del video:", error);
        console.log("El id es", videoId);
        return [];
    }
    return data;
}

export const getUserData = async (userId) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            id,
            nombre,
            apellido,
            perfil_jugadores (
                avatar_url
            )
        `)
        .eq('id', userId)
        .single();
   
    if (error) {
        console.error("Error obteniendo datos del usuario:", error);
        return null;
    }
    return {
        ...data,
        avatar_url: data.perfil_jugadores?.avatar_url
    };
}
export const fetchCommentReplies = async (Id) => {
    const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq( 'parent_id',Id)
   
    if (error) {
        console.error("Error obteniendo comentarios del video:", error);
        console.log("el id es",Id)
        return [];
    }
    return data;
}
export default supabase;
