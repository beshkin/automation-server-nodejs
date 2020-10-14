const express = require('express')
let app = express.Router()
const TuyAPI = require('tuyapi');

app.post('/power', (req, res) => {
    const {deviceId, key, action, ip} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
        ip: ip,
        version: 3.3
    });

    let deviceStatus = false;
    let stateHasChanged = false;

// Find device on network
    device.find().then(() => {
        // Connect to device
        device.connect();
    });

// Add event listeners
    device.on('connected', () => {
        console.log('Connected to device!');
    });

    device.on('disconnected', () => {
        console.log('Disconnected from device.');
    });

    device.on('error', error => {
        console.log('Error!', error);
    });

    device.on('data', data => {
        if (!stateHasChanged) {
            if (action) {
                device.set({set: action === 'on'});
            }
            device.get({dps: 1}).then(status => {
                deviceStatus = status;
                console.log(status);
            });

            // Otherwise we'll be stuck in an endless
            // loop of toggling the state.
            stateHasChanged = true;
        }
    });

// Disconnect after 10 seconds
    setTimeout(() => {
        stateHasChanged = false;
        device.disconnect();

        res.send({'success': true, 'device': {'status': deviceStatus}});
    }, 1000);
})
module.exports = app