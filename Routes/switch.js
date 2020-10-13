const express = require('express');
let app = express();
const tuya = require('../Devices/tuya')
const mi = require('../Devices/mi')

app.use('/tuya', tuya)
app.use('/mi', mi)

module.exports = app