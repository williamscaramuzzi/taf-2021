const Sequelize = require('sequelize');
const Usuario = require('./models/Usuario');
const Policial = require('./models/Policial');
const Entrada = require('./models/Entrada');
var moment = require('moment');
/**
 *  construtor new Sequelize recebe: nome do BD, nome de usuario, senha, e um JSON com dois parametros: host (localhost) e dialect (mysql)
 */
const conexaoBD = new Sequelize('tafdb', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql'
});
/** com essas duas linhas aprendi que no javascript a declaração de variavel já executa o que está depois do igual
const sucesso = console.log('Conectado ao MySQL com sucesso');
const erro = console.log('Falha ao conectar-se ao MySQL');
*/
conexaoBD.authenticate().then(function () {
    console.log('Conectado ao MySQL com sucesso');
}).catch(function (erro) {
    console.log('Falha ao conectar-se ao MySQL: ' + erro);
});

var modelUsers = conexaoBD.define('usuario', Usuario);
var modelPoliciais = conexaoBD.define('policial', Policial);
var modelEntradas = conexaoBD.define('entrada', Entrada);

modelEntradas.belongsTo(modelPoliciais);
console.log(modelUsers.values);


//esse comando serve pra gravar os modelos acima definidos pela primeira vez no DB
conexaoBD.sync(); //como deu tudo certo, vou comentar essa linha.BD criado

//criar usuários no banco de dados
function insertUser(mat, nome, ndguerra, patente, senha, perf) {
    modelUsers.create({
        matricula: mat,
        nome: nome,
        nomedeguerra: ndguerra,
        postograd: patente,
        password: senha,
        perfil: perf,
    })
};

function inserPolicial(mat, nome, ndguerra, patente, dtnasc, sexo) {
    modelPoliciais.create({
        matricula: mat,
        nome: nome,
        nomedeguerra: ndguerra,
        postograd: patente,
        datadenascimento: moment(dtnasc, 'DD/MM/YYYY'),
        sexo: sexo,
    })
};
function insertTaf(ano, semestre, abdominais, abdominaispontuacao, corrida, corridapontuacao, barras, barraspontuacao, flexoes, flexoespontuacao, conjugados, conjugadospontuacao, total, parecer, policiaiMatricula) {

    //primeiro devemos checar se já existe um registro de taf para o ano, semestre e matricula informados.

    modelEntradas.findOne({ where: { policiaiMatricula: policiaiMatricula, ano: ano, semestre: semestre } }).then(entrada => {
        if (entrada == null) {
            console.log('Não existe registro igual no BD, pode persistir esse registro!')
            modelEntradas.create({
                ano: ano,
                semestre: semestre,
                abdominais: abdominais,
                abdominaispontuacao: abdominaispontuacao,
                corrida: corrida,
                corridapontuacao: corridapontuacao,
                barras: barras,
                barraspontuacao: barraspontuacao,
                flexoes: flexoes,
                flexoespontuacao: flexoespontuacao,
                conjugados: conjugados,
                conjugadospontuacao: conjugadospontuacao,
                pontuacaototal: total,
                parecer: parecer,
                policiaiMatricula: policiaiMatricula
            });


        } else {
            console.log('O policial já fez taf no semestre do ano informado!');
            console.log(entrada.get({ plain: true }));
        }

    });

}
module.exports.criarUser = insertUser;
module.exports.criarPolicial = inserPolicial;
module.exports.criarEntradaTaf = insertTaf;