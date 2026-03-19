const format = require('date-format');

const colorYellow = '\x1b[33m'
const colorGreen = '\x1b[32m'
const colorRed = '\x1b[31m';
const colorReset = '\x1b[0m';

function writeLogSucess(message) {
    const now = new Date();
    const prefix = "[" + format("hh:mm:ss", now) + "] ";
    console.log(colorGreen + prefix + message+colorReset);
}

function writeLogTemporary(message) {
    const now = new Date();
    const prefix = "[" + format("hh:mm:ss", now) + "] ";
    console.log(prefix + message);
}

function writeError(message) {
    const now = new Date();
    const prefix = "[" + format("hh:mm:ss", now) + "] ";
    console.error(colorYellow + prefix + message + colorReset);
}

function writeCriticalError(message) {
    const now = new Date();
    const prefix = "[" + format("hh:mm:ss", now) + "] ";
    console.error(colorRed + prefix + message + colorReset);
}


module.exports = {writeLogSucess, writeError, writeCriticalError, writeLogTemporary};