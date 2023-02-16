import { processQuery } from "./data_process";
import { CrawlerConfig } from "./../../interface/config";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";
import api from "../../api/api";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function Navercrawling() {
  const locationResult = await api.searchArea(config.searchAreaSize);
  const TEST_LOCATION = locationResult.data.data;

  const categoryResult = await api.searchCategory(config.searchCategoriSize);
  const TEST_CATEGORY = categoryResult.data.data;

  console.log;

  let result: any = await processQuery(TEST_LOCATION, TEST_CATEGORY);

  return {
    count: result.length,
  };
}

export const exportObject: CrawlerModule = {
  key: "naver_map",
  crawling: Navercrawling,
  config: config,
};
