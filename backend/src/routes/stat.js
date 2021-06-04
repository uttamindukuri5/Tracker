const express = require('express');
const path = require('path');

const User = require('../model/User/users');
const Track = require('../model/Tracker/track');

const { validateToken } = require('../config/session');
const { json } = require('body-parser');

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

router.post('/upload', async (req, res) => {
    console.log(req.files);
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            const jsonFile = req.files.jsonFile;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            await jsonFile.mv(__dirname + '/../../../client/src/data/' + jsonFile.name);
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: jsonFile.name,
                    mimetype: jsonFile.mimetype,
                    size: jsonFile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;