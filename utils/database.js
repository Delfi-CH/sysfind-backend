const { Sequelize } = require('sequelize');
const { writeLogSucess } = require('./logger');
const { DatabaseError } = require('./error');
const format = require('date-format');
const { readConfig } = require("./config.js")

function init() {
    let config = readConfig("config.ini")
    if (!config.database) {
        config.database.dbname = "sysfind"
        config.database.host = "localhost"
        config.database.port = "3306"
        config.database.user = "node"
        config.database.password = "node"
    }
    return new Sequelize(
        config.database.dbname,config.database.user,config.database.password, {
            host: config.database.host,
            port: config.database.port,
            dialect: 'mariadb',
            logging: false
    }) 
}

const sequelize = init()

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