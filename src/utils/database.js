const { Sequelize } = require('sequelize');
const { writeLogSucess } = require('./logger.js');
const format = require('date-format');
const { readConfig } = require("./config.js")

function init() {
    let config = readConfig("config.ini")
    const dbname = config.database.dbname || "sysfind"
    const dbhost = config.database.host || process.env.DB_HOST
    const dbport = config.database.port || process.env.DB_PORT
    const dbuser = config.database.user || process.env.DB_USER
    const dbpassword = config.database.password || process.env.DB_PASSWORD

    return new Sequelize(
        dbname, dbuser ,dbpassword, {
            host: dbhost,
            port: dbport,
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
        throw e;
    }
}

function javascriptDateToDatabaseDatetime(date) {
    return date ? format('yyyy-MM-dd hh:mm:ss', date) : null; 
}

module.exports={sequelize, pingDatabase, javascriptDateToDatabaseDatetime}