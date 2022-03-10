const { getManagers } = require('../../../controllers/managers');
const { isUserSuperAdmin } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];

  if (!token || !user_id) { // preflight check needs 200 OK
    return res.status(200).send('OK');
  }

  if (!await isUserSuperAdmin(token, user_id)) {
    return res.status(400).send('User not authorized');
  }

  let managers = await getManagers();
  res.status(200).json(managers);
}
