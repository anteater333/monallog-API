// 코드 분석 할것.
// Ref. https://lovemewithoutall.github.io/it/winston-example/

const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')

const env = process.env.NODE_ENV || 'development'
const logDir = "./logs"

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    level: 'debug',
    filename: `${logDir}/%DATE%-monallog-api.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m', // 20mb
    maxFiles: '14d' // 14일
})

const logger = createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
})

/**
 * Ref. https://blog.naver.com/PostView.nhn?blogId=dilrong&logNo=221684937267
 */
const stream = {
    write: message => {
        logger.info(message)
    }
}

module.exports = { logger, stream }