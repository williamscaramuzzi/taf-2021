var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
var Usuario = require("../models/Usuario");
var Entrada = require("../models/Entrada")

router.get("/", ensureAuthenticated, function (req, res, next) {
    //pra renderizar o cabeçalho, que é um layout partial do EJS, eu sempre quero que apareça o nome de quem está usando
    //então a cada requisição, como passou pelo PASSPORT, a função deserializeUser já pega o usuário logado DO BANCO, 
    //e armazena pra mim em req.user
    
    var estrutura = {
      cabecalho: {nome: req.user.postograd + " " + req.user.nomedeguerra,
      unidade: req.user.unidade,
      perfil: req.user.perfil},
      mensagem: {},
      dados: undefined}

    Entrada.findAll().then(rows => {
        if (!rows[0]) {
          console.log("não achou nenhum policial com os nomes informados");
          
          estrutura.mensagem = { error_msg: "Nenhuma entrada de TAF encontrada no BD" };
          res.render('tabelageral', estrutura);
        }
        else {
          estrutura.dados = rows;
          res.render('tabelageral', estrutura);
        }
      }).catch(err => { console.log("erro no findOne do um_usuario") });

    
  });

module.exports = router;