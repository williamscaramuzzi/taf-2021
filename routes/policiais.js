var express = require("express");
var router = express.Router();
var Policial =  require("../models/Policial");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, function (req, res, next) {
  res.render('policiais');
});

//logout handle
router.get("/logout", (req, res) => {
  //com o middleware do passport, essa funcao logout pode ser chamada direto do req que o req busca no passport um jeito de encerrar a sessão
  req.logout();
  req.flash("success_msg", "Você fez logout");
  res.redirect("/");
});

//programação para quando submitar o cadastro de um novo policial
router.post("/", ensureAuthenticated, function(req, res, next){
   //se eu fizer const {} = req.body, eu recebo todos os parametros do body de maneira mais facil
   const {
    matriculaInput,
    postogradInput,
    nomecompletoInput,
    nomedeguerraInput,
    dataNascInput,
    sexoRadioButton, 
    unidadeInput
  } = req.body;
  //vetor de erros #boaspráticas
  var errors = [];

  //começando a validação
  if (matriculaInput.length < 7) {
    errors.push({ msg: "A matrícula deve ter pelo menos 7 dígitos" });
  }
  //checando se todos os campos foram digitados:
  if (
    !matriculaInput ||
    !postogradInput ||
    !nomecompletoInput ||
    !nomedeguerraInput ||
    !dataNascInput||
    !sexoRadioButton||
    !unidadeInput
  ) {
    errors.push({ msg: "Por favor, preencha todos os campos" });
  }
  if (errors.length > 0) {
    console.log("entrou no erros.length");
    console.error(errors);
    //se o vetor erros é maior que zero, quer dizer que temos erros
    //então eu mando o vetor pra serem mostradas as mensagens
    //é conveniente mandar tambem os dados digitados, porque o res.render recarregará a página com as mensagens
    //e o formulário ficará em branco tudo de novo
    res.render("policiais", {
      errors,
      matriculaInput,
      postogradInput,
      nomecompletoInput,
      nomedeguerraInput,
      dataNascInput,
      unidadeInput
    });
    //nao preciso passar as senhas nem o perfil, porque pra mim é interessante deixá-los em branco pro usuario digitar de novo
  } else {
    Policial.sync();
            Policial.create({
              matricula: matriculaInput,
              postograd: postogradInput,
              nomecompleto: nomecompletoInput,
              nomedeguerra: nomedeguerraInput,
              datadenascimento: dataNascInput,
              sexo: sexoRadioButton, 
              unidade: unidadeInput
            }).then(policial => {
              req.flash('success_msg', 'Registrado com sucesso');
              res.redirect("/policiais");
            }).catch(err => {
              console.log("erro ao gravar no BD: " + err);
              req.flash('error_msg', 'Já existe Policial com a matrícula informada');
              res.redirect("/policiais");
            });
  }
});


module.exports = router;
