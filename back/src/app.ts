const express = require('express');

// @ts-ignore
const app = express();

app.use(express.static('../front/dist'));

module.exports = app;