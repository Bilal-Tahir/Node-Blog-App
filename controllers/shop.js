const products = [];

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll((products) => {
  //   res.render('shop/index', {
  //     prods: products,
  //     pageTitle: 'Shop ',
  //     path: '/',
  //   });
  // });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
  // Product.fetchAll((products) => {
  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'All Products',
  //     path: '/products',
  //   });
  // });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));

  // Product.findById(prodId, (product) => {
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/products',
  //   });
  // });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then((products) => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: products,
    });
  });
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       pageTitle: 'Your Cart',
  //       path: '/cart',
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedChart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCartItem(prodId)
    .then((result) => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrder().then((orders) => {
    console.log(orders);
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders: orders,
    });
  });
  // res.render('shop/orders', {
  //   pageTitle: 'Your Orders',
  //   path: '/orders',
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
