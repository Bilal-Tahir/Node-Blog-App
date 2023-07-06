const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const shopRouter = require('./router/shop');
const adminRouter = require('./router/admin');
const errorController = require('./controllers/error');

//Models
const User = require('./models/user');

// Used for Mongo Db Driver
// const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //for css files

app.use((req, res, next) => {
  User.findById('64a582ca675f2520ed4f9e4b')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404Error);

// Connected through mongoDB Driver
// mongoConnect(() => {
//   app.listen(3000);
// });

//Connected through mongoose
mongoose
  .connect(
    'mongodb+srv://bilaltahir:71QqCssl4FPqAhl6@cluster0.mvgvyvm.mongodb.net/?retryWrites=true&w=majority'
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: 'Test User',
          email: 'test.user@gmail.com',
          cart: {
            items: [],
          },
        });
        newUser.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
