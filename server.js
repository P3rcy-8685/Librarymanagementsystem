var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var con  = require('./lib/db');
var authRouter = require('./routes/auth'); 
var ad=require('./routes/admin')
var app = express();
var userroutes=require('./routes/user')
require("dotenv").config()

con.connect(function(err){
  if (err) throw err;
});
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('htmle', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:process.env.secret,
  saveUninitialized:true,
  cookie:{maxAge:1000*60*60*12},
  resave:false
}))
app.use(flash());
app.use(expressValidator()); 
app.use('/auth', authRouter);
app.use('/admin',ad)
app.use('/userroutes',userroutes)

app.listen(3000, function () {
  console.log('Node app is running on port 3000');
});
module.exports = app;