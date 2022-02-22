const axios = require('axios');
const { isEmpty } = require('lodash');

const portfolioUtils = require('./portfolioUtils');
const {
  sanitizeAddress,
} = require('./utils');

const {
  combineTokenCounts,
} = portfolioUtils;

const BASE_URL = 'https://api.ethplorer.io';

const getTokens = async address => {
  const requestURL = `${BASE_URL}/getAddressInfo/${address}?apiKey=freekey`;
  const response = await axios.get(requestURL);
  
  const {
    ETH: {
      balance: ETHBalance,
    },
    tokens,
  } = response.data;

  const tokenCounts = {
    ETH: ETHBalance,
  };
  const prices = {};
  tokens.forEach(t => {
    const {
      tokenInfo: {
        symbol,
        decimals,
        price: { rate },
      },
      balance,
    } = t;

    if (symbol) {
      tokenCounts[symbol] = balance / (10 ** decimals);
      prices[symbol] = rate;
    }
  });

  return [tokenCounts, prices];
};

const getERC20TokenCounts = async (addresses, combineAddresses = false) => {
  if (isEmpty(addresses)) return [[], {}];

  const eachTokenCounts = [];
  let allTokenCounts = [];
  let allPrices = {};
  await Promise.all(
    addresses.map(async addr => {
      const [tokenCounts, prices] = await getTokens(addr);
      eachTokenCounts.push([`eth-${addr}`, tokenCounts]);
      allTokenCounts = combineTokenCounts(allTokenCounts, tokenCounts);
      allPrices = combineTokenCounts(allPrices, prices);
    }),
  );

  const resTokenCounts = combineAddresses
    ? [['eth', allTokenCounts]]
    : eachTokenCounts;

  return [resTokenCounts, allPrices];
};

const getProtocolCounts = async (addresses, net, combineAddresses = false) => {
  if (isEmpty(addresses)) return [[], {}];

  let output = [];
  let allPrices = {};

  await Promise.all(
    addresses.map(async addr => {
      const requestURL = `https://openapi.debank.com/v1/user/token_list?id=${addr}&chain_id=${net}&is_all=false&has_balance=true`;
      const response = await axios.get(requestURL);
      let chains  = {};

      response.data.map( token => {
        if(token.symbol.indexOf('.') !== -1){
          return;
        }

        if(!token.price) {
          return;
        }

        chains[token.symbol] = token.amount;
        allPrices[token.symbol] = token.price
      });
      let n = `${net}-${addr}`
      output.push([n, chains]);
    })
   )
  return [output, allPrices];
};

const getStakedCounts = async (addresses, net, combineAddresses = false) => {
  if (isEmpty(addresses)) return [[], {}];

  let output = [];
  let allPrices = {};

  await Promise.all(
    addresses.map(async addr => {
      const requestURL = `https://openapi.debank.com/v1/user/simple_protocol_list?id=${addr}&chain_id=${net}&is_all=true&has_balance=true`;
      const response = await axios.get(requestURL);
      let chains  = {};

      response.data.map( token => {
        if(token.id.indexOf('.') !== -1 || token.net_usd_value == 0){
          return;
        }
        //console.log("token: ", token)
        chains[token.id] = 1;
        allPrices[token.id] = token.net_usd_value
      });
      let n = `${net}-staked-${addr}`
      output.push([n, chains]);
    })
   )

  return [output, allPrices];
};

module.exports = {
  getStakedCounts,
  getERC20TokenCounts,
  getProtocolCounts
};
