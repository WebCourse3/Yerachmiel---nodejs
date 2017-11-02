var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/views/ui.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.broadcast.emit('chat message', 'hi, new user connect');

	socket.on('disconnect', function(){
		console.log('user disconnected');
		socket.broadcast.emit('chat message', 'hi, new user disconnect');
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		var messageObj = checkOutColor(msg);
		socket.broadcast.emit('chat message', messageObj[0].message, messageObj[0].color);
	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

function checkOutColor(msg) {
	var setIndex = msg.indexOf('/setColor ');
	var startColorIndex = setIndex + 10;
	var endColorIndex = msg.indexOf(' ',startColorIndex+2);
	var color = msg.slice(startColorIndex, endColorIndex);
	var netMessage = msg.replace('/setColor ' + color + ' ', '');
	var returnMessage = [{"message": netMessage, "color": color}];

	return returnMessage;
}