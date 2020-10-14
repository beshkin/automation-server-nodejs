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
module.exports = app