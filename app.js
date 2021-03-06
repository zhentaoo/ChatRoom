var express = require('express');
var app = express();

var server = require('http').createServer(app);
server.listen(3088);

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    res.send('index.html');
});

/**
 * 发送给当前客户端
 * socket.emit('message', "this is a test");
 *
 * 发送给所有客户端，除了当前客户端
 * socket.broadcast.emit('message', "this is a test");
 *
 * 发送给在game房间里的所有用客户端，除了当前客户端
 * socket.broadcast.to('game').emit('message', 'nice game');
 *
 * 发送给所有客户端
 * io.sockets.emit('message', "this is a test");
 *
 * 发送给在game房间里的有所客户端
 * io.sockets.in('game').emit('message', 'cool game');
 *
 * 发送给socketid这个客户端消息
 * io.sockets.socket(socketid).emit('message', 'for your eyes only');
 */

var connectionList = {};
/*io.sockets.on函数接受字符串'connection'作为客户端发起连接的事件，当连接成功后，调用带有socket参数的回调函数*/
io.sockets.on('connection', function (socket) {
    /*当客户端连接时：保存socketId*/
    var socketId = socket.id;
    connectionList[socketId] = {
        socket: socket
    };
    console.log(socket);

    /*用户进入聊天室时：sending to all clients except sender*/
    socket.on('join', function (data) {
        socket.broadcast.emit('broadcast_join', data);
        connectionList[socketId].username = data.username;
    });

    //用户离开聊天室事件，向其他在线用户广播其离开
    socket.on('disconnect', function () {
        if (connectionList[socketId].username) {
            socket.broadcast.emit('broadcast_quit', {
                username: connectionList[socketId].username
            });
        }
        delete connectionList[socketId];
    });

    //用户发言事件，向其他在线用户广播其发言内容
    socket.on('say', function (data) {
        socket.broadcast.emit('broadcast_say', {
            username: connectionList[socketId].username,
            text: data.text
        });
    });

    /*emit:交（发出）一个事件（事件名称用字符串表示），事件名称可以自定义，也有一些默认的事件名称，紧接着是一个对象，表示向该socket发送的内容*/
    io.sockets.emit('message', 'new user coming');

    /*on:接收一个事件（事件名称用字符串表示），紧接着是收到事件调用的回调函数，其中data是收到的数据*/
    socket.on('message', function (data) {
        io.sockets.emit('message', data);
    });

});