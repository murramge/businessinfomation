import urlencode from "urlencode";

import { processQuery } from "../../process/naver_map/data_process";
import { CrawlerConfig } from "./../../interface/config";
import axios from "axios";
import { CrawlerModule } from "../../interface/module";
import fs from "fs";
import { processData } from "../../process/naver_map/data_process";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

interface SearchResult {
  result: {
    type: string;
    metaInfo: {
      pageId: string;
      sessionId: any;
    };
    address: any;
    place: {
      page: number;
      totalCount: number;
      boundary: any[];
      feedback: any[];
      options: any[];
      filters: object;
      reSearch: any;
      isSiteSortAvailable: boolean;
      specializedSearch: any;
      hasPollingPlace: boolean;
      isAdultKeyword: boolean;
      containAdultContents: boolean;
      address: any;
      brandPromotion: any;
      list: any[];
    };
  };
}

// async function crawling() {
//   const result = await axios.request<SearchResult>({
//     method: "get",
//     url: "https://map.naver.com/v5/api/search",
//     params: {
//       caller: "pc",
//       type: "place",
//       displayCount: 2,
//       query: "두정동 음식점",
//     },
//   });

//   console.log(result.data.result.place.list);

//   return {
//     count: result.data.result.place.list.length,
//   };
// }

export async function Navercrawling() {
  const TEST_LOCATION = ["불당동"];
  const TEST_WORD = ["음식점"];

  const query = await processQuery(TEST_LOCATION, TEST_WORD);

  interface defaultParam {
    caller: any;
    type: string;
    displayCount: number;
  }

  const defaultParam: defaultParam = {
    caller: "pcweb",
    type: "place",
    displayCount: 2,
  };

  let param = {
    ...defaultParam,
    query,
  };

  const params = Object.keys(param)
    .map((paramkey: any) => {
      return `${paramkey}=${urlencode(param[paramkey as keyof defaultParam])}`;
    })
    .join("&");

  const naverUrl = `https://map.naver.com/v5/api/search?${params}`;

  const result = await axios.get<SearchResult>(naverUrl);
  const dataprocess = processData(result.data.result.place.list);
  console.log(dataprocess);

  return {
    count: result.data.result.place.list.length,
  };
}

export const exportObject: CrawlerModule = {
  key: "naver_map",
  crawling: Navercrawling,
  config: config,
};
