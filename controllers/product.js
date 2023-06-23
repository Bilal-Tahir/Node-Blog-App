const products = [];

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const newProd = new Product(req.body.title);
  newProd.save();
  // products.push({ title: req.body.title });
  res.redirect('/');
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'All Products',
      path: '/',
    });
  });
};
