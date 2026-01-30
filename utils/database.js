const { Sequelize } = require('sequelize');
const { writeLogSucess } = require('./logger');
const { DatabaseError } = require('./error');
const format = require('date-format');


const sequelize = new Sequelize("sysfind","node","node", {
    host: 'localhost',
    port: '3306',
    dialect: 'mariadb',
    logging: false
}) 

async function pingDatabase() {
    try {
        await sequelize.authenticate();
        writeLogSucess("Sucessfully connected to database!");
    } catch (e) {
        throw new DatabaseError(e);
    }
}

function javascriptDateToDatabaseDatetime(date) {
    return date ? format('yyyy-MM-dd hh:mm:ss', date) : null; 
}

module.exports={sequelize, pingDatabase, javascriptDateToDatabaseDatetime}