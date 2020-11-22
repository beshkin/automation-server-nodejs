const express = require('express')
const {withLightEffect} = require("node-mihome/lib/utils");
let app = express.Router()
const mihome = require('node-mihome');

// countries 'ru', 'us', 'tw', 'sg', 'cn', 'de' (Default: 'cn')

app.post('/power', (req, res) => {
    const {deviceId, country, username, password, action} = req.body;

    (async () => {
        await mihome.miCloudProtocol.login(username, password);
        const options = {country};

        let deviceStatus = false

        try {
            if (action) {
                const response = await mihome.miCloudProtocol.miioCall(deviceId, 'set_power', withLightEffect(action), options);
                if (response[0] === 'ok') {
                    deviceStatus = action === 'on';
                }
            } else {
                // works only with CN server
                const response = await mihome.miCloudProtocol.miioCall(deviceId, 'get_prop', ['power'], options);
                deviceStatus = response !== undefined ? response[0] === 'on' : false;
            }
        } catch (e) {
            console.log(e)
        }


        await mihome.miCloudProtocol.logout()
        reportWeb(res, deviceStatus)
    })();
})


app.post('/brightness', (req, res) => {
    let {deviceId, country, username, password, brightness} = req.body;
    (async () => {

        await mihome.miCloudProtocol.login(username, password);
        const options = {country};

        try {
            if (brightness) {
                const response = await mihome.miCloudProtocol.miioCall(deviceId, 'set_bright', [parseInt(brightness)], options);
                if (response[0] !== 'ok') {
                    brightness = 0;
                }
            } else {
                // works only with CN server
                const response = await mihome.miCloudProtocol.miioCall(deviceId, 'get_prop', ['bright'], options);
                brightness = response[0] || 0;
            }
        } catch (e) {
            console.log(e)
        }

        await mihome.miCloudProtocol.logout()
        reportWeb(res, true, brightness)
    })();
})

app.post("/discover", (req, res) => {
    const {deviceId, country, username, password} = req.body;

    let devices = [];
    (async () => {
        await mihome.miCloudProtocol.login(username, password);
        const options = {country};

        if (deviceId) {
            devices.push(await mihome.miCloudProtocol.getDevice(deviceId, options))
        } else {
            devices = await mihome.miCloudProtocol.getDevices(null, options)
        }

        await mihome.miCloudProtocol.logout()
        res.send({'success': true, 'devices': devices});
    })();
})

function reportWeb(res, deviceStatus = false, brightness = 0) {
    res.send({'success': true, 'device': {'status': deviceStatus, 'brightness': brightness}});
}

module.exports = app