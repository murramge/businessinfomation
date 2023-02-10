import { processQuery } from "./data_process";
import { processData } from "./data_process";
import { CrawlerConfig } from "./../../interface/config";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function Navercrawling() {
  const TEST_LOCATION = ["서울특별시 종로구 세종로"];
  const TEST_WORD = ["음식점"];

  let result: any = await processQuery(
    TEST_LOCATION,
    TEST_WORD,
    (item: any) => {
      if (item.tel.substr(0, 3) === "010") return false;
      if (item.tel.substr(0, 3) === "050") return false;
      if (item.tel.substr(0, 3) === "011") return false;
      if (item.tel === "") return false;
      if (item.isAdultBusiness === true) return false;

      if (!item.roadAddress) {
        return false;
      } else {
        // console.log(item);
      }
      return true;
    }
  );

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
