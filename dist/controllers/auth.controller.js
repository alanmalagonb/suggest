"use strict";

var authCtrl = {};

var passport = require('passport');

authCtrl.renderSignIn = function (req, res, next) {
  res.render('auth/signin');
};

authCtrl.signIn = passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  badRequestMessage: 'Ingresa todos los campos.',
  failureFlash: true
});

authCtrl.logout = function (req, res, next) {
  req.logOut();
  res.redirect('/');
};

module.exports = authCtrl;