import { supabase } from "./supabase";

export async function createRequest(request) {
    const { data, error } = await supabase
        .from('requests')
        .insert([request]);

    if (error) {
        console.error('Error creating request:', error);
        throw error;
    }
    return data;
}
