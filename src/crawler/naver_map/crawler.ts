import { processQuery } from "./data_process";
import { processData } from "./data_process";
import { CrawlerConfig } from "./../../interface/config";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";
import api from "../../api/api";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function Navercrawling() {
  const TEST_LOCATION = api
    .searchArea(config.searchAreaSize)
    .then((res) => res.data.data);
  const TEST_WORD = api
    .searchCategory(config.searchCategoriSize)
    .then((res) => res.data.data);

  let result: any = await processQuery(
    await TEST_LOCATION,
    await TEST_WORD,
    (item: any) => {
      if (item.tel.substr(0, 3) === "010") return false;
      if (item.tel.substr(0, 3) === "050") return false;
      if (item.tel.substr(0, 3) === "011") return false;
      if (item.tel === "") return false;
      if (item.isAdultBusiness === true) return false;
      if (!item.roadAddress) {
        return false;
      } else {
        console.log(`크롤링 넘어간 값 : ${item}`);
      }
      return true;
    }
  );

  console.log(result);

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
