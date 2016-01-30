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

var testRoute = require('./routes/index');

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
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', testRoute);

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/public/test.html');
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

wss.on('connection', function(ws) {
    url.parse(ws.upgradeReq.url, true);

    console.log('client is connected');

    ws.addEventListener('message', function(msg) {
        switch(msg.data) {
            case 'response':
                console.log('got a test message from the client!');
        }
    });

    ws.send('test');
});

// server initialization

http.on('request', app);
http.listen(5050, function() {
    var host = http.address().address;
    var port = http.address().port;

    host = host === "::" ? "localhost" : host;

    console.log('To do application is listening on %s:%s', host, port);
});

module.exports = app;
