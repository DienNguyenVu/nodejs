//export 1 class hoặc 1 method cho những class khác sài thì cú pháp là module.exports = ...
//vậy nha tui đi ăn cơm
//Thư viện hoặc file js requỉe vô thì để ở đầu trang, không để tùm lum, cho sạch code
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const validator = require('express-validator');
var app = express();

// setup views directory, view engine, etc...
app.use(cookieParser());
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true}
  ));
app.use(flash(app));
//----------------------

//-------------------
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');

var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');

const systemConfig = require('./configs/systems');


var indexRouter = require('./routes/backend/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'backend');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.systemConfig = systemConfig;
app.use(`/${systemConfig.prefixAdmin}`, indexRouter);



mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', () => {
  console.log('error');
});
db.once('open', () => {
  console.log('conected');
});




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
