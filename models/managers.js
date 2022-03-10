const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();
const table = 'QFG.Users';

/**
 * Get all wallets from database
 * @param {string} user_id
 * @returns json
 */
const getAllManagers = async () => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select()
      .neq('role', 'super_admin')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Error getting accounts from database.');
    }

    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getAllManagers
}