import crawlerModules from "./crawler/crawler_modules";
import schedule from "node-schedule";
const winston = require("winston");
var winstonDaily = require("winston-daily-rotate-file");
var moment = require("moment");
const fs = require("fs");
const logDir = "log";

const moduleParam = process.argv[2];

console.log("moduleParam > " + moduleParam);
const targetModule = crawlerModules[moduleParam];
console.log("targetModule > " + targetModule);

const timeStampFormat = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
};

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

// const resultList = schedule.scheduleJob("* * 12 * * * ", () => {
(async function () {
  let log = (str: string) =>
    loger(`${new Date().toString()}: ${targetModule.key} : ${str}`);
  log(`크롤링 시작`);
  const result = await targetModule.crawling();
  log(`${result.count}개 수집완료`);
})();
// });
