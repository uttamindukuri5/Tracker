const express = require('express');

const Track = require('../model/Tracker/track');
const User = require('../model/User/users');

const { validateToken } = require('../config/session');

const router = express.Router();

const updateUserTrack = async track => {
    try {
        const user = await User.getUser(track.userId);
        if (user) {
            const sumTrack = parseInt(track.count) + parseInt(user.track);
            await User.updateTrack(track.userId, sumTrack);
            return true;
        } else
            return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

router.post('/create', validateToken, async (req, res) => {
    const { track: newTrack } = req.body;
    const { id } = req.session;
    const newUserTrack = { userId: id, ...newTrack };
    console.log('NEW USER TRACK: ', newUserTrack);
    try {
        const isSaved = await Track.saveTrack(newUserTrack);
        if (isSaved) {
            const isUserUpdate = await updateUserTrack(newUserTrack);

            isUserUpdate ? res.status(201).send({ data: 'Successfully Inserted Track' }) : res.status(400).send({ error: 'something went wrong' });
        } else
            res.status(400).send({ error: 'Invalid Request' });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err });
    }
});

router.get('/', async (req, res) => {
    const tracks = await Track.getTracks();
    res.status(200).send({ data: tracks });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const track = await Track.getTracks(id);
    !track ? res.status(404).send({ error: 'Track does not exist' }) : res.status(200).send({ data: track });
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { track: updateTrack } = req.body;
    const trackExist = await Track.getTrack(id);
    if (trackExist) {
        const updateTrackResponse = await Track.updateTracker({ id, ...updateTrack });
        updateTrackResponse ? res.status(200).send({ data: 'User has been successfully saved' }) : res.status(400).send({ error: 'something went wrong' });
    } else
        res.status(404).send({ error: 'Track does not exist' });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const trackExist = await Track.getTrack(id);
    if (trackExist) {
        await Track.deleteTrack(id);
        res.status(200).send({ data: 'User has been successfully deleted' });
    } else
        res.status(404).send({ error: 'User does not exist' });
});

module.exports = router;