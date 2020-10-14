# Home automation server

This is a simple node.js server, which allows managing TUYA devices via POST requests.
## Installation
Obtain the project
```shell script
$ git pull https://github.com/beshkin/automation-server-nodejs.git
```
Install dependences
```shell script
$ npm install
```
Start server
```shell script
$ npm run start
```
If you want to run the server as a service, I suggest using ``pm2``
Install PM2

```shell script
$ npm install pm2 -g
```
Start an application

```shell script
$ pm2 start app.js
```

Listing all running processes:

```shell script
$ pm2 list
```
It will list all process. You can then stop / restart your service by using ID or Name of the app with following command.

```shell script
$ pm2 stop all
```
```shell script
$ pm2 stop 0
```
```shell script
$ pm2 restart all
```

## Usage
### TUYA
Switch on/off Tuya device.
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"deviceId":"DEVICE_ID","key":"DEVICE_KEY","ip":"DEVICE_IP", "action":"[off|on]"}' \
  http://localhost:8001/switch/tuya/power
```

Get Tuya device status
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"deviceId":"DEVICE_ID","key":"DEVICE_KEY","ip":"DEVICE_IP"' \
  http://localhost:8001/switch/tuya/power
```

### Mi
Switch on/off Mi device
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"DEVICE_KEY","ip":"DEVICE_IP", "action":"[off|on]"}' \
  http://localhost:8001/switch/mi/power
```
Get Mi device status
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"DEVICE_KEY","ip":"DEVICE_IP"' \
  http://localhost:8001/switch/mi/power
```
Set brightness for Mi lamps
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"DEVICE_KEY","ip":"DEVICE_IP","brightness":100}' \ 
  http://localhost:8001/switch/mi/brightness
```
Get brightness for Mi lamps
```shell script
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"key":"DEVICE_KEY","ip":"DEVICE_IP"}' \ 
  http://localhost:8001/switch/mi/brightness
```