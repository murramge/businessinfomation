import crawlerModules from "./crawler/crawler_modules";
import schedule from "node-schedule";
import { loger } from "./loger";
import fs from "fs";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config = JSON.parse(json.toString());

const moduleParam = process.argv[2];

const targetModule = crawlerModules[moduleParam];

// const resultList = schedule.scheduleJob(config.schedule1tCode, () => {
(async function () {
  let log = (str: string) =>
    loger(`${new Date().toString()}: ${targetModule.key} : ${str}`);
  log(`크롤링 시작`);
  const result = await targetModule.crawling();

  log(`${result.count}개 수집완료`);
})();
// });
