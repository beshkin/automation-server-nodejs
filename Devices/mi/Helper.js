const miio = require('miio')

async function getDevices() {
    const browser = miio.browse({
        cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
    });

    const devices = [];
    browser.on('available', reg => {
        devices[reg.id] = reg
    });

    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
    return devices;
}

module.exports.getDevices = getDevices