const express = require('express');
let app = express();
const tuya = require('../Devices/tuya')
const mi = require('../Devices/mi')
const aqara = require('../Devices/aqara')

app.use('/tuya', tuya)
app.use('/mi', mi)
app.use('/aqara', aqara)

module.exports = app