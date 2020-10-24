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
        await device.find();
        await device.connect();
        let status = await device.get();

        if (action) {
            const deviceInfo = await device.set({set: action === 'on'});
            status = deviceInfo.dps[1];
        }

        device.disconnect();
        res.send({'success': true, 'device': {'status': status}});
    })();
})

app.post("/info", (req, res) => {
    const {deviceId, key} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
    });

    (async () => {
        await device.find({timeout: 20, all: false});
        const deviceFound = {
            id: device.device.gwID,
            ip: device.device.ip,
            key: device.device.key,
            version: device.device.version,
        };

        res.send({'success': true, 'device': deviceFound});
    })();
})

app.post("/discover", (req, res) => {
    const {deviceId, key} = req.body;

    const device = new TuyAPI({
        id: deviceId,
        key: key,
    });

    (async () => {
        await device.find({timeout: 20, all: true});

        res.send({'success': true, 'devices': device.foundDevices});
    })();
})

module.exports = app