var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var project = require('./routes/project');
var bid = require('./routes/bid');

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.use(session({
    cookieName: 'session',
    secret: 'qwe567fghb567y6tyghi98yhun98hu7675rfrtvuyhj',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,
    resave: false,
    saveUninitialized:true}));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


const staticFiles = express.static(path.join(__dirname, '../client/build'))
app.use(staticFiles)

app.use('/', index);
app.use('/users', users);
app.use('/project', project);
app.use('/bid', bid);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('/*', staticFiles);

const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Listening on port`, PORT);
  });

module.exports = app;
