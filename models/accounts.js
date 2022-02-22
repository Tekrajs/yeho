const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

/**
 * Get all wallets from database
 * @param {string} user_id
 * @returns json
 */
const getAllAccounts = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Wallet';

        const { data, error } = await supabase
            .from(table)
            .select('id, account_type, cefi_account_provider, name, description, api_key, wallet_address, created_at')
            .eq('user_id', user_id)
            .eq('status', true)

        if (error) {
            throw new Error('Error getting accounts from database.');
        }

        let cefiAccounts = [];
        let defiAccounts = [];

        data.forEach(element => {
            let account = {};

            account.id = element.id;
            account.nickname = element.name;
            account.exchange = element.cefi_account_provider;
            account.apiKey = element.api_key;
            account.description = element.description;
            account.address = element.wallet_address;
            account.timestamp = element.created_at;

            if ('cefi' === element.account_type) {
                cefiAccounts.push(account);
            } else {
                defiAccounts.push(account);
            }
            account = {};
        });
        return { cefiAccounts, defiAccounts };
    } catch (e) {
        console.log(e);
    }
}


/**
 * Save a wallet to database
 * @param {string} user_id
 * @param {json} wallet_data
 * @returns json
 */
const createAccount = async (user_id, wallet_data) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Wallet';

        const { data, error } = await supabase
            .from(table)
            .insert([
                wallet_data
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
 * Remove wallets from database
 * @param {string} user_id
 * @param {json} data
 * @returns json
 */
const removeAccounts = async (user_id, wallet_data) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Wallet';

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
    getAllAccounts,
    createAccount,
    removeAccounts
}