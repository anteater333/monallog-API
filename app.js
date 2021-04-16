process.env.NODE_ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

const app = require('express')();
const server = require('http').createServer(app);

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const Mocha = require('mocha');

const config = require('./config');
const logger = require('./logger').logger;
const stream = require('./logger').stream;
const database = require('./database');

/** Greetings! ****************************************/
logger.info('monallog back-end REST API server starts running.')
/******************************************************/

// set middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for CORS allow
// for security, need to set sepecific options later.
// https://www.npmjs.com/package/cors
app.use(cors());

// middleware for logging
// print logs with Standard Apache combined log output
// https://www.npmjs.com/package/morgan
app.use(morgan('combined', {stream}));

// API routing
app.use('/', require('./api'));

// set database connection
database.connect();

app.listen(config.PORT, '0.0.0.0', () => {
    logger.info(`monallog API server now listening on ${config.PORT} port!`)
});

module.exports = app;