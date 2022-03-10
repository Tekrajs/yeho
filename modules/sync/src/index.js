const { getPortfolio, fetchers } = require('./api/index');

const { insertPortfolioSnapshot } = require('./data/PortfolioSnapshot');
const { updateLastSyncTime } = require('./data/Users');
const { formatPortfolioSnapshot } = require('./helpers/data-helpers');
const { getAccounts } = require('./data/Account');

async function sync(user_id) {
    try {
        if (!user_id) {
            throw new Error('User id not found');
        }

        // preparing tokens/config to fetch portfolio
        const data = await getAccounts(user_id);

        if (!data) {
            throw new Error('Wallet account data not found');
        }

        //serves as sync lot number for storage
        let sync_time = new Date().getTime();

        const {
            keys,
            othertokens,
            addresses,
        } = data;
        let combineExchanges = true;

        const {
            fetchBinanceContractBalances,
            fetchFTXContractBalances,
        } = fetchers;

        const extraFetchers = {
            binance: fetchBinanceContractBalances,
            ftx: fetchFTXContractBalances,
        };

        let portfolio = await getPortfolio({
            keys,
            addresses,
            othertokens,
            combineExchanges,
            extraFetchers
        });

        //get prepared portfolio data for insertion
        // let formattedPortfolio = await formatPortfolio(user_id, sync_time, portfolio);
        let formattedPortfolioSnapshot = await formatPortfolioSnapshot(user_id, sync_time, portfolio);

        //bulk insert portfolio data to database
        // let portfolioInsertResult = await insertPortfolio(formattedPortfolio.portfolio);
        // let totalPortfolioInsertResult = await insertTotalPortfolio(formattedPortfolio.total);
        let portfolioSnapshotInsertResult = await insertPortfolioSnapshot(formattedPortfolioSnapshot);

        //Commit sync if no error found
        if (!portfolioSnapshotInsertResult.error) {
            await updateLastSyncTime(user_id, sync_time);
        }
        // else {
        //     await revertPortfolioSnapshotSync(user_id, sync_time);
        // }

    } catch (e) {
        console.error(e);
    }
}
sync('be5f11fd-ca4a-485b-b0f5-6160c3586f48');

module.exports = {
    sync
}