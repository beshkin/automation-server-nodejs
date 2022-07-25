const miio = require('miio')

async function getDevices() {
    const browser = miio.devices({
        cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    const devices = [];
    browser.on('available', reg => {
        devices.push({id: reg.id.toString(), ip: reg.address})
    });
    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    browser.stop()
    return devices;
}

module.exports.getDevices = getDevices