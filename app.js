const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const shopRouter = require('./router/shop');
const adminRouter = require('./router/admin');
const authRouter = require('./router/auth');
const errorController = require('./controllers/error');

//Models
const User = require('./models/user');

const MongoDB_URI =
  'mongodb+srv://bilaltahir:71QqCssl4FPqAhl6@cluster0.mvgvyvm.mongodb.net/?retryWrites=true&w=majority';

// Used for Mongo Db Driver
// const mongoConnect = require('./util/database').mongoConnect;

const app = express();
const store = new MongoDBStore({
  uri: MongoDB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //for css files

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// exist in the views in which they are rendered
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404Error);

// Connected through mongoDB Driver
// mongoConnect(() => {
//   app.listen(3000);
// });

//Connected through mongoose
mongoose
  .connect(MongoDB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
