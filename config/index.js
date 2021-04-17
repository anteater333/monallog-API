
module.exports = {
    PORT: 8081,
    /**
     * {REPO_DIR}/.local/dbinfo.json
     * 파일을 작성
     */
    DB_INFO: {
        production: require('./.local/dbinfo.json').PROD_DB,
        development: require('./.local/dbinfo.json').DEV_DB,
        test: require('./.local/dbinfo.json').TEST_DB
    },
    TEST_SERVER_ADDR: require('./.local/testServer').testServer
}