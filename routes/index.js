var express = require('express');
var router = express.Router();
const passport = require("passport");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

//se clicar em entrar na tela de login:
router.post('/', (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    badRequestMessage: 'Preencha todos os campos',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
