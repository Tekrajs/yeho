const { initSupabase } = require("../supabase-connect");

let supabase = initSupabase();

const isUserAuthorized = async (token, user_id) => {
  if (!token) {
    return false;
  }

  const { user, error } = await supabase.auth.api.getUser(token);
  if (error || user_id !== user.id) {
    return false;
  }

  return true;
};

const doesUserExist = async (user_id) => {
  const table = "QFG.Users";
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", user_id);

  if (data.length > 0) {
    return true;
  }

  return false;
};

const getUserIdFromEmail = async (email) => {
  const table = "QFG.Users";
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("email", email);

  if (data.length > 0) {
    return data[0].id;
  }

  return false;
};

const isUserSuperAdmin = async (token, user_id) => {
  if (!await isUserAuthorized(token, user_id)) {
    return false;
  }

  const table = "QFG.Users";
  const { data, error } = await supabase
    .from(table)
    .select()
    .eq("id", user_id);

  if (error) {
    return false;
  }
  if (data.length > 0 && 'super_admin' === data[0].role) {
    return true;
  }

  return false;
}

module.exports = {
  isUserAuthorized,
  doesUserExist,
  getUserIdFromEmail,
  isUserSuperAdmin
};
