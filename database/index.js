const mongoose = require('mongoose');

const models = require('./model');

const logger = require('../logger').logger;
const config = require('../config');

let database = {};

database.connect = () => {
    const dbInfo = config.DB_INFO[process.env.NODE_ENV];

    logger.info('setting database connection.');

    mongoose.Promise = global.Promise;

    // To prevent deprecated error
    /**
     * URL string parser를 새 버전으로 사용
     */
    mongoose.set('useNewUrlParser', true);
    /**
     * 철지난 FindAndModify 함수를 사용하지 않도록 설정
     */
    mongoose.set('useFindAndModify', false);
    /**
     * 역시 철지난 ensureIndex 대신 createIndex를 사용하도록 설정
     */
    mongoose.set('useCreateIndex', true);
    /** https://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/ */
    mongoose.set('useUnifiedTopology', true);
    //

    const connectionOption = {
    /** When DB server ready */
    //     user: dbInfo.USERNAME,
    //     pass: dbInfo.PASSWORD
    }
    mongoose.connect(dbInfo.URL, connectionOption);
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