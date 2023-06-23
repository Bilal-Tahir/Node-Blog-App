const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = require('./router/shop');
const adminRouter = require('./router/admin');
const errorController = require('./controllers/error');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404Error);

app.listen(3000);
