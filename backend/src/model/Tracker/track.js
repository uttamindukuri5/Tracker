const { v4: uuid } = require('uuid');

const generateParam = require('./param');
const Action = require('../action');
const validate = require('../validation');
const db = require('../db');
const { response } = require('../../express');

const createTrack = track => {
    return validate.validTrack(track.count) ? { id: uuid(), ...track, date: getDate(track.date) } : null;
}

const getDate = date => date ? Date.parse(date) : Date.now();

const saveTrack = async newTrack => {
    const track = createTrack(newTrack);
    if (track) {
        try {
            await db.put(generateParam(Action.CREATE, track)).promise();
            return true;
        } catch (err) {
            console.error('SAVE TRACK ERROR: ', err);
            return false;
        }
    } else {
        console.log('ERROR: Some of the information do not satisfy the requirments');
        return false;
    }
};

const getTracks = async ()  => {
    try {
        const response = await db.scan(generateParam()).promise();
        return response.Items;
    } catch (err) {
        console.error(err);
    }
};

const getTrack = async id => {
    try {
        const response = await db.get(generateParam(Action.GET, id)).promise();
        return response.Item;
    } catch (err) {
        console.error(err);
    }
};

const getHistoryTrack = async userId => {
    try {
        const response = await db.scan(generateParam(Action.GET_USERID, userId)).promise();
        return response.Items;
    } catch (err) {
        console.error(err);
    }
}

const updateTracker = async track => {
    try {
        const response = await db.update(generateParam(Action.UPDATE, track)).promise();
        return response;
    } catch (err) {
        console.error(err);
    }
};

const deleteTrack = async id => {
    try {
        const response = await db.delete(generateParam(Action.GET, id)).promise();
        return response;
    } catch (err) {
        console.error(response);
    }
}

exports.saveTrack = saveTrack;
exports.getTracks = getTracks;
exports.getTrack = getTrack;
exports.updateTracker = updateTracker;
exports.deleteTrack = deleteTrack;
exports.getHistoryTrack = getHistoryTrack;