import urlencode from "urlencode";
import axios from "axios";
import { DISPLAY_COUNT } from "./src/constFile/const.js";
import { LOCATION_1, LOCATION_2 } from "./Location/Location.js";
import pkg from "lodash";
import fs from "fs";

const { get } = pkg;
const TEST_LOCATION = ["두정동"];
const TEST_WORD = ["음식점"];

const searchFromNaver = async (query) => {
  const defaultParam = {
    caller: "pcweb",
    type: "place",
    displayCount: DISPLAY_COUNT,
  };
  const param = {
    ...defaultParam,
    query,
  };
  const params = Object.keys(param)
    .map((paramkey) => {
      return `${paramkey}=${urlencode(param[paramkey])}`;
    })
    .join("&");
  const naverUrl = `https://map.naver.com/v5/api/search?${params}`;

  const result = await axios.get(naverUrl);

  return get(result, "data.result.place.list", []).map((item) => ({
    ...item,
    searchedQuery: result.data.result.metaInfo.searchedQuery,
  }));
};

const importQuerys = async (locations, words) => {
  let targets = [];
  for (let wordindex = 0; wordindex < words.length; wordindex++) {
    const word = words[wordindex];
    for (let placeindex = 0; placeindex < locations.length; placeindex++) {
      const location = locations[placeindex];
      await new Promise((time) => setTimeout(time, 1000));
      const query = `${location} ${word}`;
      const searchList = await searchFromNaver(query);
      targets = targets.concat(searchList);
    }
  }
  return targets;
};

(async () => {
  const result = await importQuerys(TEST_LOCATION, TEST_WORD);

  let resultJson = result.map((item) => {
    const result = {
      Id: item.id,
      Tel: item.tel,
      VirtualTel: item.tel,
      Name: item.name,
      Address: item.address,
      Category: (item.category || []).join(","),
      RoadAddress: item.roadAddress,
      AbbrAddress: item.abbrAddress,
      Context: item.context.join(","),
      BizHourInfo: item.bizhourInfo,
      MenuInfo: item.menuInfo,
      MenuExist: item.menuExist,
      HomePage: item.homePage,
      Description: item.description,
      XValue: item.x,
      YValue: item.y,
      IsPersonalNum: item.tel.substr(0, 3) === "050" ? 1 : 0,
      InsertMCode: "bb-90083",
      AssembleId: 0,
      IsInsert: 0,
      // 리퀘스트 ID 입력할것
      RequestId: 9999999999,
      searchedQuery: item.searchedQuery,
      reviewCount: get(item, "detail.reviewCount", 0),
      imageCount: get(item, "detail.images.length", 0),
    };
    return result;
  });

  fs.writeFile("result.json", JSON.stringify(resultJson), (err) => {
    if (err) throw err;
    console.log("result.json 파일 쓰기 완료");
  });
})();
