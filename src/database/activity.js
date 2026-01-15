import { supabase } from "./supabase";


export async function addNewActivity(activityData) {
    const { data, error } = await supabase
        .from('activities')
        .insert([activityData]);

    if (error) {
        console.error('Error adding new activity:', error);
        throw error;
    }

    return data;
}

export async function getAllActivities() {
    const { data, error } = await supabase
        .from('activities')
        .select('*');

    if (error) {
        console.error('Error fetching activities:', error);
        throw error;
    }

    return data;
}

export async function getActivityById(activityId) {
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

    if (error) {
        console.error('Error fetching activity by ID:', error);
        throw error;
    }

    return data;
}

export async function modifyActivity(activityId, updatedData) {
    const { data, error } = await supabase
        .from('activities')
        .update(updatedData)
        .eq('id', activityId);

    if (error) {
        console.error('Error updating activity:', error);
        throw error;
    }

    return data;
}

export async function deleteActivity(activityId) {
    const { data, error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);
    if (error) {
        console.error('Error deleting activity:', error);
        throw error;
    }

    return data;
}