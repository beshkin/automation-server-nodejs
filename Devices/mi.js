const express = require('express')
let app = express.Router()
const miio = require('miio')

app.post('/power', (req, res) => {
    const {key, action, ip} = req.body;

    (async () => {
        const device = await miio.device({address: ip, token: key});
        let status = await device.power();
        if (action) {
            await device.power(action === 'on');
            status = await device.power();
        }
        reportWeb(res, device, status)
    })();
})

app.post('/brightness', (req, res) => {
    const {key, action, ip, brightness} = req.body;

    (async () => {
        const device = await miio.device({address: ip, token: key});
        let status = await device.power();
        let deviceBrightness = 0;
        if (status) {
            deviceBrightness = await device.brightness();
            if (brightness) {
                await device.setBrightness(brightness);
                deviceBrightness = await device.brightness();
            }
        }
        reportWeb(res, device, status, deviceBrightness)
    })();
})

app.post("/discover", (req, res) => {
    const browser = miio.browse({
        cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    const devices = {};
    browser.on('available', reg => {
        devices[reg.id] = reg
    });
    setTimeout(() => { res.send({'success': true, 'devices': devices}); }, 2000);

})

function reportWeb(res, device, deviceStatus = false, brightness = 0) {
    device.destroy();
    res.send({'success': true, 'device': {'status': deviceStatus, 'brightness': brightness}});
}

module.exports = app