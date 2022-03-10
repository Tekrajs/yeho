const { inviteUser } = require('../../../helpers/invite-user');
const { isUserSuperAdmin } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];
  let { email } = req.body;

  if (!token || !user_id) { // preflight check needs 200 OK
    return res.status(200).send('OK');
  }

  if (await isUserSuperAdmin(token, user_id)) {
    const { data, error } = await inviteUser(email);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Can\'t invite user' });
  }
  return res.status(201).json({ success: true, message: 'New user invited' });
}
