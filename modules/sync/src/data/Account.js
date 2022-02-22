const { initSupabase } = require('../supabase-connect');
const { formatAccountData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.Wallet';

/**
 * Account stores wallets and its contents.
 * @TODO: Handeling limit and offset.
 * @param {object} filters key:value object of filters
 * @returns json
 */
const getAccounts = async (user_id) => {
    const { data, error } = await supabase
        .from(table)
        .select()
        .eq('user_id', user_id)

    return formatAccountData(error, data, table);
}

module.exports = {
    getAccounts
}