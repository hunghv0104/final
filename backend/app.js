var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//cors
const cors = require('cors')
//mongoose
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin')

var app = express();
//cors
app.use(cors())
mongoose.connect("mongodb+srv://hungntgch220055:zOYfUqTL8MxVD5a7@cluster0.nev9qiq.mongodb.net/gch1102")
.then(()=>console.log("ok"))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use router
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter)

//allow json format in console:
app.use(express.json())

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(5000)

module.exports = app;
