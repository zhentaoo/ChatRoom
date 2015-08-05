/**
 * Created by leo on 2015/8/5.
 */
var connectionList = {};

var socketId = 1;
var socket = 'asdfasd';
connectionList[socketId] = {
    socket: socket
};
console.log(connectionList);

socketId = undefined;
socket=undefined;
setTimeout( function () {
    console.log(connectionList);
    console.log(socketId);
},1000);
