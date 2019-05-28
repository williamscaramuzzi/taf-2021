var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var Sequelize = require("sequelize");
const conexaoBD = new Sequelize("tafdb", "root", "Ar0j4dkq", {
  dialect: "mysql"
});
//passport config: avisando que vamos usar a local strategy feita na nossa pasta config
require("./config/passport")(passport);

var indexRouter = require("./routes/index");
var usuariosRouter = require("./routes/usuarios");
var homeRouter = require("./routes/home");
var policiaisRouter = require('./routes/policiais');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//express session middleware
app.use(
  session({
    secret: "1q2w3e4r5t6y",
    resave: false,
    saveUninitialized: true
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash serve para mostrar mensagens QUANDO MUDAMOS DE PAGINA COM RES.REDIRECT
//PORQUE ESSA BOSTA DE REDIRECT NÃO PASSA OBJETO JUNTO, SÓ REDIRECIONA
app.use(flash());

//pra essa bagaça do flash funcionar
//eu tenho que criar uma variavel global que sempre será
//acessível independente de qual view você esteja
//essa variavel global é o res.locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", indexRouter);
app.use("/usuarios", usuariosRouter);
app.use("/home", homeRouter);
app.use("/policiais", policiaisRouter);

// catch 404 and forward to error handler
/**app.use(function(req, res, next) {
  next(createError(404));
}); */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
