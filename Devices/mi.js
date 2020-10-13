const express = require('express')
let app = express.Router()
const miio = require('miio')

app.post('/power', (req, res) => {
    const {key, action, ip} = req.body;

    miio.device({address: ip, token: key})
        .then(device => {
            console.log('Connected to', device)
            if (action) {
                device.setPower(action === 'on')
                    .then(isOn => {
                        reportWeb(res, device, isOn)
                    })
                    .catch(err => console.log('Error: ', err));
            } else {
                device.power()
                    .then(isOn => {
                        reportWeb(res, device, isOn)
                    })
            }
        })
        .catch(err => console.log('Error: ', err));
})

app.post('/brightness', (req, res) => {
    const {key, action, ip, brightness} = req.body;

    miio.device({address: ip, token: key})
        .then(device => {
            console.log('Connected to', device)
            device.power().then(isOn => {
                if (brightness) {
                    device.setBrightness(brightness)
                        .then(brightness => {
                            reportWeb(res, device, isOn, brightness)
                        })
                        .catch(err => console.log('Error: ', err));
                } else {
                    device.brightness()
                        .then(brightness => {
                            reportWeb(res, device, isOn, brightness)
                        })
                }
            }).catch(err => console.log('Error: ', err))
        })
        .catch(err => console.log('Error: ', err));
})

function reportWeb(res, device, deviceStatus = false, brightness = 0) {
    res.send({'success': true, 'device': {'status': deviceStatus, 'brightness': brightness}});

    device.destroy();
}

module.exports = app