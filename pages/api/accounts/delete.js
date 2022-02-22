const { deleteAccounts } = require('../../../controllers/accounts');
const { isUserAuthorized } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];

    if (!token || !user_id) { // preflight check needs 200 OK
        return res.status(200).send('OK');
    }

    if (!isUserAuthorized(token, user_id)) {
        return res.status(401).send('Not Authorized.');
    }
    
    let account_data = req.body.ids;

    let accounts = await deleteAccounts(user_id, account_data);
    res.status(200).json(accounts);
}