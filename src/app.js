import express from "express";
import morgan from "morgan";
import path from "path";
import exphbs from "express-handlebars";
import errorHandler from "errorhandler";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import expressMySQLSession from "express-mysql-session";
import config from "./config";
import routes from "./routes";
import multer from "multer";
import Handlebars from "handlebars";
import "./lib/passport";
import { timeagoes } from "./lib/helpers";
import { register } from "timeago.js";

// Initializations
const MySQLStore = expressMySQLSession(session);
const { database, authme, port } = config;
const app = express();
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

// Settings

app.set("port", port);
app.set("views", path.join(__dirname, "./views"));
app.engine(
    ".hbs",
    exphbs({
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
        helpers: require("./lib/handlebars"),
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);
app.set("view engine", ".hbs");
register('es', timeagoes);

//Upload Images
app.use(multer({ dest: "./uploads" }).single("image"));

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: "minecraftauthmeserver",
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore(database),
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    app.locals.message = req.flash("message");
    app.locals.success = req.flash("success");
    app.locals.error = req.flash("error");
    app.locals.user = req.user || null;
    next();
});

// Routes
app.use(routes);

// Public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("./uploads"));

if ("development" === app.get("env")) {
    app.use(errorHandler());
}

app.get('*', function(req, res) {
    res.redirect('/');
});

export default app;