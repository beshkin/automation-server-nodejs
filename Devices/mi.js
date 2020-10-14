const express = require('express')
let app = express.Router()
const miio = require('miio')

app.post('/power', (req, res) => {
    const {key, action, ip} = req.body;

    (async () => {
        const device = miio.device({address: ip, token: key});
        let status = device.power();
        if (action) {
            await device.power(action === 'on');
            status = device.power();
        }
        reportWeb(res, device, status)
    })();
})

app.post('/brightness', (req, res) => {
    const {key, ip, brightness} = req.body;

    (async () => {
        const device = miio.device({address: ip, token: key});
        let status = device.power();
        let deviceBrightness = 0;
        if (status) {
            deviceBrightness = device.brightness();
            if (brightness) {
                await device.setBrightness(brightness);
                deviceBrightness = device.brightness();
            }
        }
        reportWeb(res, device, status, deviceBrightness)
    })();
})

function reportWeb(res, device, deviceStatus = false, brightness = 0) {
    res.send({'success': true, 'device': {'status': deviceStatus, 'brightness': brightness}});
    device.destroy();
}

module.exports = app