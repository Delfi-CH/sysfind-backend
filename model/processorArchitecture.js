const { sequelize, javascriptDateToDatabaseDatetime } = require("../utils/database");
const { DataTypes } = require('sequelize')


const processorArchitecture = Object.freeze({
    i386: 'i386',
    i486: 'i486',
    i586: 'i586',
    i686: 'i686',
    x86_64: 'x86-64',
    x86_64_v2: 'x86-64-v2',
    x86_64_v3: 'x86-64-v3',
    x86_64_v4: 'x86-64-v4',
    8086: '8086',
    IA64: 'IA64',
    ARM32: 'Aarch32',
    ARM64: 'Aarch64',
    ARMv5: 'ARMv5',
    ARMv6: 'ARMv6',
    ARMv7: 'ARMv7',
    ARMv8: 'ARMv8',
    ARMv9: 'ARMv9',
    ARMAppleSilicon: 'Apple Silicon',
    RiscV32: 'RiscV 32',
    RiscV64: 'RiscV 64',
    m68k: 'm68k',
    PowerPC32: 'ppc32',
    PowerPC64: 'ppc64',
    PowerISA: 'PowerISA',
    Sparc32: 'Sparc32',
    Sparc64: 'Sparc64',
    DecVAX: 'DEC VAX',
    DecAlpha: 'DEC Alpha',
    IBMs370: 'IBM s/370',
    IBMs390: 'IBM s/390',
    IBMz: 'IBM z/Architeture',
    Unknown: 'Unknown'
})

const processorArchitectureModel = sequelize.define("Processor Architecture", {
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
    }
},  {
    timestamps: false
});


module.exports = {processorArchitecture, processorArchitectureModel}