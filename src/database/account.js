import { supabase, supabaseAdmin } from "./supabase";
import Papa from 'papaparse';

export async function createSingleAccount(account) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
    });

    if (error) {
        console.error('Error creating account:', error);
        throw error;
    }

    const { profileData, profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
            { id: data.user.id, display_name: account.displayName, role: account.role, gender: account.gender, age: account.age }
        ]);

    if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
    }

    return { user: data.user, profile: profileData };

}

export async function loadAccountsFromCSVAndCreate(csvFile) {

    Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const csvData = results.data;
            let lastName = csvData[0]['Care-recipient email'];
            for (let i = 1; i < csvData.length; i++) {
                if (csvData[i]['Care-recipient email'] === '') {
                    csvData[i]['Care-recipient email'] = lastName;
                } else {
                    lastName = csvData[i]['Care-recipient email'];
                }
            }

            csvData.forEach(async (row) => {
                const { data: dataGiver, error: errorGiver } =
                    await supabaseAdmin.auth.admin.createUser({
                        email: row['Care-giver email'],
                        password: '12345678',
                    });

                if (errorGiver) {
                    console.error('Error creating user:', errorGiver);
                    return;
                }

                const userId = dataGiver.user.id;

                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: userId,
                        role: 'Care-giver',
                    });

                if (profileError) {
                    console.error('Error creating giver profile:', profileError);
                    return;
                }

                const { data: dataRecipient, error: errorRecipient } =
                    await supabaseAdmin.auth.admin.createUser({
                        email: row['Care-recipient email'],
                        password: '12345678',
                    });
                if (errorRecipient) {
                    console.error('Error creating user:', errorRecipient);
                    return;
                }

                const recipientId = dataRecipient.user.id;
                const { error: recipientProfileError } = await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: recipientId,
                        role: 'Care-recipient',
                    });

                if (recipientProfileError) {
                    console.error('Error creating recipient profile:', recipientProfileError);
                    return;
                }

                await supabaseAdmin.from('pairs').insert([
                    {
                        giver_email: row['Care-giver email'],
                        recipient_email: row['Care-recipient email'],
                    }
                ])
            });

        },
    });
}

