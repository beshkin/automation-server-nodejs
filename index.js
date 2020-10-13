const express = require('express');
const app = express();
app.use(express.json());
const switchRoute = require('./Routes/switch')

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/switch', switchRoute)

app.listen(8001, function () {
    console.log('Listening to Port 8001');
});

