var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
var Usuario = require("../models/Usuario");
var Entrada = require("../models/Entrada")
const Sequelize = require('sequelize');
const { Op } = Sequelize;

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
      var {listaAno, listaSemestre, listaSexo} = req.query;
      //se for um acesso somente à página tabelageral, esse acesso se dará pelo método get sem parâmetros, portanto listaAno, listaSemestre e listaSexo serão null
      if(listaAno==undefined) res.render('tabelageral', estrutura);
      else {
        //req.query tem parâmetros, vamos iniciar a pesquisa nas entradas de TAF
        
        var clausula_where = { where: {
          ano: listaAno,
          semestre: listaSemestre,
          sexo: listaSexo
        }}
        if(listaAno=="todos") clausula_where.where.ano = { [Op.like]: "20%" };
        if(listaSemestre=="todos") clausula_where.where.semestre = { [Op.like]: "%semestre" };
        if(listaSexo=="ambos") clausula_where.where.sexo = { [Op.like]: "%ino" };
        Entrada.findAll(clausula_where).then(rows => {
          if (!rows[0]) {
            console.log("não achou nenhum TAF com os filtros informados");
            
            estrutura.mensagem = { error_msg: "Nenhuma entrada de TAF encontrada no BD" };
            res.render('tabelageral', estrutura);
          }
          else {
            estrutura.dados = rows;
            res.render('tabelageral', estrutura);
          }
        }).catch(err => { console.log("erro no findOne do um_usuario") });
      }
     
      

    

    
  });
  router.post("/", ensureAuthenticated, function(req, res, next){
    
  });

module.exports = router;