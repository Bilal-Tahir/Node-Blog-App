const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const mailgunTransporter = require('nodemailer-mailgun-transport');

const User = require('../models/user');

const mailgunAuth = {
  auth: {
    api_key: '142211cc2127db12de0d5ea99e683897-262b213e-542a3894',
    domain: 'sandbox2a454ffdde0a4a079e2db2a1724dc805.mailgun.org',
  },
};

const transporter = nodeMailer.createTransport(mailgunTransporter(mailgunAuth));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  // Not valid bcz request is dead after sending response and values will be default
  // req.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true');
  // Session is server side and cookie is client side

  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid Credentials!');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          console.log(doMatch);
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid Credentials!');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
  // User.findById('64a582ca675f2520ed4f9e4b')
  //   .then((user) => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     req.session.save((err) => {
  //       console.log(err);
  //       res.redirect('/');
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          'error',
          'Email already exists. Please pick a different one.'
        );
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const newUser = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then((result) => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'node@bloga-app.com',
            subject: 'Signup Succeded',
            html: '<h1>You successfully signed up!</h1>',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
