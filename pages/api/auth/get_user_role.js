const { isUserAuthorized, isUserSuperAdmin } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];

  if (!token || !user_id) { // preflight check needs 200 OK
    return res.status(200).send('OK');
  }

  if (!await isUserAuthorized(token, user_id)) {
    return res.status(401).send('Not authorized');
  }

  let role = { role: 'authenticated' };

  if (await isUserSuperAdmin(token, user_id)) {
    role = { role: 'super_admin' };
  }

  res.status(200).json(role);
}