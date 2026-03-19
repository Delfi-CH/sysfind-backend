const { readIniSync } = require("@delfi-ch/ini.js/fs");


function readConfig(configPath) {
    let config = {}
    config = readIniSync(configPath)
    return config
}

module.exports = {readConfig}