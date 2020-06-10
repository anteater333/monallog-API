
module.exports = {
    PORT: 8081,
    DB_INFO: {
        production: require('../.local/dbinfo.json').PROD_DB,
        development: require('../.local/dbinfo.json').DEV_DB,
        test: require('../.local/dbinfo.json').TEST_DB
    }
}