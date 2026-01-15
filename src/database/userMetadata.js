import { supabase } from "./supabase";

export async function getUserMetadata(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
        console.error('Error fetching user metadata:', error);
        return null;
    }
    return data;
}


export async function updateUserMetadata(userId, field, value) {
    if (field === 'email') {
        const { error: updateError } = await supabase.auth.updateUser({
            [field]: value
        });
        if (updateError) {
            console.error(`Error updating user ${field}:`, updateError);
            return null;
        }
    }
    const { data, error } = await supabase.from('profiles').update({ [field]: value }).eq('id', userId);
    if (error) {
        console.error('Error updating user metadata:', error);
        return null;
    }
    return data;
}