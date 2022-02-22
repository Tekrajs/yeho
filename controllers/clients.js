const { getAllClients, createClient, removeClients } = require('../models/clients');

const getClients = async (user_id) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        let clients = await getAllClients(user_id);
        return clients;
    } catch (e) {
        console.error(e);
    }
}

const saveClient = async (user_id, client_data) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        let clients = await createClient(user_id, client_data);
        
        return clients;
    } catch (e) {
        console.error(e);
    }
}

const deleteClients = async (user_id, account_ids) => {
    try {
        if (!user_id) {
            throw new Error('UserId not suppiled');
        }

        if (!account_ids) {
            throw new Error('Account ids not suppiled');
        }
        
        let accounts = await removeClients(user_id, account_ids);
        
        return accounts;
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    saveClient,
    getClients,
    deleteClients
}