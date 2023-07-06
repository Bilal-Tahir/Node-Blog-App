exports.getLogin = (req, res, next) => {
  const isLoggedIn =
    req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // Not valid bcz request is dead after sending response and values will be default
  // req.isLoggedIn = true;

  // res.setHeader('Set-Cookie', 'loggedIn=true');
  // Session is server side and cookie is client side

  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
