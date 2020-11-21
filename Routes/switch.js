const express = require('express');
let app = express();
const tuya = require('../Devices/tuya')
const mi = require('../Devices/mi')
const micloud = require('../Devices/micloud')

app.use('/tuya', tuya)
app.use('/mi', mi)
app.use('/micloud', micloud)

module.exports = app