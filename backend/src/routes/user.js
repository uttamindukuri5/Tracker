const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../model/User/users');
const { createToken } = require('../config/session');
const { sendEmail } = require('../aws/email');

const router = express.Router();

const removeConfidentialInformation = user => {
    delete user.email;
    delete user.phone;
    delete user.userId;
    delete user.password;
    return user;
}

router.post('/create', async (req, res) => {
    const { user: newUser} = req.body;
    try {
        const userExist = await User.getUserID(newUser.userId);
        console.log('USER EXIST: ', userExist);
        if (userExist === undefined) {
            bcrypt.hash(newUser.password, 10, async (err, hash) => {
                if (err)
                    return res.status(400).send({ error: err.message });
                else {
                    newUser.password = hash;
                    const isSaved = await User.saveUser(newUser);
                    if (isSaved) {
                        const isSent = await sendEmail(newUser);
                        console.log(isSent);
                        res.status(201).send({ data: 'User saved successfully' })
                    } else {
                        res.status(400).send({ error: 'something went wrong' });
                    }
                }
            });
        } else
            res.status(409).send({ error: 'User ID already taken' });
    } catch (err) {
        res.status(400).send({ error: 'User ID already exist, please choose a different User ID' });
    }
});

router.post('/login', async (req, res) => {
    const { user: authUser } = req.body;
    const user = await User.getUserID(authUser.userId);
    if (user) {
        bcrypt.compare(authUser.password, user.password, (err, result) => {
            if (err || !result)
                return res.status(401).send({ error: 'Authentication Failed' });
            else {
                const token = createToken({ id: user.id });
                return res.status(200).send({
                    message: 'Authentication Successful',
                    token
                });
            }
        });
    } else
        res.status(401).send({ error: 'Authentication Failed' });
});

router.get('/', async (req, res) => {
    let users = await User.getUsers();
    users = users.map( user => {
        removeConfidentialInformation(user);
        return {
            name: user.firstName + ' ' + user.lastName,
            team: user.team,
            track: user.track,
            id: user.id
        }
    });
    res.status(200).send({ data: users });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const user = await User.getUser(id);
    !user ? res.status(404).send({ error: 'User does not exist' }) : res.status(200).send({ data: removeConfidentialInformation(user) });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userExist = await User.getUser(id);
    if (userExist) {
        await User.deleteUser(id);
        res.status(200).send({ data: 'User has been successfully deleted' });
    } else
        res.status(404).send({ error: 'User does not exist' });
});

router.put('/forgotPassword', async (req, res) => {
    const { user } = req.body;
    console.log('USER: ', user);
    const existUser = await User.getUserID(user.userId);
    if (existUser) {
        bcrypt.hash(user.password, 10, async (err, hash) => {
            const updateUser = { ...user, id: existUser.id };
            if (err)
                return res.status(400).send({ error: err.message });
            else {
                // Update User Password
                updateUser.password = hash;
                await User.forgotPassword(updateUser);
                res.status(200).send({ data: 'User saved successfully' });
            }
        });
    } else {
        console.log(existUser);
        console.log('hello');
        res.status(404).send({ error: 'User ID does not exist' });
    }
 });

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userExist = await User.getUser(id);
    if (userExist) {
        if (userExist.userId !== user.userId) {
            const userIdExist = await User.getUserID(user.userId);
            if (userIdExist.length !== 0)
                res.status(409).send({ error: 'User ID already exist' });
            else {
                const updateUser = { id: id, previousId: userExist.userId, ...user };
                await User.updateUser(updateUser);
                res.status(200).send({ data: 'User has been successfully updated' });
            }
        }
    } else
        res.status(404).send({ error: 'User does not exist' });
});


router.post('/search', async (req, res) => {
    const { search } = req.body;
    const users = await User.searchUser(search);
    users.length === 0 ? res.status(404).send({ error: 'User does not exist' }) : res.status(200).send({ data: removeConfidentialInformation(users) });
});

module.exports = router;