var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
var Policial =  require("../models/Policial");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



router.get("/", ensureAuthenticated, function (req, res, next) {
  const {nomeMat} = req.query;
  console.log('acabei de entrar na route e pegar os req.query, que deu isso aqui:');
  console.log(nomeMat);
  if(nomeMat){
    //se nomeMat tem conteúdo, ou seja, é diferente de nulo, entra aqui:
    if(isNaN(nomeMat)){
      //se entrar aqui, é porque nomeMat é um "NOT A NUMBER (NaN)", ou seja, é string
      var bizudopercent = "%" + nomeMat + "%";
      //o símbolo % antes e depois do nome vai dizer ao sql que esse nome pode ter cadeias de caracteres antes e depois dele.. pode ser nome do meio, primeiro nome, sobrenome, etc
      Policial.findAll({ 
        where: { 
          [Op.or]: [{nomedeguerra: {[Op.like]: nomeMat}},{nomecompleto: {[Op.like]: bizudopercent}}]
        } 
      }).then(rows =>{
        if(!rows[0]) {
          console.log("não achou nenhum policial com os nomes informados");
          var mensagem = {error_msg: "Policial não encontrado"};
          res.render('home', mensagem);
        }
        else{
          console.log('achou esses: ', {rows});
          res.render('home', {rows});
        };
      });
    } else {
      //se entrar aqui, é porque nomeMat é possível de converter pra number
      Policial.findAll({where: {matricula: parseInt(nomeMat)}}).then(rows =>{
        console.log("findOne pela matricula INTEGER, rows deu isso aqui:");
        console.log(rows);
        if(!rows[0]) {
          var mensagem = {error_msg: "Policial não encontrado"};
          res.render('home', mensagem);
        } else{res.render('home', {rows});}
      });
    }
  } else {
    console.log("nomeMat está vazio, renderizando apenas a home inicial");
    res.render('home');
  }
});

//abaixo é o post AJAX para pesquisar nomes
router.post("/pesquisa", ensureAuthenticated, function(req, res, next){
  const mat = req.body.matricula;
  console.log("parametros sao: ", mat);
  Policial.findOne({where: {matricula: parseInt(mat)}}).then(umpolicial =>{
        console.log("findOne à partir da tabbleResultadoPesquisa, deu isso aqui:");
        console.log(umpolicial);
        var diff_ms = Date.now() - new Date(umpolicial.datadenascimento);
        var age_dt = new Date(diff_ms);  
        umpolicial.idade = Math.abs(age_dt.getUTCFullYear() - 1970);        
        res.send(umpolicial);
      });
});

router.post("/", ensureAuthenticated, function(req, res, next){
  var entrada = {postograd: "0", nomedeguerra: "0", nomecompleto: "0", matricula: req.body.matriculaspan, idade: req.body.idadespan, qtdbarras: 0, pontosbarras: 0, qtdflexao: 0, pontosflexao: 0, qtdabdominalcarl: 0, pontosabdominalcarl:0, qtdabdominalrem: 0, pontosabdominalrem: 0, qtdcorrida: 0, pontoscorrida: 0, totalpontos: 0, parecer: "0"};
  console.log("postou um taf");
  console.log(req.body);
});


//logout handle
router.get("/logout", (req, res) => {
  //com o middleware do passport, essa funcao logout pode ser chamada direto do req que o req busca no passport um jeito de encerrar a sessão
  req.logout();
  req.flash("success_msg", "Você fez logout");
  res.redirect("/");
});
module.exports = router;
