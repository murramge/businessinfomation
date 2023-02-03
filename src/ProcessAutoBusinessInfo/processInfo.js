import { TEST_LOCATION } from "../Location/Location.js";
import pkg from "lodash";
import fs from "fs";
import { searchFromNaver } from "../requestAutoBusinessInfo/requestInfo.js";
const { get } = pkg;
import schedule from "node-schedule";

const TEST_WORD = ["음식점"];

const importQuerys = async (
  locations,
  words,
  handlefilterlist = () => true,
  handlefilterDetail = () => true
) => {
  let targets = [];

  for (let wordindex = 0; wordindex < words.length; wordindex++) {
    const word = words[wordindex];
    for (let placeindex = 0; placeindex < locations.length; placeindex++) {
      const location = locations[placeindex];
      await new Promise((time) => setTimeout(time, 1000));
      const query = `${location} ${word}`;
      let searchList = await searchFromNaver(query);
      searchList = searchList.filter((item) => handlefilterlist(item));

      targets = targets.concat(searchList);
    }
  }
  return targets;
};

export const resultList = (async () => {
  const result = await importQuerys(TEST_LOCATION, TEST_WORD, (item) =>
    removerList(item)
  );
  let resultJson = result.map((item) => {
    const times = BusinessTimes(item);

    console.log(times);

    const resultList = {
      Id: item.id,
      Tel: item.tel,
      CompanyNamd: item.name,
      virtualTel: item.virtualTel,
      Address: item.address,
      Category: (item.category || []).join(","),
      businessHours: times.busniessTime,
    };
  });

  //   const result = {
  //     Id: item.id,
  //     Tel: item.tel,
  //     Name: item.name,
  //     Address: item.address,
  //     Category: (item.category || []).join(","),
  //     RoadAddress: item.roadAddress,
  //     AbbrAddress: item.abbrAddress,
  //     Context: item.context.join(","),
  //     BizHourInfo: item.bizhourInfo,
  //     MenuInfo: item.menuInfo,
  //     MenuExist: item.menuExist,
  //     HomePage: item.homePage,
  //     Description: item.description,
  //     XValue: item.x,
  //     YValue: item.y,
  //     IsPersonalNum: item.tel.substr(0, 3) === "050" ? 1 : 0,
  //     InsertMCode: "bb-90083",
  //     AssembleId: 0,
  //     IsInsert: 0,
  //     // 리퀘스트 ID 입력할것
  //     RequestId: 9999999999,
  //     searchedQuery: item.searchedQuery,
  //     reviewCount: get(item, "detail.reviewCount", 0),
  //     imageCount: get(item, "detail.images.length", 0),
  //   };
  //   return result;
  // });

  fs.writeFile("result.json", JSON.stringify(resultJson), (err) => {
    if (err) throw err;
    console.log("result.json 파일 쓰기 완료");
  });
})();

const removerList = (item) => {
  if (item.tel.substr(0, 3) === "010") return false;
  if (item.tel.substr(0, 3) === "050") return false;
  if (item.tel.substr(0, 3) === "011") return false;

  if (!item.roadAddress) {
    return false;
  } else {
    // console.log(item);
  }
  return true;
};

const BusinessTimes = (item) => {
  let timeSet = (time) => {
    let timeset = {};
    if (time[0] !== "") {
      const firsttime = `${time[0].substring(8, 10)}:${time[0].substring(
        10,
        12
      )}`;
      if (time[1]) {
        const secondtime = `${time[1].substring(8, 10)}:${time[1].substring(
          10,
          12
        )}`;
        timeset = { alltime: `${firsttime}-${secondtime}` };
      }
      timeset = { lastorder: firsttime };

      return timeset;
    } else {
      const timeset = {
        alltime: "",
        lastorder: "",
      };
      return timeset;
    }
  };

  let busniessTime = item.businessStatus.businessHours.split("~") || [];
  busniessTime = timeSet(busniessTime);
  busniessTime = busniessTime.alltime;

  let breakTime = item.businessStatus.breakTime.split("~") || [];
  breakTime = timeSet(breakTime) || [];
  breakTime = breakTime.alltime;

  let lastOrder = item.businessStatus.lastOrder.split("~") || [];
  lastOrder = timeSet(lastOrder) || [];
  lastOrder = lastOrder.lastorder;

  const times = {
    busniessTime: busniessTime,
    breakTime: breakTime,
  };
  return times;
};

// export const resultList = schedule.scheduleJob("* * * * * * ", () => {
//   (async () => {
//     const result = await importQuerys(TEST_LOCATION, TEST_WORD);

//     let resultJson = result.map((item) => {
//       const result = {
//         Id: item.id,
//         Tel: item.tel,
//         VirtualTel: item.tel,
//         Name: item.name,
//         Address: item.address,
//         Category: (item.category || []).join(","),
//         RoadAddress: item.roadAddress,
//         AbbrAddress: item.abbrAddress,
//         Context: item.context.join(","),
//         BizHourInfo: item.bizhourInfo,
//         MenuInfo: item.menuInfo,
//         MenuExist: item.menuExist,
//         HomePage: item.homePage,
//         Description: item.description,
//         XValue: item.x,
//         YValue: item.y,
//         IsPersonalNum: item.tel.substr(0, 3) === "050" ? 1 : 0,
//         InsertMCode: "bb-90083",
//         AssembleId: 0,
//         IsInsert: 0,
//         // 리퀘스트 ID 입력할것
//         RequestId: 9999999999,
//         searchedQuery: item.searchedQuery,
//         reviewCount: get(item, "detail.reviewCount", 0),
//         imageCount: get(item, "detail.images.length", 0),
//       };
//       return result;
//     });
//     fs.writeFile("result.json", JSON.stringify(resultJson), (err) => {
//       if (err) throw err;
//       console.log("result.json 파일 쓰기 완료");
//     });
//   })();
// });
