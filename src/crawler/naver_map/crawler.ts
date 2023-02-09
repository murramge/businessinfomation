import { processQuery } from "./data_process";
import { processData } from "./data_process";
import { CrawlerConfig } from "./../../interface/config";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function Navercrawling() {
  const TEST_LOCATION = ["불당동", "두정동"];
  const TEST_WORD = ["음식점"];

  let result: any = await processQuery(TEST_LOCATION, TEST_WORD);

  processData(result);

  return {
    count: result.length,
  };
}

export const exportObject: CrawlerModule = {
  key: "naver_map",
  crawling: Navercrawling,
  config: config,
};
