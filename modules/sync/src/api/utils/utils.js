const { pad } = require('lodash');
const { table } = require('table');
const chalk = require('chalk');

const { log } = console;

const sanitizetokenName = t => t.toLowerCase();
const sanitizeAddress = a => `${a.slice(0, 6)}...${a.slice(a.length - 4)}`;

const sortByValue = values => Object.entries(values).sort(
  ([, { USD: val1 }], [, { USD: val2 }]) => val2 - val1,
);

const filterObj = (obj, func) => Object.fromEntries(
  Object.entries(obj).filter(func),
);
const ignoreValueBelow = x => (([, value]) => value > x);

const toFixedDecimal = decimal => x => parseFloat(parseFloat(x).toFixed(decimal));
const toFixedDecimal1 = toFixedDecimal(1);
const toFixedDecimal2 = toFixedDecimal(2);

const toPrecision5 = x => parseFloat(x.toPrecision(5));

const printValues = (name, values) => {
  const total = values.find(([name]) => name === 'TOTAL')[1].USD;

  const res = values.map(val => {
    const [name, { count, USD, FTM, price }] = val;
    const ratio = toFixedDecimal1((USD * 100) / total);

    return [name, `$${USD}`, `${ratio}%`, `f${FTM}`, `$${toPrecision5(price)}`, count];
  });

  const headerCell = ['name', 'USD', 'ratio', 'inFTM', 'price', 'count'];
  const output = table([headerCell, ...res]);

  if(name.indexOf("ftm") != -1){
    coloring = chalk.cyan;
  }else if(name.indexOf("matic") != -1){
    coloring = chalk.magenta;
  }else if(name.indexOf("bsc") != -1){
    coloring = chalk.yellow;
  }else if(name.indexOf("eth") != -1){
    coloring = chalk.gray;
  }else{
    coloring = chalk.green;
  }
  log(coloring(output));
};

const printPortfolioNicely = res => {
  const MSG_LENGTH = 58+30;

  Object.entries(res).forEach(([name, values]) => {
    let coloring;

    if(name.indexOf("ftm") != -1){
      coloring = chalk.cyan;
    }else if(name.indexOf("matic") != -1){
      coloring = chalk.bgMagenta;
    }else if(name.indexOf("bsc") != -1){
      coloring = chalk.bgYellow;
    }else if(name.indexOf("eth") != -1){
      coloring = chalk.bgGray;
    }else{
      coloring = chalk.bgGreen;
    }
    log(coloring('-'.repeat(MSG_LENGTH)));
    log(coloring(`$$$ ${pad(`${name} tokens `, MSG_LENGTH - 8)} $$$`));
    log(coloring('-'.repeat(MSG_LENGTH)));

    printValues(name, values);
    log('');
  });
};

module.exports = {
  sanitizetokenName,
  sanitizeAddress,
  filterObj,
  ignoreValueBelow,
  sortByValue,
  toFixedDecimal,
  toFixedDecimal2,
  printPortfolioNicely,
};
