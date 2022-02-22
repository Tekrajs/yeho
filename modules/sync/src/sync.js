const cron = require('node-cron');
const { sync } = require('./index');

const {
    getElementFromSyncQueue,
    removeElementFromSyncQueue,
    markQueueElementAsProcessing,
    insertEligibleUsersToSyncQueue
} = require('./helpers/sync-helpers');

// Sync from queue
cron.schedule('* * * * *', async function () {
    try {
        let queueItem = await getElementFromSyncQueue();
        if (queueItem) {
            let user_id = queueItem[0].user_id;
            console.log('Running sync from queue');
            console.log(queueItem);
            await markQueueElementAsProcessing(user_id);
            await sync(user_id);
            await removeElementFromSyncQueue(user_id);
        } else {
            console.log('No queue item found');
        }
    } catch (e) {
        console.log(e);
    } finally {
        await removeElementFromSyncQueue(user_id);
    }
});

// Update queue
cron.schedule('* * * * *', async function () {
    await insertEligibleUsersToSyncQueue();
});
