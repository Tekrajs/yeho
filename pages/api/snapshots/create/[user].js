const { isWalletAvailable } = require("../../../../helpers/wallet");
const {
  getUserIdFromEmail,
} = require("../../../../helpers/user-auh");

const {sync} = require("../../../../modules/sync/src/index");

export default async function handler(req, res) {
  let email = req.query.user;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  let user_id = await getUserIdFromEmail(email);

  if (user_id) {
    if (await isWalletAvailable(user_id)) {
      sync(user_id);
    } else {
      return res.status(401).send("No wallets available");
    }
  } else {
    return res.status(400).send("User does not exist");
  }

  return res.status(200).json("Sync started");
}
