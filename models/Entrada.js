const Sequelize = require("sequelize");
const sequelize = new Sequelize("tafdb", "root", "admin", {
  dialect: "mysql"
});
class Entrada extends Sequelize.Model {}
Entrada.init({
    ano: {
        allowNull: false,
        autoIncrement: false, 
        primaryKey: true,
        type: Sequelize.SMALLINT,
    },
    semestre: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
    },
    unidade: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    matricula: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    idade: {
        allowNull: false,
        type: Sequelize.TINYINT,
    },
    qtdbarras: {
        allowNull: true,
        type: Sequelize.TINYINT,
    },
    pontbarras: {
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    qtdflexao: {
        allowNull: true,
        type: Sequelize.TINYINT,
    },
    pontflexao: {
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    qtdabdomcarl: {
        allowNull: true,
        type: Sequelize.TINYINT,
    },
    pontabdocarl: {
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    qtdabdorem: {
        allowNull: true,
        type: Sequelize.TINYINT,
    },
    pontabdorem: {
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    qtdcorrida: {
        allowNull: true,
        type: Sequelize.SMALLINT,
    },
    pontcorrida: {
        allowNull: true,
        type: Sequelize.FLOAT,
    },
    total: Sequelize.FLOAT,
    parecer: Sequelize.STRING,
},
    { sequelize, modelName: "entrada" }
);
module.exports = Entrada;
