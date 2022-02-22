const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();
const table = 'QFG.Clients';

/**
 * Get all wallets from database
 * @param {string} user_id
 * @returns json
 */
const getAllClients = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('user_id', user_id)

        if (error) {
            throw new Error('Error getting accounts from database.');
        }
        
        return data;
    } catch (e) {
        console.log(e);
    }
}


/**
 * Save a client to database
 * @param {string} user_id
 * @param {json} wallet_data
 * @returns json
 */
const createClient = async (user_id, client_data) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const { data, error } = await supabase
            .from(table)
            .insert([
                client_data
            ])

        if (error) {
            throw new Error('Error getting accounts from database.');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Remove clients from database
 * @param {string} user_id
 * @param {json} data
 * @returns json
 */
const removeClients = async (user_id, wallet_data) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        for (const key in wallet_data) {
            await supabase
                .from(table)
                .delete()
                .match({ id: wallet_data[key], user_id: user_id })
        }

        return;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getAllClients,
    createClient,
    removeClients
}