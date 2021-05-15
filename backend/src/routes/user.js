const express = require('express');

const User = require('../model/User/users');

const router = express.Router();

const removeConfidentialInformation = user => {
    delete user.email;
    delete user.phone;
    return user;
}

router.post('/create', async (req, res) => {
    const { user: newUser} = req.body;
    try {
        const userExist = await User.getUserID(newUser.userId);
        if (userExist.length === 0) {
            const isSaved = await User.saveUser(newUser);
            isSaved ? res.status(201).send({ data: 'User saved successfully' }) : res.status(400).send({ error: 'something went wrong' });
        } else
            res.status(409).send({ error: 'User ID already taken' });
    } catch (err) {
        res.status(400).send({ error: 'User ID already exist, please choose a different User ID' });
    }
});

router.get('/', async (req, res) => {
    const users = await User.getUsers();
    users.map( user => removeConfidentialInformation(user) );
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    const userExist = await User.getUser(id);
    if (userExist) {
        if (userExist.userId !== user.userId) {
            const userIdExist = await User.getUserID(user.userId);
            if (userIdExist.length !== 0) {
                res.status(409).send({ error: 'User ID already exist' });
            } else {
                const updateUser = { id: id, previousId: userExist.userId, ...user };
                await User.updateUser(updateUser);
                res.status(200).send({ data: 'User has been successfully updated' });
            }
        }
    } else
        res.status(404).send({ error: 'User does not exist' });
})

router.post('/search', async (req, res) => {
    const { search } = req.body;
    const users = await User.searchUser(search);
    users.length === 0 ? res.status(404).send({ error: 'User does not exist' }) : res.status(200).send({ data: removeConfidentialInformation(users) });
});

module.exports = router;