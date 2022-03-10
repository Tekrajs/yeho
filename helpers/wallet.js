const { initSupabase } = require("../supabase-connect");

let supabase = initSupabase();

const isWalletAvailable = async (user_id) => {
  const table = "QFG.Wallet";
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("user_id", user_id);

  if (data.length > 0) {
    return true;
  }

  return false;
};

module.exports = {
  isWalletAvailable,
};
