const { getAllManagers } = require('../models/managers');

const getManagers = async (user_id) => {
  try {
    let managers = await getAllManagers();
    return managers;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getManagers
}