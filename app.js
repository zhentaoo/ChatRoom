var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.get('/', function (req, res) {
//    res.sendfile('index.html');
//});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('message', function (msg) {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
});

app.set('port', process.env.PORT || 3088);

var server = http.listen(app.get('port'), function () {
    console.log('start at port:' + server.address().port);
});
