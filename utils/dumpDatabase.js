const { writeIni } = require("@delfi-ch/ini.js/fs")
const { objectToIniString, iniStringToObject } = require("@delfi-ch/ini.js")
const fs = require("fs/promises")
const {OperatingSystemModel, processorArchitectureModel} = require('../model/index.js')
const { writeLogSucess, writeError, writeLogTemporary } = require('../utils/logger.js');
const { DatabaseError } = require('../utils/error.js');

async function dumpDataToIni() {
    writeLogTemporary('Querying all operating systems from database...');
    try {
        const DatabaseOperatingSystems = await OperatingSystemModel.findAll({
            include: [
            {
                model: processorArchitectureModel,
                as: "architectures", 
                through: { attributes: [] }
            }
            ]
        });
        writeLogSucess("Query was sucessfull");
        let serializedOperatingSystems = DatabaseOperatingSystems.map(os => {
        const plainOS = os.get({ plain: true });

        if (Array.isArray(plainOS.architectures)) {
            plainOS.architectures = plainOS.architectures.map(a => a.name);
        }
            return plainOS;
        });
        serializedOperatingSystems = serializedOperatingSystems.map((os)=> {
            keys = Object.keys(os)
            values = Object.values(os)
            for (let i = 0; i < keys.length; i++) {
                if (typeof(values[i]) === "string" || values[i] instanceof Date) {
                    os[keys[i]] = `"${values[i]}"`
                }
            }
            return os
        })
        serializedOperatingSystems.forEach(async (os)=>{
            os.architectures = os.architectures.join(", ")
            const filepath = "./dump/"+os.name.substring(1, os.name.length-1)+os.version.trim().substring(1, os.version.length-1)+".ini"
            try {
                await fs.mkdir("./dump", { recursive: true });
                await writeIni(filepath, os)
            } catch {}
        })
        return;
    } catch (e) {
        const err = new DatabaseError(e);
        writeError("Could not query the database: "+err.getMessage());
    }
}

module.exports = dumpDataToIni