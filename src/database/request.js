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

export async function getRequestsByRecipientEmails(recipientEmails) {
    if (!recipientEmails || recipientEmails.length === 0) return [];

    console.log('Fetching requests for recipients:', recipientEmails);

    const { data, error } = await supabase
        .from('requests')
        .select('*')
        .in('recipient_email', recipientEmails.map(r => r.recipient_email));

    if (error) throw error;
    return data;
}


export async function getRequestsByRecipientEmail(recipientEmail) {
    const { data, error } = await supabase
        .from('requests')
        .select('activity_id, status')
        .eq('recipient_email', recipientEmail);

    if (error) throw error;
    return data || [];
}


// accept or reject request
export async function updateRequestStatus(requestId, status) {
    const { data, error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', requestId)
        .select('*')
        .single();

    if (error) throw error;
    return data;
}