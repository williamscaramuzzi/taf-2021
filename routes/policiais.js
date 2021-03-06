var express = require("express");
var router = express.Router();
var Policial =  require("../models/Policial");
const { ensureAuthenticated } = require("../config/auth");
var Usuario = require("../models/Usuario");

router.get("/", ensureAuthenticated, function (req, res, next) {
  var estrutura = {
    cabecalho: {nome: req.user.postograd + " " + req.user.nomedeguerra,
    unidade: req.user.unidade,
    perfil: req.user.perfil},
    mensagem: {},
    dados: undefined}
    res.render('policiais', estrutura);
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
  Usuario.findOne({ where: { matricula: req.session.passport.user } }).then(um_usuário =>{
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
  var estrutura = {
    cabecalho: {nome: um_usuário.postograd + " " + um_usuário.nomedeguerra,
    unidade: um_usuário.unidade,
    perfil: um_usuário.perfil},
    mensagem: {},
    dados: undefined
};
  
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
    estrutura.dados = {
      errors,
      matriculaInput,
      postogradInput,
      nomecompletoInput,
      nomedeguerraInput,
      dataNascInput,
      unidadeInput
    }
    res.render("policiais", estrutura);
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
});


module.exports = router;
