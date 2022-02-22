const { sum } = require('lodash');
const { isEmpty } = require('lodash');

const utils = require('./utils');

const {
  sanitizetokenName,
  sortByValue,
  toFixedDecimal2,
} = utils;

const overwritePrices = (x, y) => {
  const res = { ...x };
  Object.entries(y).forEach(([name, price]) => {
    if (price) {
      res[sanitizetokenName(name)] = price;
    }
  });

  return res;
};

const _combineTokenCounts = (x, y) => {
  const res = { ...x };
  Object.entries(y).forEach(([name, count]) => {
    if (res[name]) {
      res[name] += count;
    } else {
      res[name] = count;
    }
  });

  return res;
};

const combineTokenCounts = (...counts) => counts.reduce((memo, cur) => _combineTokenCounts(memo, cur), {});

const getTotalTokenValues = tokens => {
  const res = {
    count: 0,
    USD: 0,
    FTM: 0,
    price: 0,
    health: 1
  };

  Object.values(tokens).forEach(({ FTM, USD }) => {
    res.FTM += FTM;
    res.USD += USD;
  });

  res.FTM = toFixedDecimal2(res.FTM);

  return res;
};

const calcTokenValues = (tokenCounts, prices, FTMPrice, ignoreAbsBelow = 0) => {
  const res = {};
  Object.entries(tokenCounts).forEach(([name, count]) => {
    const tokenData = { count };
    const price = prices[sanitizetokenName(name)];
    const value = parseInt(count * price);
    const value_FTM = value / FTMPrice;

    if (Math.abs(value) >= ignoreAbsBelow) {
      tokenData.USD = parseInt(count * price);
      tokenData.FTM = toFixedDecimal2(value_FTM);
      tokenData.price = price;
      tokenData.health = 1;
      res[name] = tokenData;
    }
  });

  res.TOTAL = getTotalTokenValues(res);

  return res;
};

const combineFiat = (tokenCounts, fiatName = 'USDT') => {
  const fiats = new Set([
    'USDT',
    'USD',
    'DAI',
    'USDC',
  ]);

  const res = { [fiatName]: 0 };
  Object.entries(tokenCounts).forEach(([token, count]) => {
    if (fiats.has(token)) {
      res[fiatName] += count;
    } else {
      res[token] = toFixedDecimal2(count);
    }
  });

  res[fiatName] = toFixedDecimal2(res[fiatName]);

  return res;
};

const getTokenValues = (_tokenCounts, tokenPrices, FTMprice, sort = sortByValue) => {
  let tokenCounts = _tokenCounts;
  if (typeof transform === 'function') {
    tokenCounts = transform(tokenCounts);
  }

  let tokenValues = calcTokenValues(tokenCounts, tokenPrices, FTMprice);

  if (typeof sort === 'function') {
    tokenValues = sort(tokenValues);
  }

  return tokenValues;
};

const sumOtherTokenCounts = tokens => {
  if (isEmpty(tokens)) return [];

  const res = {};
  Object.entries(tokens).forEach(([name, counts]) => {
    res[name] = sum(counts);
  });

  return [['other', res]];
};

module.exports = {
  overwritePrices,
  combineTokenCounts,
  getTokenValues,
  sumOtherTokenCounts,
};
