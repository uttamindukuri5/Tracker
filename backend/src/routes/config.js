const express = require('express');

const Config = require('../model/Config/config');

const router = express.Router();

router.post('/create', async (req, res) => {
    const { config } = req.body;

    try {
        const isSaved = await Config.createConfig(config);
        isSaved ? res.status(201).send({ data: 'Successfully Inserted Config' }) : res.status(400).send({ error: 'something went wrong' });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: err });
    }
});

router.get('/:branch', async (req, res) => {
    const { branch } = req.params;
    const config = await Config.getConfig(branch);
    config ? res.status(200).send({ data: config }) : res.status(404).send({ error: 'branch does not exist' });
});

router.put('/:branch', async (req, res) => {
    const { config } = req.body;
    const { branch } = req.params;

    const branchExist = await Config.getConfig(branch);
    if (branchExist) {
        const updateConfig = await Config.updateConfig({ branch, ...config });
        updateConfig ? res.status(200).send({ data: 'Config has been updated' }) : res.status(400).send({ error: 'something went wrong' });
    } else {
        res.status(404).send({ error: 'Branch does not exist' });
    }
});

module.exports = router;