const {
  getPortfolio,
  printPortfolioNicely,
  fetchers,
} = require('../modules/sync/src/api/index');
const data = require('./data');

var term = require( 'terminal-kit' ).terminal ;

const {
  keys,
  othertokens,
  addresses,
} = data;

const {
  fetchBinanceContractBalances,
  fetchFTXContractBalances,
} = fetchers;

(async () => {
  let combineExchanges = false;

  const extraFetchers = {
    //binance: fetchBinanceContractBalances,
    ftx: fetchFTXContractBalances,
  };

  term.cyan( 'The hall is spacious. Someone lighted few chandeliers.\n' ) ;
  term.cyan( 'There are doorways south and west.\n' ) ;

  term.cyan('\n')
  term.cyan(' _______                             ______  _     _ ______  ______  _ _ _ \n')
  term.cyan('(_______)         _                 (_____ \\| |   | |  ___ \\(_____ \\| | | |\n')
  term.cyan(' _____ ____ ____ | |_  ___  ____     _____) ) |   | | | _ | |_____) ) | | |\n')
  term.cyan('|  ___) _  |  _ \\|  _)/ _ \\|    \\   |  ____/| |   | | || || |  ____/|_|_|_|\n')
  term.cyan('| |  ( ( | | | | | |_| |_| | | | |  | |     | |___| | || || | |      _ _ _ \n')
  term.cyan('|_|   \\_||_|_| |_|\\___)___/|_|_|_|  |_|      \\______|_||_||_|_|     |_|_|_|\n')
  
  var items = [ 'Exchange Summary' , 'Exchange Detailed', 'Tokens Detailed' , 'All of them', 'Create Snapshot'] ;

  let selectedIndex;

  await term.singleColumnMenu( items , async function( error , response ) {
    
    let portfolio;

    if(response.selectedIndex == 0){
      combineExchanges = true;
      portfolio = await getPortfolio({
        keys,
        combineExchanges,
      });
    }

    if(response.selectedIndex == 1){
      combineExchanges = false;
      portfolio = await getPortfolio({
        keys,
        combineExchanges,
      });
    }

    if(response.selectedIndex == 2){
      combineExchanges = false;
      portfolio = await getPortfolio({
        addresses,
      });
    }

    if(response.selectedIndex == items.length-2){
      combineExchanges = false;
      portfolio = await getPortfolio({
        keys,
        addresses,
        othertokens,
        combineExchanges,
        extraFetchers,
      });
    }

    if(response.selectedIndex == items.length-1){
      combineExchanges = false;
      portfolio = await getPortfolio({
        keys,
        addresses,
        othertokens,
        combineExchanges,
        extraFetchers,
      });
      console.log(JSON.stringify(portfolio));
      process.exit(0);
    }


    printPortfolioNicely(portfolio);
    process.exit(0);
  } ) ;
})();
