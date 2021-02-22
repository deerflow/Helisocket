const express = require('express');

const app = express();

app.use(express.static('../front/dist'));

module.exports = app;