var moment = require('moment-timezone');
const { initSupabase } = require('../supabase-connect');

let supabase = initSupabase();

// /**
//  * Get daily PNL based on timezone
//  * @param {string} timezone
//  * @param {int} user_id
//  * @returns json
//  */
// const getTotalDailyPNL = async (user_id, timezone = 'Pacific/Kiritimati') => {
//     try {
//         if (!user_id) {
//             throw new Error('UserId not suppiled');
//         }

//         const table = 'QFG.TotalPortfolio';

//         //get the UTC day start time for supplied timezone
//         const startTime = moment.tz(timezone).startOf('day').utc();

//         let portfolioTotalFromDayStart = supabase
//             .from(table)
//             .select()



//     } catch (e) {
//         console.error(e);
//     }
// }

/**
 * Get latest portfolio from database
 * @param {int} user_id
 * @returns json
 */
const getPortfolio = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Portfolio';

        //get the UTC day start time for supplied timezone
        const sync_time = await getLastSyncTimestamp(user_id);

        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('user_id', user_id)
            .eq('sync_time', sync_time)

        if (error) {
            throw new Error('Error getting portfolio from database.');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get latest portfolio total from database
 * @param {int} user_id
 * @returns json
 */
const getPortfolioTotal = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.TotalPortfolio';

        const sync_time = await getLastSyncTimestamp(user_id);

        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('user_id', user_id)
            .eq('sync_time', sync_time)

        if (error) {
            throw new Error('Error getting portfolio total from database.');
        }

        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get the latest portfolio snapshot from database
 * @param {int} user_id
 * @returns json
 */
const getPortfolioSnapshot = async (user_id, getFirstSnapshotOfDay = false) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.PortfolioSnapshot';
        const sync_time = await getLastSyncTimestamp(user_id);

        let query = supabase
            .from(table)
            .select('snapshot, timestamp')
            .eq('user_id', user_id)


        if (!getFirstSnapshotOfDay) {
            query = query.eq('timestamp', sync_time)
        } else {
            let startOfDay = sync_time - (sync_time % 86400);
            query = query.gte('timestamp', startOfDay)
                .lt('timestamp', sync_time)
                .order('id', { ascending: true })
                .limit(1)
        }

        const { data, error } = await query

        if (error) {
            throw new Error('Error getting portfolio from database.');
        }
        return data[0];
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get the all portfolio snapshot from database
 * @param {int} user_id
 * @returns json
 */
const getAllPortfolioSnapshot = async (user_id, filter = false) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.PortfolioSnapshot';
        const sync_time = await getLastSyncTimestamp(user_id);

        let query = supabase
            .from(table)
            .select('snapshot, timestamp')
            .eq('user_id', user_id)
            .not('timestamp', 'eq', sync_time)

        if (filter && filter > 1) {
            query = query.gte('timestamp', filter)
        }

        const { data, error } = await query

        if (error) {
            throw new Error('Error getting portfolio from database.');
        }
        console.log(data);
        return data;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get last sync timestamp
 * @param {int} user_id
 * @returns int
 */
const getLastSyncTimestamp = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        const table = 'QFG.Users';

        const { data, error } = await supabase
            .from(table)
            .select('last_sync_time')
            .eq('id', user_id)

        if (error) {
            throw new Error('Error fetching last_sync_timestamp from database.');
        }

        let last_sync_time = data[0].last_sync_time;
        return last_sync_time;
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    // getTotalDailyPNL,
    getAllPortfolioSnapshot,
    getPortfolioSnapshot,
    getPortfolio,
    getPortfolioTotal,

}