var socket = io.connect('http://localhost:3088');
socket.on('message', function (data) {
});
$('form').submit(function () {
    socket.emit('message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.emit('join', {
    username: 'Username hehe'
});

//收到加入聊天室广播后，显示消息
socket.on('broadcast_join', function (data) {
    console.log(data.username + '加入了聊天室');
});

//收到离开聊天室广播后，显示消息
socket.on('broadcast_quit', function (data) {
    console.log(data.username + '离开了聊天室');
});

//收到别人发送的消息后，显示消息
socket.on('broadcast_say', function (data) {
    console.log(data.username + '说: ' + data.text);
});

//这里我们假设有一个文本框textarea和一个发送按钮.btn-send
//使用jQuery绑定事件
$('.btn-send').click(function (e) {
    //获取文本框的文本
    var text = $('textarea').val();
    //提交一个say事件，服务器收到就会广播
    socket.emit('say', {
        username: 'Username hehe',
        text: text
    });
});