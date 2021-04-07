const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const userRouter = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());

app.use('/user', userRouter);

module.exports = app;