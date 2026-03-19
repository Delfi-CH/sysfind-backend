const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");
const crypto = require('crypto');

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    createModel() {
        return UserModel.build({email: this.email, password: this.password})
    }
}

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            return this.getDataValue('id');
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        get() {
            return this.getDataValue('email');
        },
        set(value) {
            this.setDataValue('email', value);
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        get() {
            return this.getDataValue('password');
        },
        set(value) {
            const hash = crypto.createHash('sha256');
            hash.update(value);
            this.setDataValue('password', hash.digest('hex'));
        }
    }
}, {
    timestamps: false
})

function createDummyUsers() {
    const user1 = new User("user@example.com", "1234");
    const user2 = new User('dummy@dummy.net', "dummy");

    return [user1, user2]
}

module.exports = {User, createDummyUsers, UserModel};