import { add } from 'lodash';

const ccxt = require('ccxt');

const {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../../modules/sync/src/api/index');


export default async function handler(req, res) {

  console.log(req.body);
  if(!req.body){
    res.status(200).send("Error: Request must be POST and include at least one of the configurations!")
  }

  var data = {};
  const body = JSON.parse(JSON.stringify(req.body));
  
  if(body.dev)
  {  
    data["addresses"] = JSON.parse(body.addresses);
  } else {
    data = req.body;
  }

  const {
    keys,
    othertokens,
    addresses,
  } = data;

  const {
    fetchBinanceContractBalances,
    fetchFTXContractBalances,
    fetchBinanceContractBalancesRaw,
  } = fetchers;

  let combineExchanges = false;

  if(body.future){
    console.log(keys);
    const exchange = new ccxt["binance"](keys.binance);

    const positions = await fetchBinanceContractBalancesRaw(exchange);
    console.log(positions)
    res.status(200).json(positions);
  } else {

    const extraFetchers = {
      binance: fetchBinanceContractBalances,
      ftx: fetchFTXContractBalances,
    };

    let portfolio = await getPortfolio({
        keys,
        addresses,
        othertokens,
        combineExchanges,
      });
    
    res.status(200).json(portfolio)
  }
}