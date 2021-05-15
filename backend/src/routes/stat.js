const express = require('express');

const User = require('../model/User/users');
const Track = require('../model/Tracker/track');

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
                    totalTrack: user.track
                };
                teams.push(teamData);
            }
            else {
                teams[existingTeam].totalTrack += user.track;
            }
        });

        teams.map(team => team.totalTrack = parseFloat(team.totalTrack.toFixed(2)));
        res.status(200).send({ data: teams });

    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.getUser(userId);
        if (user) {
            const trackHistory = await Track.getHistoryTrack(userId);
            let cumulativeTrack = 0;
            trackHistory.forEach(track => cumulativeTrack += track.counter);
            res.status(200).send({ data: { totalTrack: cumulativeTrack, ...trackHistory } });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'something went wrong' });
    }
});


module.exports = router;