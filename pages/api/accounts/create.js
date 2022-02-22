const { saveAccount } = require('../../../controllers/accounts');
const { isUserAuthorized } = require('../../../helpers/user-auh');

export default async function handler(req, res) {
    let headers = req.headers;
    let token = headers['access-token'];
    let user_id = headers['user-id'];

    if (!token || !user_id) { // preflight check needs 200 OK
        return res.status(200).send('OK');
    }

    if (!isUserAuthorized(token, user_id)) {
        return res.status(401).send('Not authorized');
    }

    let request = req.body;
    let data = {};

    data.user_id = user_id;
    data.account_type = request.account_type;
    data.name = request.nickname;
    data.description = request.description;
    data.status = true;

    if ('cefi' === data.account_type) {
        data.cefi_account_provider = request.exchange;
        data.api_key = request.apiKey;
        data.api_secret = request.secretKey;
    } else if ('defi' === data.account_type) {
        data.wallet_address = request.address;
    }

    let accounts = await saveAccount(user_id, data);
    res.status(200).json(accounts);
}