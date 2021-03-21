  
const Sequelize = require("sequelize");
const sequelize = new Sequelize("tafdb", "root", "admin", {
  dialect: "mysql"
});
class Usuario extends Sequelize.Model {}
Usuario.init(
  {
    matricula: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    postograd: Sequelize.STRING,
    nomecompleto: Sequelize.STRING,
    nomedeguerra: Sequelize.STRING,
    unidade: Sequelize.STRING,
    senha: Sequelize.STRING,
    perfil: Sequelize.STRING
  },
  { sequelize, modelName: "usuario" }
);
module.exports = Usuario;