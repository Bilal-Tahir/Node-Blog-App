const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = require('./router/shop');
const adminData = require('./router/admin');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
});

app.listen(3000);
