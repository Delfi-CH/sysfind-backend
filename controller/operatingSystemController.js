const express = require('express')
const {operatingSystem, OperatingSystemModel, OperatingSystem} = require('../model/operatingSystem.js')
const { writeLogSucess, writeError, writeLogTemporary } = require('../utils/logger.js');
const { DatabaseError } = require('../utils/error.js');
const { sequelize } = require('../utils/database.js');

const router = express.Router();
router.use(express.json());

router.get('/', async (req,res)=> {
    writeLogTemporary('Querying all operating systems from database...');
    try {
        const DatabaseOperatingSystems = await OperatingSystemModel.findAll();
        const OperatingSystems = DatabaseOperatingSystems.map(os => (os.dataValues));
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystems);
    } catch (e) {
        const err = new DatabaseError(e);
        writeError("Could not query the database: "+err.getMessage());
        res.status(err.getCode()).send(err.getMessage())
    }
})

router.get('/:id', async (req,res)=> {
    const id = req.params.id
    writeLogTemporary('Querying a operating system from database...');
    try {
        const DatabaseOperatingSystem = await OperatingSystemModel.findByPk(id);
        const OperatingSystem = DatabaseOperatingSystem.dataValues;
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystem);
    } catch (e) {
        const err = new DatabaseError(e);
        writeError("Could not query the database: "+err.getMessage());
        res.status(err.getCode()).send(err.getMessage())
    }
})

router.post('/', async (req, res) =>{
    writeLogTemporary("Writing new OS to database...");
    const operatingSystem = new OperatingSystem(
        req.body.name, 
        req.body.family,
        req.body.processorArchitecture,     
        req.body.description,
        req.body.imageDownloadURL,
        req.body.homepage,
        req.body.version,
        req.body.isSupported
    );
    const tmp = operatingSystem.createModel()
    try {
        await tmp.save();
        writeLogSucess("Wrote new OS to database");
        res.sendStatus(201);
        return
    } catch (e) {
        const err = new DatabaseError(e);
        writeError("Could not save to database: "+err.getMessage());
        res.status(err.getCode()).send(err.getMessage());
    }
})
/*
curl -X POST http://localhost:3000/operatingSystem \
-H "Content-Type: application/json" \
-d '{
    "name": "Ubuntu",
    "family": "Linux",
    "processorArchitecture": ["x86-64-v2", "Aarch64", "RiscV 64"],
    "description": "A popular Linux distribution",
    "imageDownloadURL": "https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso",
    "homepage": "https://ubuntu.com",
    "version": "24.04",
    "isSupported": true
}'
*/
//todo: fix
module.exports = router;