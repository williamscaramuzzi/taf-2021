//aqui dentro criaremos nossa estrategia de login

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//carregar o nosso modelo de User
const Usuario = require("../models/Usuario");

module.exports = function (passport) {
  console.log('passport.use');
  passport.use(
    new LocalStrategy(
      {
        //tenho que colocar aqui os nomes dos componentes html que contem os dados que eu preciso
        usernameField: "matricula",
        passwordField: "senha"
      },
      (matricula, password, done) => {
        console.log('tentando findOne:');
        //ver se tem um usuario no BD que matches o user informado
        Usuario.findOne({ where: { matricula: matricula } })
          .then(user => {
            if (!user) {
              console.log('User.findOne não achou ninguem');
              return done(null, false, {
                message: "Usuário não registrado"
              });
            }
            console.log('User.findOne achou um user, vamos ver agora se o password bate');
            //ver se o password é igual, temos que decryptar o password que ta guardado no BD pra comparar com o digitado
            bcrypt.compare(password, user.senha, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                //se isMatch é true, quer dizer que bateu as senhas
                console.log('password bateu, done(null, user)');
                return done(null, user);
              } else {
                console.log('password nao bateu, retornando done com a devida mensagem')
                return done(null, false, { message: "Senha incorreta" });
              }
            });
          })
          .catch(err => console.log(err));
      }
    )
  );
  //serialize and deserialize
  //essa bagaça significa o seguinte:
  //num app que tem login, você só mexe com as credenciais do usuario
  //na hora de logar. Quando o usuario loga, uma sessão será estabelecida
  //e mantida via cookie no browser do usuario
  //Visando manter Login Sessions, o framework Passport vai serializer e deserializar instancias do User para a Session
  passport.serializeUser((user, done) => {
    done(null, user.matricula);
  });
  passport.deserializeUser((matricula, done) => {
    console.log('entrou no deserialize');
    Usuario.findOne({ where: { matricula: matricula } }).then(user => {
      done(null, user);
    });


  });
};
