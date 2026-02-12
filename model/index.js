const { sequelize, javascriptDateToDatabaseDatetime } = require("../utils/database");
const { DataTypes } = require("sequelize");

const { OperatingSystemModel } = require("./operatingSystem.js");
const { processorArchitectureModel } = require("./processorArchitecture.js");

const OperatingSystemArchitectures = sequelize.define(
  "OperatingSystemArchitectures",
  {
    operatingSystemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatingSystemModel,
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    architectureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: processorArchitectureModel,
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  },
  {
    tableName: "OperatingSystemArchitectures",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["operatingSystemId", "architectureId"]
      }
    ]
  }
);

OperatingSystemModel.belongsToMany(processorArchitectureModel, {
  through: OperatingSystemArchitectures,
  as: "architectures",
  foreignKey: "operatingSystemId",
  otherKey: "architectureId"
});

processorArchitectureModel.belongsToMany(OperatingSystemModel, {
  through: OperatingSystemArchitectures,
  as: "operatingSystems",
  foreignKey: "architectureId",
  otherKey: "operatingSystemId"
});

module.exports = {
  sequelize,
  OperatingSystemModel,
  processorArchitectureModel,
  OperatingSystemArchitectures
};
