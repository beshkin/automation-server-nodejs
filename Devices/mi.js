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

    // miio.device({address: ip, token: key})
    //     .then(device => {
    //         console.log('Connected to', device)
    //         device.power().then(isOn => {
    //             if (brightness) {
    //                 device.setBrightness(brightness)
    //                     .then(brightness => {
    //                         reportWeb(res, device, isOn, brightness)
    //                     })
    //                     .catch(err => console.log('Error: ', err));
    //             } else {
    //                 device.brightness()
    //                     .then(brightness => {
    //                         reportWeb(res, device, isOn, brightness)
    //                     })
    //             }
    //         }).catch(err => console.log('Error: ', err))
    //     })
    //     .catch(err => console.log('Error: ', err));
})

function reportWeb(res, device, deviceStatus = false, brightness = 0) {
    res.send({'success': true, 'device': {'status': deviceStatus, 'brightness': brightness}});

    device.destroy();
}

module.exports = app