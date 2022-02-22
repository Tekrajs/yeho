const chalk = require('chalk');

const utils = require('./utils/utils');
const portfolioUtils = require('./utils/portfolioUtils');
const ethUtils = require('./utils/ethUtils');
const exchangeUtils = require('./utils/exchangeUtils');
const marketUtils = require('./utils/marketUtils');

var term = require( 'terminal-kit' ).terminal ;

var progressBar , progress = 0 ;

const {
  printPortfolioNicely,
} = utils;

const {
  getPrices,
  getFTMPrice,
} = marketUtils;

const {
  overwritePrices,
  combineTokenCounts,
  getTokenValues,
  sumOtherTokenCounts,
} = portfolioUtils;

const {
  getERC20TokenCounts,
  getProtocolCounts,
  getStakedCounts
} = ethUtils;

const {
  getExchangeTokenCounts,
  fetchers,
} = exchangeUtils;

const { log } = console;

const getPortfolio = async ({
  keys = {},
  addresses = [],
  othertokens = {},
  combineExchanges = false,
  combineAddresses = false,
  extraFetchers = {},
  verbose = true,
  optionIndex
} = {}) => {

  let current=1

  function another(){
    current=current+1;
    return current;
  }

  var count =8;

  progressBar = term.progressBar( {
    width: 200 ,
    title: 'Started to fetch portfolio data ...' ,
    eta: true ,
    percent: true,
    items: count
  } ) ;

  progressBar.startItem( 'fetching exchange token counts ...' )
  const exchangeTokenCounts = await getExchangeTokenCounts(keys, extraFetchers, combineExchanges);
  progressBar.update( another()/count );

  progressBar.startItem('fetching Eth Tokens ...');
  const [ethTokenCounts, ethTokenPrices] = await getProtocolCounts(addresses, "eth", combineAddresses);
  progressBar.update( another()/count );

  progressBar.startItem('fetching BSC Tokens ...');
  const [bscTokenCounts, bscTokenPrices] = await getProtocolCounts(addresses, "bsc", combineAddresses);
  progressBar.update( another()/count );

  progressBar.startItem('fetching Polygon Tokens counts ...');
  const [maticTokenCounts, maticTokenPrices] = await getProtocolCounts(addresses, "matic", combineAddresses);
  progressBar.update( another()/count );

  progressBar.startItem('fetching Fantom Tokens counts ...');
  const [fantomTokenCounts, fantomTokenPrices] = await getProtocolCounts(addresses, "ftm", combineAddresses);
  progressBar.update( another()/count );

  const [stakedMaticTokenCounts, stakedMaticTokenPrices] = await getStakedCounts(addresses, "matic", combineAddresses);
  const [stakedEthTokenCounts, stakedEthTokenPrices] = await getStakedCounts(addresses, "eth", combineAddresses);
  const [stakedFantomTokenCounts, stakedFantomTokenPrices] = await getStakedCounts(addresses, "ftm", combineAddresses);
  const [stakedBscTokenCounts, stakedBscTokenPrices] = await getStakedCounts(addresses, "bsc", combineAddresses);

  progressBar.startItem('fetching other token counts ...');
  const otherTokenCounts = sumOtherTokenCounts(othertokens);

  let eachTokenCounts = [
    ...exchangeTokenCounts,
    ...ethTokenCounts,
    ...stakedEthTokenCounts,
    ...bscTokenCounts,
    ...stakedBscTokenCounts,
    ...maticTokenCounts,
    ...stakedMaticTokenCounts,
    ...fantomTokenCounts,
    ...stakedFantomTokenCounts,
    ...otherTokenCounts
  ];

  //console.log(eachTokenCounts);

  const allTokenCounts = combineTokenCounts(
    ...eachTokenCounts.map(([, counts]) => counts),
  );

  eachTokenCounts = [
    ...eachTokenCounts,
    ['all', allTokenCounts],
  ];

  progressBar.startItem('fetching all token prices ...');
  progressBar.update( another()/count );

  const FTMprice = await getFTMPrice();
  let tokenPrices = await getPrices(Object.keys(allTokenCounts), verbose);

  progressBar.startItem('calculating all token values ...');
  progressBar.update( another() / count );

  let allTokenPrices = {
      ...ethTokenPrices,
      ...bscTokenPrices,
      ...maticTokenPrices,
      ...fantomTokenPrices,
      ...stakedMaticTokenPrices,
      ...stakedEthTokenPrices,
      ...stakedFantomTokenPrices,
      ...stakedBscTokenPrices,
      ...tokenPrices
   };

  const allTokenValues = eachTokenCounts.map(([name, counts]) => {
    const values = getTokenValues(counts, allTokenPrices, FTMprice);
    return [name, values];
  });

  return Object.fromEntries(allTokenValues);
};

module.exports = {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
};
