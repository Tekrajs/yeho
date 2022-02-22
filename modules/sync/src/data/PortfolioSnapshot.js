const { initSupabase } = require('../supabase-connect');
const { formatReturnData } = require('../helpers/data-helpers');

let supabase = initSupabase();
const table = 'QFG.PortfolioSnapshot';

/**
 * Account stores wallets and its contents.
 * @TODO: Handeling limit and offset.
 * @param {object} filters key:value object of filters
 * @returns json
 */
const getPortfolioSnapshot = async (filters) => {
    let query = supabase
        .from(table)
        .select()

    for (const key in filters) {
        query = query.eq(key, filters[key]);
    }

    const { error, data } = await query;

    return formatReturnData(error, data, table);
}

const insertPortfolioSnapshot = async (portfolio) => {
    const { data, error } = await supabase
        .from(table)
        .insert(portfolio)

    return formatReturnData(error, data, table);
}

/**
 * Revert portfolio sync by clearing stored data.
 * @param {number} user_id
 * @param {number} sync_time Timestamp of current sync start time
 * @returns {json}
 */
const revertPortfolioSnapshotSync = async (user_id, sync_time) => {
    const { data, error } = await supabase
        .from(table)
        .delete()
        .match({ user_id: user_id, timestamp: sync_time })

    return formatReturnData(error, data, table);
}

module.exports = {
    getPortfolioSnapshot,
    insertPortfolioSnapshot,
    revertPortfolioSnapshotSync,
};