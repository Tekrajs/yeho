const formatReturnData = async (error, data, table) => {
    if (error) {
        return { data: null, error: true, message: error.message, table: table }
    }

    return { data: data, error: false, message: null, table: table };
}

const formatAccountData = async (error, data, table) => {
    if (error || !data.length) {
        return null;
    }

    let addresses = [];
    let keys = {};

    data.forEach((datum) => {
        if ('defi' === datum.account_type) {
            addresses.push(datum.wallet_address);
        } else if ('cefi' === datum.account_type) {
            let cefi_account_provider = datum.cefi_account_provider;
            keys[cefi_account_provider] = {};

            keys[cefi_account_provider]['apiKey'] = datum.api_key;
            keys[cefi_account_provider]['secret'] = datum.api_secret;
        }
    })

    return {
        keys: keys,
        addresses: addresses
    }
}


const formatPortfolioSnapshot = async (user_id, sync_time, portfolio) => {
    try {
        let formattedPortfolioSnapshot = {};

        formattedPortfolioSnapshot.user_id = user_id;
        formattedPortfolioSnapshot.timestamp = sync_time;
        formattedPortfolioSnapshot.snapshot = [portfolio];

        return formattedPortfolioSnapshot;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Prepare portfolio to store to database.
 * Portfolio table needs user_id, wallet_address, sync_time, portfolio_data, wallet_total
 *  { user_id: user_id, sync_time: sync_time, wallet_address: wallet_address, portfolio_data: portfolio_data, wallet_total: wallet_total }
 */
const formatPortfolio = async (user_id, sync_time, portfolio) => {
    try {
        let totalPortfolio = {};
        let formattedPortfolio = [];

        Object.entries(portfolio).forEach(([wallet_address, data]) => {
            let individialPortfolio = {}

            individialPortfolio.user_id = user_id;
            individialPortfolio.sync_time = sync_time;
            individialPortfolio.wallet_address = wallet_address;
            individialPortfolio.wallet_total = {};
            individialPortfolio.portfolio_data = {};

            data.forEach(datum => {
                if ('TOTAL' === datum[0]) {
                    individialPortfolio.wallet_total = datum[1];
                } else {
                    individialPortfolio.portfolio_data[datum[0]] = datum[1];
                }
            });

            if ('all' !== wallet_address) {
                formattedPortfolio.push(individialPortfolio);
            } else {
                totalPortfolio.user_id = individialPortfolio.user_id;
                totalPortfolio.sync_time = individialPortfolio.sync_time;
                totalPortfolio.total = individialPortfolio.wallet_total;
                totalPortfolio.individual_portfolio_total = individialPortfolio.portfolio_data;
            }
        });
        return { 'total': totalPortfolio, 'portfolio': formattedPortfolio };
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    formatPortfolio,
    formatPortfolioSnapshot,
    formatReturnData,
    formatAccountData,
};