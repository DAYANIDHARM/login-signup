var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

require("dotenv").config();   // Load .env FIRST

// ROUTES
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/login');

// MONGOOSE
const mongoose = require('mongoose');

// Connect to MongoDB (NO old options)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

connectDB();


var app = express();

// ---- SESSION MIDDLEWARE ----
app.use(session({
  secret: "MY_SUPER_SECRET_KEY_123456789",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,     
    maxAge: 24 * 60 * 60 * 1000  // 1 day
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', testRouter);     
app.use('/demo', indexRouter);
app.use('/users', usersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
