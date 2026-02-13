const crypto = require('crypto');
const { UserModel } = require('../model/user.js');
const { DatabaseError } = require('../utils/error.js');
const { writeError, writeLogTemporary } = require('../utils/logger.js');


async function credentialsOk(email, password) {
    writeLogTemporary("Querying users from database...");
    try {
        const db_user = await UserModel.findOne({
        where: {
            email: email
        }
        })        
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const result = db_user.password === hash.digest('hex');
        return result;
    } catch (e) {
        const err = new DatabaseError(e);
        writeError('Database Error: ' + err.getMessage());
        throw err;
    }
}

module.exports = {credentialsOk};