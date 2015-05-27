var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dotsMap;

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
//  res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	console.log('a user connectioned');
	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
  	socket.on('dotsMap', function(msg){
  		var map = createRandomMapJSON();
    	io.emit('dotsMap', map );
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var createRandomMapJSON = function() {
  if (dotsMap != null) {
    return dotsMap;
  } else {
    dotsMap = {};
    //Draw random circle docts. //This should be given from server
    for (var i = 0; i < 100; i++) {
      dotsMap[i] = {};
      dotsMap[i]['x'] = Math.round(Math.random() * 100) % 50 - 25;
      dotsMap[i]['y']= Math.round(Math.random() * 100) % 50 - 25;
      dotsMap[i]['z'] = -0.01;
    }
    dotsMap = JSON.stringify(dotsMap);
    return dotsMap;
  }
}