const { getOverview } = require('../../../../controllers/dashboard');
const { isUserAuthorized } = require('../../../../helpers/user-auh');

export default async function handler(req, res) {
  let headers = req.headers;
  let token = headers['access-token'];
  let user_id = headers['user-id'];
  let filter = req.query.filter;
  let filter_timestamp = 1;

  if ('all_time' !== filter) {
    filter_timestamp = getFilterTimestamp(filter)
  }


  if (!token || !user_id) { // preflight check needs 200 OK
    return res.status(200).send('OK');
  }

  if (!await isUserAuthorized(token, user_id)) {
    return res.status(401).send('Not authorized');
  }

  let portfolio = await getOverview(user_id, filter_timestamp);

  res.status(200).json(portfolio)
}

const getFilterTimestamp = (filter) => {
  let date = new Date();
  switch (filter) {
    case "monthly": return new Date(date.getFullYear(), date.getMonth(), 1).getTime()
    case "weekly": return new Date(date.setDate(date.getDate() - date.getDay())).getTime()
    case "daily": return date.setHours(0, 0, 0, 0)
    default: return new Date(date.getFullYear(), date.getMonth(), 1).getTime()
  }
}