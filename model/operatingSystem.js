const { sequelize, javascriptDateToDatabaseDatetime } = require("../utils/database");
const { operatingSystemFamilies, isValidOperatingSystemFamily } = require("./operatingSystemFamily");
const { processorArchitecture, processorArchitectureModel } = require("./processorArchitecture");
const { now } = require("sequelize/lib/utils");
const { DataTypes } = require('sequelize')

class OperatingSystem {
    constructor(name, family, processorArchitecture, description, imageDownloadURL, homepage, version, isSupported) {
        this.name = name;
        this.family = isValidOperatingSystemFamily(family);
        this.description = description;
        this.processorArchitecture = processorArchitecture;
        this.imageDownloadURL = imageDownloadURL;
        this.homepage = homepage;
        this.version = version;
        this.isSupported = isSupported;
        this.createdAt = new Date();
    }
    createModel() {
        return OperatingSystemModel.build({
            name: this.name,
            family: this.family,
            description: this.description,
            processorArchitecture: this.processorArchitecture,
            imageDownloadURL: this.imageDownloadURL,
            homepage: this.homepage,
            version: this.version,
            isSupported: this.isSupported,
            createdAt: javascriptDateToDatabaseDatetime(this.createdAt)
        })
    }
}

const OperatingSystemModel = sequelize.define('Operating System', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        get() {
            return this.getDataValue('id');
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        get() {
            return this.getDataValue('name');
        },
        set(value) {
            this.setDataValue('name', value);
        }
    },
    family: {
        type: DataTypes.ENUM(...Object.values(operatingSystemFamilies)),
        allowNull: false,
        defaultValue: operatingSystemFamilies.Other,
        unique: false,
        get() {
            return this.getDataValue('family');
        },
        set(value) {
            this.setDataValue('family', value);
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        get() {
            return this.getDataValue('description');
        },
        set(value) {
            this.setDataValue('description', value);
        }
    },
    imageDownloadURL: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        get() {
            return this.getDataValue('imageDownloadURL');
        },
        set(value) {
            this.setDataValue('imageDownloadURL', value);
        }
    },
    homepage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        get() {
            return this.getDataValue('homepage');
        },
        set(value) {
            this.setDataValue('homepage', value);
        }
    },
    version: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: '1',
        get() {
            return this.getDataValue('version');
        },
        set(value) {
            this.setDataValue('version', value);
        }
    },
    isSupported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: false,
        get() {
            return this.getDataValue('isSupported');
        },
        set() {
            this.setDataValue('isSupported', !this.isSupported);
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false,
        defaultValue: now('mysql'),
        get() {
            return this.getDataValue('createdAt');
        },
    }
}, {
    timestamps: false
})

OperatingSystemModel.belongsToMany(processorArchitectureModel, {
  through: "OperatingSystemArchitectures"
});

processorArchitectureModel.belongsToMany(OperatingSystemModel, {
  through: "OperatingSystemArchitectures"
});


module.exports = {OperatingSystem, OperatingSystemModel}