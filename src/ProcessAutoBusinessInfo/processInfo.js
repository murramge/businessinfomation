import { TEST_LOCATION } from "../Location/Location.js";
import pkg from "lodash";
import fs from "fs";
import { searchFromNaver } from "../requestAutoBusinessInfo/requestInfo.js";
const { get } = pkg;
import schedule from "node-schedule";

const TEST_WORD = ["음식점"];

const importQuerys = async (locations, words) => {
  let targets = [];
  for (let wordindex = 0; wordindex < words.length; wordindex++) {
    const word = words[wordindex];
    for (let placeindex = 0; placeindex < locations.length; placeindex++) {
      const location = locations[placeindex];
      await new Promise((time) => setTimeout(time, 10000));
      const query = `${location} ${word}`;
      const searchList = await searchFromNaver(query);
      targets = targets.concat(searchList);
    }
  }
  return targets;
};

export const resultList = schedule.scheduleJob("* * 1 * * * ", () => {
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
});

export const outputlist = () => {
  return resultList;
};
