const { v4: uuid } = require('uuid');

const generateParam = require('./param');
const UserAction = require('../action');
const validate = require('../validation');
const db = require('../db');

const createUser = async (newUser)  => {
    return await validate.validUser(newUser) ? { id: uuid(), ...newUser, track: 0 } : null;
};

/**
 * Allows you to create a new user
 * @param { User OBJECT } newUser
 */
const saveUser = async newUser => {
    const user = await createUser(newUser);
    if (user) {
        try {
            await db.put(generateParam(UserAction.CREATE, user)).promise();
            return true;
        } catch (err) {
            console.log('SAVE ERROR', err);
            return false;
        }
    } else {
        console.log('ERROR: Some of the information do not satisfy the requirements');
        return false;
    }
};


const forgotPassword = async user => {
    try {
        const response = await db.update(generateParam(UserAction.UPDATE_PASSWORD, user)).promise();
        console.log(response);
        return response;
    } catch (err) {
        console.log('SAVE ERROR', err);
        return false;
    }
}

/**
 * Allows you to get all the users in the database
 */
const getUsers = async () => {
    try {
        const response = await db.scan(generateParam()).promise();
        return response.Items;
    } catch (err) {
        console.log(err);
    }
}

/**
 * Allows you to get a specific user based on the userId
 * @param string userId
 */
const getUser = async id => {
    try {
        const response = await db.get(generateParam(UserAction.GET,  id)).promise();
        return response.Item;
    } catch (err) {
        console.log('Error');
        console.log(err);
    }
};

const getUserID = async userId => {
    console.log('USER ID: ', userId);
    try {
        const response = await db.scan(generateParam(UserAction.GET_USERID, userId)).promise();
        console.log('RESPONSE USERID', response);
        return response.Items[0];
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async id => {
    try {
        const response = await db.delete(generateParam(UserAction.GET, id)).promise();
        console.log(response);
        return {}
    } catch (err) {
        console.log(err);
    }
};

const updateUser = async updateUser => {
    try {
        const response = await db.update(generateParam(UserAction.UPDATE, updateUser)).promise();
        return response;
    } catch (err) {
        console.log(err);
    }
}

const searchUser = async search => {
    try {
        const response = await db.scan(generateParam(UserAction.SEARCH, search)).promise();
        console.log(response);
        return response.Items;
    } catch (err) {
        console.log(err);
    }
}

const updateTrack = async (id, track) => {
    try {
        const response = await db.update(generateParam(UserAction.UPDATE_TRACK, { id: id, track: track })).promise();
        return response;
    } catch (err) {
        console.error(err);
    }
};

exports.saveUser = saveUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.searchUser = searchUser;
exports.updateUser = updateUser;
exports.getUserID = getUserID;
exports.updateTrack = updateTrack;
exports.forgotPassword = forgotPassword;