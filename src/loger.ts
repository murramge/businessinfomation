const fs = require("fs");
const logDir = "log";
const winston = require("winston");

var moment = require("moment");

export function loger(info) {
  console.log(info);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  var logger = new winston.createLogger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: "info",
        timestamp: function () {
          return moment().format("YYYY-MM-DD HH:mm:ss");
        },
      }),
      new (require("winston-daily-rotate-file"))({
        level: "info",
        filename: `${logDir}/log.log`,
        prepend: true,
        timestamp: function () {
          return moment().format("YYYY-MM-DD HH:mm:ss");
        },
      }),
    ],
  });
  try {
    logger.info(info);
  } catch (exception) {
    logger.error("ERROR=>" + exception);
  }
}
