var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//passport config: avisando que vamos usar a local strategy feita na nossa pasta config
require("./config/passport")(passport);

var indexRouter = require("./routes/index");
var usuariosRouter = require("./routes/usuarios");
var homeRouter = require("./routes/home");
var policiaisRouter = require('./routes/policiais');
var tabelageralRouter = require('./routes/tabelageral');
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//express session middleware depende do cookie parser estar antes
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

//connect flash serve para mostrar mensagens QUANDO MUDAMOS DE PAGINA
//o connect-flash armazena as mensagens na SESSION e precisa ter a SESSION
//configurada antes dele
app.use(flash());

//pra poder usar as mensagens do conect flash lá no templating EJS, temos que 
//deixar as mensagens disponiveis no res.locals, pois o res.locals é o único que 
// o template-engine consegue enxergar na hora de confeccionar páginas
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
app.use("/tabelageral", tabelageralRouter);

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
