var express = require("express");
var router = express.Router();
var Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { ensureAuthenticated } = require("../config/auth");

/* GET users listing. */
router.get("/", ensureAuthenticated, function (req, res, next) {
  res.render('usuarios');
});

//programação para quando alguem vai se registrar:
router.post("/", function (req, res, next) {
  //se eu fizer const {} = req.body, eu recebo todos os parametros do body de maneira mais facil
  const {
    matriculaInput,
    postogradInput,
    nomecompletoInput,
    nomedeguerraInput,
    unidadeInput,
    senhaInput,
    confirmeSenhaInput,
    perfilList
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
    !senhaInput ||
    !confirmeSenhaInput ||
    !nomecompletoInput ||
    !nomedeguerraInput ||
    !unidadeInput
  ) {
    errors.push({ msg: "Por favor, preencha todos os campos" });
  }
  //checando se as duas senhas informadas são iguais
  if (senhaInput !== confirmeSenhaInput) {
    errors.push({ msg: "A confirmação de senha não confere" });
  }
  //checando se as duas senhas tem pelo menos 6 caracteres
  if (senhaInput.length < 6 || confirmeSenhaInput.length < 6) {
    errors.push({ msg: "A senha deve ter pelo menos 6 caracteres" });
  }

  if (errors.length > 0) {
    console.log("entrou no erros.length");
    //se o vetor erros é maior que zero, quer dizer que temos erros
    //então eu mando o vetor pra serem mostradas as mensagens
    //é conveniente mandar tambem os dados digitados, porque o res.render recarregará a página com as mensagens
    //e o formulário ficará em branco tudo de novo
    res.render("usuarios", {
      errors,
      matriculaInput,
      postogradInput,
      nomecompletoInput,
      nomedeguerraInput,
      unidadeInput
    });
    //nao preciso passar as senhas nem o perfil, porque pra mim é interessante deixá-los em branco pro usuario digitar de novo
  } else {
    Usuario.findOne({ where: { matricula: matriculaInput } }).then(rows => {
      if (rows) {
        errors.push({
          msg: "Já existe um usuário cadastrado com essa matrícula"
        });
        res.render("usuarios", {
          errors,
          matriculaInput,
          postogradInput,
          nomecompletoInput,
          nomedeguerraInput,
          unidadeInput
        });
      } else if (!rows) {
        //fazer o hash do password
        //precisamos gerar o salt que é um pedaço de string cheio de caracteres especiais, que é adicionado na senha, pra aí sim fazer o calculo do hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(senhaInput, salt, (err, hash) => {
            if (err) throw err;
            //agora vamos salvar o Usuario com a senha hashada no lugar da senha plain text
            Usuario.sync();
            Usuario.create({
              matricula: matriculaInput,
              postograd: postogradInput,
              nomecompleto: nomecompletoInput,
              nomedeguerra: nomedeguerraInput,
              unidade: unidadeInput,
              senha: hash,
              perfil: perfilList
            }).then(user => {
              req.flash('success_msg', 'Registrado com sucesso. Proceder ao Login.');
              res.redirect("/");
            }).catch(err => console.log("erro ao gravar no BD: " + err));
          });
        });

      }
    });
  }
});

module.exports = router;
