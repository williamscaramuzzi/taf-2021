const Sequelize = require("sequelize");
const sequelize = new Sequelize("tafdb", "root", "Ar0j4dkq", {
  dialect: "mysql"
});
class Policial extends Sequelize.Model {}
Policial.init({
    matricula: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    nomecompleto: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    nomedeguerra: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    postograd: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: false,
    },
    datadenascimento: {
        allowNull: false,
        type: Sequelize.DATEONLY,
    },
    sexo: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    unidade: {
        allowNull: false,
        type: Sequelize.STRING,}
    },
    { sequelize, modelName: "policial" }
);
module.exports = Policial;
