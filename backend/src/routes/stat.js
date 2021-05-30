const express = require('express');

const User = require('../model/User/users');
const Track = require('../model/Tracker/track');

const { validateToken } = require('../config/session');

const router = express.Router();


router.get('/teams', async (req, res) => {
    try {
        const users = await User.getUsers();
        const teams = [];
        users.map(user => {
            const existingTeam = teams.findIndex(team => team.teamName === user.team);
            if (existingTeam === -1) {
                const teamData = {
                    teamName: user.team,
                    totalTrack: user.track,
                    participants: 1
                };
                teams.push(teamData);
            }
            else {
                teams[existingTeam].totalTrack += user.track;
                teams[existingTeam].participants += 1;
            }
        });

        teams.map(team => team.totalTrack = parseFloat(team.totalTrack.toFixed(2)));
        res.status(200).send({ data: teams });

    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

router.get('/history', validateToken, async (req, res) => {
    const { id } = req.session;
    try {
        const user = await User.getUser(id);
        if (user) {
            const trackHistory = await Track.getHistoryTrack(id);
            let cumulativeTrack = 0;
            trackHistory.forEach(track => cumulativeTrack += track.counter);
            res.status(200).send({ data: { totalTrack: cumulativeTrack, history: trackHistory } });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'something went wrong' });
    }
});


module.exports = router;