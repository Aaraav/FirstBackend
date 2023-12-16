const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require("express-session");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('passport');
const flash=require('connect-flash');
require('dotenv').config();
const port=process.env.PORT || 3000;

const MongoDBStore = require('connect-mongodb-session')(expressSession);

console.log(process.env.MONGO_URL);

  const store = new MongoDBStore({
    uri: "mongodb+srv://aaraav:aaraav@cluster0.kyxqnj3.mongodb.net/pinterest",
    collection: 'sessions',
  });
  // Use the store further in your application




const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "hello",
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(passport.initialize());



app.use(passport.session());

// Note: Make sure that your serializeUser and deserializeUser functions are defined correctly in your usersRouter
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
