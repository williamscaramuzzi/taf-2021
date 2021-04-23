/* eslint-disable no-console */
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
  {
    const { nomeMat } = req.query;
    var estrutura = {
      cabecalho: {nome: req.user.postograd + " " + req.user.nomedeguerra,
      unidade: req.user.unidade,
      perfil: req.user.perfil},
      error_msg: "",
      dados: undefined
  };
    if (nomeMat) {
      //se nomeMat tem conteúdo, ou seja, é diferente de nulo, entra aqui:
      if (isNaN(nomeMat)) {
        //se entrar aqui, é porque nomeMat é um "NOT A NUMBER (NaN)", ou seja, é string
        var bizudopercent = "%" + nomeMat + "%";
        //o símbolo % antes e depois do nome vai dizer ao sql que esse nome pode ter cadeias de caracteres antes e depois dele.. pode ser nome do meio, primeiro nome, sobrenome, etc
        var clausula_where = { where: { nomecompleto: { [Op.like]: bizudopercent } } }
        if (req.user.perfil != "Master") {
          console.log("perfil do usuario é diferente de master, consulta será somente para policiais de sua unidade");
          //se o usuário nao tem perfil master, poderá ver resultados somente de sua unidade, entao eu tenho que filtrar a consulta de policiais, pela UNIDADE
          clausula_where = {
            where: {
              unidade: req.user.unidade,
              nomecompleto: { [Op.like]: bizudopercent }
            }
          };
        }

        Policial.findAll(clausula_where).then(rows => {
          if (!rows[0]) {
            console.log("não achou nenhum policial com os nomes informados");
            estrutura.error_msg = "Nenhum policial encontrado";
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
            estrutura.error_msg = "Matrícula não encontrada";
            res.render('home', estrutura);
          } else { 
            estrutura.dados = rows;
            res.render('home', estrutura);
           }
        });}
        } else {
          
          res.render('home', estrutura);
        }}
});

// Abaixo é o post AJAX que recebe o seguinte:
//eu pesquiso um nome ou matricula.... a tabela mostra varios resultados..
//eu seleciono um policial e, via AJAX, esse post aqui de baixo recebe a matricula de quem eu selecionei
router.post("/pesquisa", ensureAuthenticated, function (req, res, next) {
  const mat = req.body.matricula;
  console.log("parametros sao: ", mat);
  Policial.findOne({ where: { matricula: parseInt(mat) } }).then(umpolicial => {
    
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
  entrada.nome = req.body.nome;
  entrada.sexo = req.body.sexo;
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
    entrada.qtdbarras = req.body.qtdBarrasOpcao;
    entrada.pontbarras = req.body.pontBarraDosVeioInput;
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
