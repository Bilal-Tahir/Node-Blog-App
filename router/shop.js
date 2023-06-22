const path = require('path');

const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));

  // we have defined template engine pug in app.js
  // we have defined default folder of views where files are present
  res.render('shop', {
    prods: adminData.products,
    pageTitle: 'All Products',
    path: '/',
    // hasProduct: adminData.products.length > 0, // hbs
    // productCss: true,  // hbs
    // activeShop: true, // hbs
  });
});

module.exports = router;
