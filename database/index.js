const mongoose = require('mongoose');

const models = require('./model');

const logger = require('../logger').logger;
const config = require('../config');

let database = {};

database.connect = () => {
    const dbInfo = config.DB_INFO[process.env.NODE_ENV];

    logger.info('setting database connection.');

    mongoose.Promise = global.Promise;
    
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    mongoose.connect(dbInfo.URL, {useNewUrlParser: true});
    const db = mongoose.connection;

    // 이벤트별 callback 설정
    db.on('open', () => {
        logger.info('database opened');
    });
    db.on('disconnected', () => {
        logger.info('database disconnected');
    });
    db.on('error', (err) =>{
        logger.error(err);
    });
}

database.models = models;

module.exports = database;