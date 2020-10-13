const express = require('express');
let app = express();
const tuya = require('../Devices/tuya')

app.use('/tuya', tuya)

module.exports = app