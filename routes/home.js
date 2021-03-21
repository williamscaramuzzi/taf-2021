/* eslint-disable quotes */
/* eslint-disable linebreak-style */
var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
var Policial = require("../models/Policial");
const Sequelize = require('sequelize');
const { Op } = Sequelize;
var Entrada = require("../models/Entrada");
var Usuario = require("../models/Usuario");

router.get("/", ensureAuthenticated, function (req, res, next) {
  Usuario.findOne({ where: { matricula: req.session.passport.user } }).then(um_usuário => {
    const { nomeMat } = req.query;
    var estrutura = {
      cabecalho: {nome: um_usuário.postograd + " " + um_usuário.nomedeguerra,
      unidade: um_usuário.unidade,
      perfil: um_usuário.perfil},
      mensagem: {},
      dados: undefined
  };
    if (nomeMat) {
      //se nomeMat tem conteúdo, ou seja, é diferente de nulo, entra aqui:
      if (isNaN(nomeMat)) {
        //se entrar aqui, é porque nomeMat é um "NOT A NUMBER (NaN)", ou seja, é string
        var bizudopercent = "%" + nomeMat + "%";
        //o símbolo % antes e depois do nome vai dizer ao sql que esse nome pode ter cadeias de caracteres antes e depois dele.. pode ser nome do meio, primeiro nome, sobrenome, etc
        var clausula_where = { where: { nomecompleto: { [Op.like]: bizudopercent } } }
        if (um_usuário.perfil != "master") {
          console.log("perfil do usuario é diferente de master, consulta será somente para policiais de sua unidade");
          //se o usuário nao tem perfil master, poderá ver resultados somente de sua unidade, entao eu tenho que filtrar a consulta de policiais, pela UNIDADE
          clausula_where = {
            where: {
              unidade: um_usuário.unidade,
              nomecompleto: { [Op.like]: bizudopercent }
            }
          };
        }

        Policial.findAll(clausula_where).then(rows => {
          if (!rows[0]) {
            console.log("não achou nenhum policial com os nomes informados");
            
            estrutura.mensagem = { error_msg: "Policial não encontrado" };
            res.render('home', estrutura);
          }
          else {
            estrutura.dados = rows;
            res.render('home', estrutura);
          }
        }).catch(err => { console.log("erro no findOne do um_usuario") });
      } else {
        //se entrar aqui, é porque nomeMat é possível de converter pra number
        Policial.findAll({ where: { matricula: parseInt(nomeMat) } }).then(rows => {
          if (!rows[0]) {
            estrutura.mensagem = { error_msg: "Policial não encontrado" };
            res.render('home', estrutura);
          } else { 
            estrutura.dados = rows;
            res.render('home', estrutura);
           }
        });}
        } else {
          console.log("nomeMat está vazio, renderizando apenas a home inicial");
          res.render('home', estrutura);
        }});
});

// Abaixo é o post AJAX para pesquisar nomes
router.post("/pesquisa", ensureAuthenticated, function (req, res, next) {
  const mat = req.body.matricula;
  console.log("parametros sao: ", mat);
  Policial.findOne({ where: { matricula: parseInt(mat) } }).then(umpolicial => {
    console.log("findOne à partir da tabbleResultadoPesquisa, deu isso aqui:");
    console.log(umpolicial);
    var diff_ms = Date.now() - new Date(umpolicial.datadenascimento);
    var age_dt = new Date(diff_ms);
    umpolicial.idade = Math.abs(age_dt.getUTCFullYear() - 1970);
    res.send(umpolicial);
  });
});

router.post("/", ensureAuthenticated, function (req, res, next) {
  var entrada = {};
  //vamos compor o objeto entrada com as informações do nosso req.body
  entrada.ano = req.body.ano;
  entrada.semestre = req.body.semestre;
  entrada.unidade = req.body.unidade;
  entrada.matricula = req.body.matricula;
  entrada.idade = req.body.idade;
  entrada.qtdcorrida = req.body.qtdCorrida;
  entrada.pontcorrida = req.body.pontCorridaInput;
  entrada.total = req.body.total;
  entrada.parecer = req.body.parecer;
  if (req.body.barraInputText != "") {
    //se entrar aqui é porque é homem jovem que so faz barra
    entrada.qtdbarras = req.body.barraInputText;
    entrada.pontbarras = req.body.pontBarraInput;
  } else if (req.body.flexaoFemInputText != "") {
    //se entrar aqui, é porque é mulher e fez flexao
    entrada.qtdflexao = req.body.flexaoFemInputText;
    entrada.pontflexao = req.body.pontFlexaoFemInput;
  } else if (req.body.opcaoRadio == "Flexão") {
    //se entrar aqui, é porque não é homem jovem, nem mulher. Então é velho e optou por flexao
    entrada.qtdflexao = req.body.qtdFlexaoOpcao;
    entrada.pontflexao = req.body.pontFlexaoMascInput;
  } else {
    //se entrar aqui, é velho e fez barra somente!
    entrada.qtdflexao = req.body.qtdBarrasOpcao;
    entrada.pontflexao = req.body.pontBarraDosVeioInput;
  }
  if (req.body.opcaoAbdominalRadio == 'carlup') {
    entrada.qtdabdomcarl = req.body.qtdAbs;
    entrada.pontabdocarl = req.body.pontAbInput;
  } else {
    entrada.qtdabdorem = req.body.qtdAbs;
    entrada.pontabdorem = req.body.pontAbInput;
  }
  Entrada.sync();
  Entrada.create(entrada).then(entrada => {
    res.json({ mensagem: "Cadastrado com sucesso!" });
  }).catch(err => {
    console.log("imprimindo erro ao cadastrar:");
    console.log(err.name);
    if(err.name=="SequelizeUniqueConstraintError"){
      res.json({ mensagem: "Já existe um TAF cadastrado para esse PM no mesmo semestre e ano!"});
    } else {
      res.json({ mensagem: "Erro ao cadastrar!" });
    }
    
  });
});


// Logout handle
router.get("/logout", (req, res) => {
  //  Com o middleware do passport, essa funcao logout pode ser chamada direto do req que o req busca no passport um jeito de encerrar a sessão
  req.logout();
  req.flash("success_msg", "Você fez logout");
  res.redirect("/");
});
module.exports = router;
