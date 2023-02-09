import { get, defaults } from "lodash";
import urlencode from "urlencode";

import { processQuery } from "../../process/naver_map/data_process";
import { CrawlerConfig } from "./../../interface/config";
import axios from "axios";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";
import { processData } from "../../process/naver_map/data_process";
import naver_api from "./naver_api";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function Navercrawling() {
  const TEST_LOCATION = ["불당동", "두정동"];
  const TEST_WORD = ["음식점"];

  let result: any = await processQuery(TEST_LOCATION, TEST_WORD);

  const dataprocess = processData(result);

  return {
    count: result.length,
  };
}

export const exportObject: CrawlerModule = {
  key: "naver_map",
  crawling: Navercrawling,
  config: config,
};
