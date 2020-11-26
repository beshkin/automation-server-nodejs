const express = require('express')
let app = express.Router()
const TuyAPI = require('tuyapi');

app.post('/power', (req, res) => {
    const {deviceId, key, action, ip, version} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
        ip: ip,
        version: version || "3.1"
    });

    (async () => {
        try {
            await device.find();
            await device.connect();
            let status = await device.get();

            if (action) {
                const deviceInfo = await device.set({set: action === 'on'});
                status = deviceInfo.dps[1];
            }

            device.disconnect();
            res.send({'success': true, 'device': {'status': status}});
        } catch (e) {
            res.send({'success': false, 'error': e});
        }
    })();
})

app.post("/info", (req, res) => {
    const {deviceId, key} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
    });

    (async () => {
        try {
            await device.find({timeout: 20, all: false});
            const deviceFound = {
                id: device.device.gwID,
                ip: device.device.ip,
                key: device.device.key,
                version: device.device.version,
            };

            res.send({'success': true, 'device': deviceFound});
        } catch (e) {
            res.send({'success': false, 'error': e});
        }
    })();
})

app.post("/discover", (req, res) => {
    const {deviceId, key} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
    });

    (async () => {
        try {
            await device.find({timeout: 20, all: true});

            res.send({'success': true, 'devices': device.foundDevices});
        } catch (e) {
            res.send({'success': false, 'error': e});
        }
    })();
})

module.exports = app