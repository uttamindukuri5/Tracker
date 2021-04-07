const { v4: uuid } = require('uuid');

const AWS = require('../../aws/aws');
const generateParam = require('./param');
const UserAction = require('./action');
const validUser = require('./validation');

AWS.config.update({
    region: "us-east-2",
    endpoint: "http://dynamodb.us-east-2.amazonaws.com"
  });

const db = new AWS.DynamoDB.DocumentClient();

const createUser = async (newUser)  => {
    return await validUser(newUser) ? { id: uuid(), ...newUser, track: 0 } : null;
};

/**
 * Allows you to create a new user
 * @param { User OBJECT } newUser
 */
const saveUser = async (newUser) => {
    const user = await createUser(newUser);
    if (user) {
        try {
            await db.put(generateParam(UserAction.CREATE, user)).promise();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    } else {
        console.log('ERROR: Some of the information do not satisfy the requirements');
        return false;
    }
};

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
const getUser = async ( user, isId ) => {
    try {
        const response = await db.get(generateParam(UserAction.GET,  { user, isId })).promise();
        return response.Item;
    } catch (err) {
        console.log('Error');
        console.log(err);
    }
};

const deleteUser = async userId => {
    try {
        const response = await db.delete(generateParam(UserAction.GET, userId)).promise();
        console.log(response);
        return {}
    } catch (err) {
        console.log(err);
    }
};

const updateUser = async updateUser => {
    try {
        const response = await db.update(generateParam(UserAction.UPDATE, updateUser)).promise();
        console.log(response);
        return {}
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

exports.saveUser = saveUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.searchUser = searchUser;
exports.updateUser = updateUser;