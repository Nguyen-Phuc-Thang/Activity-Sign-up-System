import { supabase } from "./supabase";

export async function getMyRecipients(giverEmail) {
    const { data, error } = await supabase
        .from('pairs')
        .select('recipient_email')
        .eq('giver_email', giverEmail);

    if (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }

    return data;
}

export async function addRecipient(giverEmail, recipientEmail) {
    const { error } = await supabase
        .from('pairs')
        .insert([
            {
                giver_email: giverEmail,
                recipient_email: recipientEmail,
            },
        ]);

    if (error) {
        console.error('Error adding recipient:', error);
        throw error;
    }
}
