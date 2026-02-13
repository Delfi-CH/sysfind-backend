const express = require('express');
const session = require('express-session')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const { sequelize, pingDatabase } = require('./utils/database.js');
const { exit } = require('node:process');
const { writeLogSucess,  writeCriticalError, writeError } = require('./utils/logger.js');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const operatingSystemController = require('./controller/operatingSystemController.js');
const { credentialsOk } = require('./utils/authentication.js');


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

app.use('/operatingSystem', operatingSystemController)

app.post('/login', async (request, response, next) => {
    // #swagger.tags = ['Authentication']
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/user" }
                }
            }
        }
    */
    if (request.session.email) {
        response.sendStatus(200)
        return;
    }
    const email = request.body.email;
    const password = request.body.password;
    try {
        const ok = await credentialsOk(email, password);
        if (ok) {
            request.session.regenerate((err)=>{
                if (err) next(err);
                request.session.email = email;
                request.session.save((err)=>{
                    if (err) next(err);
                    response.sendStatus(200)
                    return;
                })
            })
        } else {
            response.sendStatus(401)
            return
        }
    } catch (e) {
        writeError('Database Error:' +e.getMessage());
        response.status(e.getCode()).send(e.getMessage())
    }
})

/*
    curl -c tmp/cookies -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"1234"}' http://localhost:3000/login
*/

app.get('/verify', (request, response)=> {
    // #swagger.tags = ['Authentication']
    // #swagger.security = [{ "cookie": [] }]
    request.session.email ? response.sendStatus(200) : response.sendStatus(401);
})

/*
    curl -b tmp/cookies http://localhost:3000/verify
*/

app.delete('/logout', (request, response, next) => {
    // #swagger.tags = ['Authentication']
    request.session.email = null;
    request.session.save((err) => {
        if (err) next(err);
        request.session.regenerate((err)=> {
            if (err) return next(err);
            response.status(200).send("Logout");
        })
    })
})

/* 
    curl -c tmp/cookies -X DELETE http://localhost:3000/logout
*/

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