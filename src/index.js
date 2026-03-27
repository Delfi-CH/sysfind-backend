const express = require('express');
const session = require('express-session')
const cors  = require('cors')

const { writeLogSucess,  writeCriticalError, writeError } = require('./utils/logger.js');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const { sequelize, pingDatabase } = require('./utils/database.js');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const operatingSystemController = require('./controller/operatingSystemController.js');
const dumpDataToIni = require("./utils/dumpDatabase.js")

const { exit } = require('node:process');

const { credentialsOk } = require('./utils/authentication.js');

const {readConfig} = require("./utils/config.js");

let port = 3000;

let config = readConfig("config.ini")
port = config.application.port ? config.application.port : 3000;

const app = express();
app.use(express.json());
app.use('/api/sysfind/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const sessionStorage = new SequelizeStore({
    db: sequelize,
});
app.use(session({
    secret: 'keyboard cat',
    store: sessionStorage,
    resave: false
}))
sessionStorage.sync();

app.get('/api/sysfind/', (req, res)=>{
    res.send('Hello World')
})

const allowedOrigins = [
  'http://localhost:1420',
  'tauri://localhost'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use('/api/sysfind/operatingSystem', operatingSystemController)

app.post('/api/sysfind/login', async (request, response, next) => {
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

app.get('/api/sysfind/verify', (request, response)=> {
    // #swagger.tags = ['Authentication']
    // #swagger.security = [{ "cookie": [] }]
    request.session.email ? response.sendStatus(200) : response.sendStatus(401);
})

/*
    curl -b tmp/cookies http://localhost:3000/verify
*/

app.delete('/api/sysfind/logout', (request, response, next) => {
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

app.get('/api/sysfind/dump', async (request, response) => {
    if (!config.application.allowdump) {
        response.status(501).send("Database dumping not enabled in config.")
        return
    }
    try {
        await dumpDataToIni()
        response.sendStatus(201)
    } catch (e) {
        response.sendStatus(500)
    }
})

app.listen(port, async () => {
    writeLogSucess('App listening on Port ' + port);

    const maxRetries = 3;
    let tries = 0;

    while (tries < maxRetries) {
        try {
            tries++;

            await pingDatabase();
            writeLogSucess("DB connected");
            return;
        } catch (e) {
            writeCriticalError(`Attempt ${tries} failed: ${e.message}`);

            if (tries >= maxRetries) {
                writeCriticalError("CRITICAL: Could not connect to DB. Aborting.");
                process.exit(1);
            }

            await new Promise(res => setTimeout(res, 2000));
        }
    }
});