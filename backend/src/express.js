const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/user');
const trackRouter = require('./routes/track');
const statRouter = require('./routes/stat');

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(morgan('combined'));
app.use(cors());

app.use('/user', userRouter);
app.use('/track', trackRouter);
app.use('/stat', statRouter);

module.exports = app;