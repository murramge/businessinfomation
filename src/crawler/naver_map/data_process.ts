import { requestData } from "./../../interface/output";
import { get, uniqBy } from "lodash";

import { ProcessApiExistCheck } from "./api_process";
import naver_api from "../../crawler/naver_map/naver_api";
import fs from "fs";
import { CrawlerConfig } from "../../interface/config";
import api from "../../api/api";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function processQuery(
  locations: string[],
  words: string[],
  handlefilterlist = (item: any) => {
    if (item.tel.substr(0, 3) === "010") return false;
    if (item.tel.substr(0, 3) === "050") return false;
    if (item.tel.substr(0, 3) === "011") return false;

    if (item.tel === "") return false;
    if (item.isAdultBusiness === true) return false;
    if (!item.roadAddress) {
      return false;
    } else {
    }
    return true;
  }
) {
  let searchquery: string[] = [];
  let resultData: string[] = [];

  for (let wordindex = 0; wordindex < words.length; wordindex++) {
    const word = words[wordindex];
    for (let placeindex = 0; placeindex < locations.length; placeindex++) {
      const location = locations[placeindex];
      await new Promise((time) => setTimeout(time, config.NaverdelayMs));
      const query = `${location} ${word}`;
      console.log(query);

      let result = await naver_api.naverRequestAPI({
        query: query,
      });

      searchquery = get(result, "data.result.place.list", []).map(
        (item: any) => ({
          ...item,
          searchedQuery: result.data.result.metaInfo.searchedQuery,
        })
      );

      searchquery = searchquery.filter((item: any) => handlefilterlist(item));

      resultData = resultData.concat(searchquery);

      await api.completeArea(location);
      await api.completeCategory(word);

      console.log(`데이터 받는 중 ... ${searchquery.length}`);
      processData(searchquery);
    }
  }
  return resultData;
}

export function processData(result?: any) {
  let data = result.map((item?: any) => {
    const resultList: requestData = {
      id: item.id,
      name: item.name,
      tel: item.tel,
      category: item.category || [],
      categoryPath: item.categoryPath,
      rcode: item.rcode,
      address: item.address,
      roadAddress: item.roadAddress,
      abbrAddress: item.abbrAddress,
      shortAddress: item.shortAddress,
      context: [],
      x: item.x,
      y: item.y,
      homePage: item.homePage,
      menuInfo: item.menuInfo,
      microReview: item.microReview || [],
    };
    return resultList;
  });

  data = uniqBy(data, "tel");
  data = uniqBy(data, "roadAddress");

  existnumber(data);
  return data;
}

export async function existnumber(data: any) {
  let phoneNumber: string[] = [];
  data.forEach((item: requestData) => {
    phoneNumber.push(item.tel.replace(/-/g, ""));
  });
  await ProcessApiExistCheck(phoneNumber, data);
}
