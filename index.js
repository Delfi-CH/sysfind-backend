const express = require('express');
const session = require('express-session')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const { sequelize, pingDatabase } = require('./utils/database.js');
const { exit } = require('node:process');
const { writeLogSucess,  writeCriticalError, writeError } = require('./utils/logger.js');
const SequelizeStore = require("connect-session-sequelize")(session.Store);



const app = express();
const port = 3000;
app.use(express.json());
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const sessionStorage = new SequelizeStore({
    db: sequelize,
});
app.use(session({
    secret: 'keyboard cat',
    store: sessionStorage,
    resave: false
}))
sessionStorage.sync();



app.get('/', (req, res)=>{
    res.send('Hello World')
})


app.listen(port, async () => {
    console.log()
    writeLogSucess('App listening on Port ' + port);
    try {
        await pingDatabase()
    } catch(e) {
        writeCriticalError("CRITICAL: FAILED TO CONNECT TO DATABASE! REASON: "+ e.getMessage())
        exit(1)
    };
})