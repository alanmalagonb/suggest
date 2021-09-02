"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _path = _interopRequireDefault(require("path"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _errorhandler = _interopRequireDefault(require("errorhandler"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _passport = _interopRequireDefault(require("passport"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _expressMysqlSession = _interopRequireDefault(require("express-mysql-session"));

var _config = _interopRequireDefault(require("./config"));

var _routes = _interopRequireDefault(require("./routes"));

var _multer = _interopRequireDefault(require("multer"));

var _handlebars = _interopRequireDefault(require("handlebars"));

require("./lib/passport");

var _helpers = require("./lib/helpers");

var _timeago = require("timeago.js");

// Initializations
var MySQLStore = (0, _expressMysqlSession["default"])(_expressSession["default"]);
var database = _config["default"].database,
    authme = _config["default"].authme,
    port = _config["default"].port;
var app = (0, _express["default"])();

var _require = require("@handlebars/allow-prototype-access"),
    allowInsecurePrototypeAccess = _require.allowInsecurePrototypeAccess; // Settings


app.set("port", port);
app.set("views", _path["default"].join(__dirname, "./views"));
app.engine(".hbs", (0, _expressHandlebars["default"])({
  defaultLayout: "main",
  layoutsDir: _path["default"].join(app.get("views"), "layouts"),
  partialsDir: _path["default"].join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: require("./lib/handlebars"),
  handlebars: allowInsecurePrototypeAccess(_handlebars["default"])
}));
app.set("view engine", ".hbs");
(0, _timeago.register)('es', _helpers.timeagoes); //Upload Images

app.use((0, _multer["default"])({
  dest: "./uploads"
}).single("image")); // Middlewares

app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"].json());
app.use((0, _expressSession["default"])({
  secret: "minecraftauthmeserver",
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use((0, _connectFlash["default"])());
app.use(_passport["default"].initialize());
app.use(_passport["default"].session()); // Global variables

app.use(function (req, res, next) {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  app.locals.user = req.user || null;
  next();
}); // Routes

app.use(_routes["default"]); // Public

app.use(_express["default"]["static"](_path["default"].join(__dirname, "public")));
app.use(_express["default"]["static"]("./uploads"));

if ("development" === app.get("env")) {
  app.use((0, _errorhandler["default"])());
}

app.get('*', function (req, res) {
  res.redirect('/');
});
var _default = app;
exports["default"] = _default;