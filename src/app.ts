import crawlerModules from "./crawler/crawler_modules";

const moduleParam = process.argv[2];

console.log("moduleParam > " + moduleParam);

const targetModule = crawlerModules[moduleParam];
console.log("targetModule > " + targetModule);

if (!targetModule) {
  console.log(`타겟을 정해주세요 : [${Object.keys(crawlerModules)}]`);
  process.exit();
}

(async function crawlingstart(query) {
  let log = (str: string) =>
    console.log(`${new Date().toString()}: ${targetModule.key} : ${str}`);
  log(`크롤링 시작`);
  const result = await targetModule.crawling(query);
  log(`${result.count}개 수집완료`);
})();
