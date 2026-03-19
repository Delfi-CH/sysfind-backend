const express = require('express')
const {OperatingSystemModel, processorArchitectureModel} = require('../model/index.js')
const { writeLogSucess, writeError, writeLogTemporary } = require('../utils/logger.js');
const { sequelize } = require('../utils/database.js');
const { isValidOperatingSystemFamily } = require('../model/operatingSystemFamily.js');

const router = express.Router();
router.use(express.json());

router.get('/', async (req,res)=> {
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
        let OperatingSystems = DatabaseOperatingSystems.map(os => (os.dataValues));
        OperatingSystems = {...OperatingSystems, }
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystems);
    } catch (e) {
        writeError("Could not query the database: "+e.getMessage());
        res.status(500).send(e.getMessage())
    }
})

router.get('/:id', async (req,res)=> {
    const id = req.params.id
    writeLogTemporary('Querying a operating system from database...');
    try {
        const DatabaseOperatingSystem = await OperatingSystemModel.findByPk(id,{
        include: [
        {
            model: processorArchitectureModel,
            as: "architectures",
            through: { attributes: [] }
        }
        ]
        });
        const OperatingSystem = DatabaseOperatingSystem.dataValues;
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystem);
    } catch (e) {
        writeError("Could not query the database: "+e.getMessage());
        res.status(500).send(e.getMessage())
    }
})

router.post('/', async (req, res) =>{
    if (!req.session.email) {
        res.sendStatus(401);
        return
    }
    writeLogTemporary("Writing new OS to database...");
    const operatingSystem = await OperatingSystemModel.create(req.body);
    try {
        const architectures = await processorArchitectureModel.findAll({
        where: {
            name: req.body.processorArchitecture
        }
        });
        await operatingSystem.addArchitectures(architectures);
        await operatingSystem.save();   
        writeLogSucess("Wrote new OS to database");
        res.sendStatus(201);
        return
    } catch (e) {
        writeError("Could not save to database: "+e.getMessage());
        res.status(500).send(e.getMessage());
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

router.delete('/:id', async (req,res)=> {
    if (!req.session.email) {
        res.sendStatus(401);
        return
    }
    const id = req.params.id
    writeLogTemporary('Querying a operating system from database...');
    try {
        const DatabaseOperatingSystem = await OperatingSystemModel.findByPk(id);
        DatabaseOperatingSystem.delete()
        writeLogSucess("Deletion was sucessfull");
        res.sendStatus(204)
    } catch (e) {
        writeError("Could not save to database: "+e.getMessage());
        res.status(500).send(e.getMessage());
    }
})

router.get('/family/:family', async (req,res)=> {
    const family = req.params.family;
    writeLogTemporary('Querying all operating systems from database...');
    try {
        const DatabaseOperatingSystems = await OperatingSystemModel.findAll({
            where: {
                family: isValidOperatingSystemFamily(family)
            },
            include: [
            {
                model: processorArchitectureModel,
                as: "architectures", 
                through: { attributes: [] }
            }
            ]
        });
        let OperatingSystems = DatabaseOperatingSystems.map(os => os.get({ plain: true }));
        OperatingSystems = {...OperatingSystems, }
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystems);
    } catch (e) {
        writeError("Could not save to database: "+e.getMessage());
        res.status(500).send(e.getMessage());
    }
})

router.get('/architecture/:architecture', async (req,res)=> {
    const architecture = req.params.architecture;
    writeLogTemporary('Querying all operating systems from database...');
    try {
        const DatabaseOperatingSystems = await OperatingSystemModel.findAll({
            
            include: [
            {
                model: processorArchitectureModel,
                as: "architectures", 
                through: { attributes: [] },
                where: {
                    name: architecture
                }
            }
            ],
        });
        let OperatingSystems = DatabaseOperatingSystems.map(os => os.get({ plain: true }));
        OperatingSystems = {...OperatingSystems, }
        writeLogSucess("Query was sucessfull");
        res.json(OperatingSystems);
    } catch (e) {
        writeError("Could not save to database: "+e.getMessage());
        res.status(500).send(e.getMessage());
    }
})

module.exports = router;