const { initSupabase } = require('../supabase-connect-with-service-key');
let supabase = initSupabase();

const inviteUser = async (email) => {
  console.log(email, 'maal');
  return await supabase.auth
    .api
    .inviteUserByEmail(email);
};

module.exports = {
  inviteUser
}