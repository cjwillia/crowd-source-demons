var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: http});

const EventEmitter = require('events');
const util = require('util');
const SUMMONING_TIME = 1000 * 60 * 3;

function SocketEmitter() {
    EventEmitter.call(this);
}

util.inherits(SocketEmitter, EventEmitter);

var socketEmitter = new SocketEmitter();

var room;

var DemonController = require('./src/demonController.js');
var SummonerController = require('./src/summonerController.js');
var RoomController = require('./src/roomController.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/client', function(req, res, next) {
    // not implemented
});

app.get('/host', function(req, res, next) {
    res.sendFile(__dirname + '/client/host.html');
});

app.get('/test', function(req, res, next) {
    res.sendFile(__dirname + '/client/test.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// websocket nonsense etc

socketEmitter.on('ritualfulfilled', function(data, ws) {
    console.log(data);
});

socketEmitter.on('createroom', function(data, ws) {
    room = new RoomController(broadcast);
    wss.clients.forEach(function(client) {
        client.send(serializeData('roomcreated', {}));
    });
});

socketEmitter.on('joingame', function(data, ws) {
    if(room) {
        var summoner = new SummonerController(data.name, ws);
        room.addSummoner(summoner);
    }
    else {
        ws.send(serializeData('noroom', {}));
    }
});

socketEmitter.on('startsummoning', function(data, ws) {
    if(room.readyToStart()) {
        var demons = makeSomeDemons();
        room.startGame(demons);
        wss.clients.forEach(function(client) {
            client.send(serializeData('gamestarted', {num_players: room.getAllSummoners.length}));
        });
    }
    else {
        ws.send(serializeData('notready', {}));
    }
});

wss.on('connection', function(ws) {
    url.parse(ws.upgradeReq.url, true);

    console.log('client is connected');

    ws.addEventListener('message', function(msg) {
        try {
            var strs = msg.data.match(/(\w+):(.*)/);
            var event_type = strs[1];
            var data = JSON.parse(strs[2]);
            socketEmitter.emit(event_type, data, ws);
        } catch (e) {
			console.error("Can't parse "+msg.data+": "+e.message);
            ws.send("HEY DON'T FUCK WITH ME! ");
        }
    });

    ws.send(serializeData('ready', {}));
});

// server initialization

http.on('request', app);
http.listen(5050, function() {
    var host = http.address().address;
    var port = http.address().port;

    host = host === "::" ? "localhost" : host;

    console.log('To do application is listening on %s:%s', host, port);
});

// et cetera

function serializeData(event_type, data) {
    return event_type + ":" + JSON.stringify(data);
}

function makeSomeDemons() {
    var d1 = new DemonController("ima demon :(", SUMMONING_TIME);
    var d2 = new DemonController("me2 wtf :(((", SUMMONING_TIME);
    return [d1, d2];
}

function broadcast(subject, body, clients) {
	clients = clients || wss.clients;
	clients.forEach(function(client) {
		client.send(serializeData(subject, body));
	});
};

module.exports = app;
