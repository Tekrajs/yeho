const { data } = require('../../qftg-fund-manager/src/components/Chart/CustomLineChart');
const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

const isUserAuthorized = async (token, user_id) => {
    if (!token) {
        return false;
    }

    const { user, error } = await supabase.auth.api.getUser(
        token
    )
    if (error || user_id !== user.id) {
        return false;
    }

    return true;
}

module.exports = {
    isUserAuthorized
}
