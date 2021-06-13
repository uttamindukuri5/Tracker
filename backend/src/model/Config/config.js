const generateParam = require('./param');
const Action = require('../action');
const db = require('../db');

const createConfig = async config => {
    try {
        await db.put(generateparam(Action.CREATE, track)).promise();
        return true
    } catch (err) {
        console.error('SAVE CONFIG ERROR: ', err);
        return false;
    }
};

const getConfig = async branch => {
    try {
        const response = await db.get(generateParam(Action.GET, branch)).promise();
        return response.Item;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const updateConfig = async config => {
    try {
        const response = await db.update(generateParam(Action.UPDATE, config)).promsise();
        return response;
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.createConfig = createConfig;
exports.getConfig = getConfig;
exports.updateConfig = updateConfig;
