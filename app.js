const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = require('./router/shop');
const adminRouter = require('./router/admin');
const errorController = require('./controllers/error');

//Models
const User = require('./models/user');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //for css files

app.use((req, res, next) => {
  User.findById('64a3f9ee36c64c814e600fc7')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404Error);

mongoConnect(() => {
  app.listen(3000);
});
