const { initSupabase } = require('../supabase-connect');
const { syncConfig } = require('../config/config');

let supabase = initSupabase();
const table = 'QFG.SyncQueue';

const getElementFromSyncQueue = async () => {
    const { data, error } = await supabase
        .from(table)
        .select()
        .neq('processing', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1)

    if (error) {
        throw new Error(error.message);
    }

    if (data.length > 0) {
        return data;
    } else {
        return false;
    }
}

const removeElementFromSyncQueue = async (user_id) => {
    await supabase
        .from(table)
        .delete()
        .match({ user_id: user_id })

    return;
}

const insertElementToSyncQueue = async (items) => {
    const { data, error } = await supabase
        .from(table)
        .upsert(
            items,
            { onConflict: 'user_id' }
        )

    if (error) {
        throw new Error(error.message);
    }

    return;
}

const markQueueElementAsProcessing = async (user_id) => {
    if (!user_id) {
        throw new Error('user_id is required');
    }

    await supabase
        .from(table)
        .update({ processing: true })
        .match({ user_id: user_id })

    return;
}

const insertEligibleUsersToSyncQueue = async () => {
    const syncIntervalMinutes = syncConfig.SYNC_INTERVAL_MINUTES;
    let table = 'QFG.Users';

    let currentDate = new Date();
    let eligibilityStartTime =
        new Date(currentDate.getTime() - syncIntervalMinutes * 60000)
            .getTime();

    const { data, error } = await supabase
        .from(table)
        .select('id, last_sync_time')
        .or('last_sync_time.is.null,last_sync_time.lte.' + eligibilityStartTime)
        .order('last_sync_time', { ascending: true })

    if (error) {
        throw new Error(error.message);
    }

    if (data.length > 0) {
        let eligibleUsers = [];
        let eligibleUser = {};
        data.forEach((item) => {
            eligibleUser = {
                user_id: item.id,
                priority: item.last_sync_time ? 0 : 1
            }
            eligibleUsers.push(eligibleUser);
            eligibleUser = {};
        });

        await insertElementToSyncQueue(eligibleUsers);
    }

    return;
}

module.exports = {
    getElementFromSyncQueue,
    removeElementFromSyncQueue,
    insertElementToSyncQueue,
    markQueueElementAsProcessing,
    insertEligibleUsersToSyncQueue
}