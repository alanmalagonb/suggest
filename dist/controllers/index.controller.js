"use strict";

var indexCtrl = {};

indexCtrl.renderIndex = function (req, res) {
  res.render('index');
};

module.exports = indexCtrl;