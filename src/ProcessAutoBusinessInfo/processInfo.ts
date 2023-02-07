import { TEST_LOCATION } from "../Location/Location.js";
import fs from "fs";
import { searchFromNaver } from "../requestAutoBusinessInfo/requestInfo";
import { get, uniqBy } from "lodash";
import { ApiExistCheck } from "../API/ApidataExistCheck.js";

const TEST_WORD = ["음식점"];

const importQuerys = async (
  locations: string[],
  words: string[],
  handlefilterlist = (any: any) => true,
  handlefilterDetail = () => true
) => {
  let targets: string[] = [];

  for (let wordindex = 0; wordindex < words.length; wordindex++) {
    const word = words[wordindex];
    for (let placeindex = 0; placeindex < locations.length; placeindex++) {
      const location = locations[placeindex];
      await new Promise((time) => setTimeout(time, 1000));
      const query = `${location} ${word}`;
      let searchList = await searchFromNaver(query);
      searchList = searchList.filter((item: any) => handlefilterlist(item));

      targets = targets.concat(searchList);
    }
  }
  return targets;
};

export const resultList = (async () => {
  const result = await importQuerys(TEST_LOCATION, TEST_WORD, (item) =>
    removerList(item)
  );
  let resultJson = result.map((item?: any) => {
    const times = BusinessTimes(item);
    const address = BusinessAddress(item);
    const dbSaveTel = item.tel.replace(/-/g, "");
    interface resultList {
      Id: number;
      Tel: string;
      DBSaveTel: number;
      CompanyName: string;
      VirtualTel: string;
      Address: string;
      RoadAddress: string;
      AbbrAddress: string;
      ShortAddress: string[];
      BusinessSi: string;
      BusinessGu: string;
      BusinessDong: string;
      RoadBasic: string;
      RoadBasicNo: string;
      RoadOnlyAddr: string;
      ZoneBasic: string;
      ZoneBasicNo: string;
      ZoneOnlyAddr: string;
      Category: string[];
      BusinessHours: string;
      BreakTime: string;
      LastOrder: string;
      HomePage: string;
      BusinessStatus: string;
      Description: string;
      ThumURL: string[];
      MenuInfo: string[];
      XValue: string;
      YValue: string;
      CardPayMent: any;
      ParkingPrice: string;
      RequestId: number;
      IsInsert: number;
      InsertMCode: string;
      AssembleId: number;
      ReviewCount: number;
      imageCount: number;
      searchedQuery: string;
    }

    const resultList: resultList = {
      Id: item.id,
      Tel: item.tel,
      DBSaveTel: dbSaveTel,
      CompanyName: item.name,
      VirtualTel: item.virtualTel,
      Address: item.address,
      RoadAddress: item.roadAddress,
      AbbrAddress: item.abbrAddress,
      ShortAddress: item.shortAddress,
      BusinessSi: address.bizCity,
      BusinessGu: address.GuName,
      BusinessDong: address.DongName,
      RoadBasic: address.roadbasic,
      RoadBasicNo: address.roadBasicNo,
      RoadOnlyAddr: address.roadOnlyAddr,
      ZoneBasic: address.zonebasic,
      ZoneBasicNo: address.zoneBasicNo,
      ZoneOnlyAddr: address.zoneOnlyAddr,
      Category: (item.category || []).join(","),
      BusinessHours:
        times.busniessTime == "" ? "업체에 문의해주세요." : times.busniessTime,
      BreakTime:
        times.breakTime == "" ? "업체에 문의해주세요." : times.breakTime,
      LastOrder:
        times.lastOrder == "" ? "업체에 문의해주세요" : times.lastOrder,
      HomePage: item.homePage,
      BusinessStatus: item.bizhourInfo,
      Description: item.description,
      ThumURL: item.thumUrls,
      MenuInfo: item.menuInfo.split("|"),
      CardPayMent: item.card == null ? "업체에 문의해주세요" : item.card,
      ParkingPrice:
        item.parkingPrice == null ? "업체에 문의해주세요" : item.parkingPrice,
      XValue: item.x,
      YValue: item.y,
      IsInsert: 0,
      InsertMCode: "bb-90060",
      AssembleId: 0,
      RequestId: 99999999,
      ReviewCount: item.reviewCount,
      imageCount: get(item, "detail.images.length", 0),
      searchedQuery: item.searchedQuery,
    };

    return resultList;
  });

  //네이버 api 불러왔을 때, item들 각각의 중복제거
  resultJson = uniqBy(resultJson, "Tel");
  resultJson = uniqBy(resultJson, "RoadAddress");

  console.log(`[ ${resultJson.length} ] 개 데이터 수집됨`);

  type ApiDataType = {
    phoneNumber: number;
    situationCode: number;
    exists: boolean;
  };

  if (fs.existsSync("result.json")) {
    (async () => {
      const result = await ApiExistCheck;
      result.data.forEach((data: ApiDataType) => {
        console.log(data.exists);
      });
    })();
  }

  console.log(`TOTAL : [ ${resultJson.length} ] 개 데이터 수집됨`);

  fs.writeFile("result.json", JSON.stringify(resultJson), function (err) {
    if (err) throw err;
  });
})();

const removerList = (item: any) => {
  if (item.tel.substr(0, 3) === "010") return false;
  if (item.tel.substr(0, 3) === "050") return false;
  if (item.tel.substr(0, 3) === "011") return false;
  if (item.isAdultBusiness === true) return false;

  if (!item.roadAddress) {
    return false;
  } else {
    // console.log(item);
  }
  return true;
};

const BusinessAddress = (item: any) => {
  let Address: any = {};
  const replaceCity = (str: string) => {
    return str
      .replace("강원도", "강원")
      .replace("경기도", "경기")
      .replace("경상남도", "경남")
      .replace("경상북도", "경북")
      .replace("광주광역시", "광주")
      .replace("대구광역시", "대구")
      .replace("대전광역시", "대전")
      .replace("부산광역시", "부산")
      .replace("서울특별시", "서울")
      .replace("세종특별자치시", "세종")
      .replace("울산광역시", "울산")
      .replace("인천광역시", "인천")
      .replace("전라남도", "전남")
      .replace("전라북도", "전북")
      .replace("제주특별자치도", "제주")
      .replace("충청남도", "충남")
      .replace("충청북도", "충북");
  };

  const dataAddress = (basic: string, divaddr: any) => {
    return basic.concat(!!basic ? " " : "").concat(divaddr);
  };

  const totalAddress = (addr: string[], index: number) => {
    if (!!addr.length) {
      addr[0] = replaceCity(addr[0]);
      Address.bizCity = addr[0];
    }

    let roadbasic: string = "";
    let zonebasic: string = "";
    let roadBasicNo: string = "";
    let zoneBasicNo: string = "";
    let DongName: string = "";
    let GuName: string = "";

    for (let key in addr) {
      const divaddr = addr[key];

      if (divaddr.match(/^(산? ?\d{1,5}(~|-)\d{1,5})$|^(산? ?\d{1,5})$/g)) {
        if (index == 1) {
          roadBasicNo = divaddr;
          Address.roadBasicNo = divaddr;
        } else if (index == 0) {
          zoneBasicNo = divaddr;
          Address.zoneBasicNo = divaddr;
        }
        break;
      }

      if (index === 1) {
        roadbasic = dataAddress(roadbasic, divaddr);
        Address.roadbasic = roadbasic;
      } else if (index === 0) {
        zonebasic = dataAddress(zonebasic, divaddr);
        Address.zonebasic = zonebasic;

        if (
          !DongName &&
          ["읍", "면", "동", "가"].some((str) => divaddr.includes(str))
        ) {
          DongName = divaddr;
          Address.DongName = DongName;
        }
        if (!GuName && ["구"].some((str) => divaddr.includes(str))) {
          Address.GuName = divaddr;
        }
      }
    }
    if (index === 1) {
      const roadonly = roadbasic.concat(" ", roadBasicNo);
      Address.roadOnlyAddr = roadonly;
    } else if (index === 0) {
      const zoneonly = zonebasic.concat(" ", zoneBasicNo);
      Address.zoneOnlyAddr = zoneonly;
    }

    return Address;
  };

  if (!!item.roadAddress && item.roadAddress.length) {
    totalAddress(item.roadAddress.split(" "), 1);
  }
  if (!!item.address && item.address.length) {
    totalAddress(item.address.split(" "), 0);
  }
  return Address;
};

const BusinessTimes = (item: any) => {
  let timeSet = (time: string[]) => {
    let timeset = {};
    let firsttime = "";
    let secondtime = "";
    if (time[0] !== "") {
      firsttime = `${time[0].substring(8, 10)}:${time[0].substring(10, 12)}`;
      if (time[1]) {
        secondtime = `${time[1].substring(8, 10)}:${time[1].substring(10, 12)}`;
      }
      timeset = {
        alltime: `${firsttime}~${secondtime}`,
        lastorder: firsttime,
      };

      return timeset;
    } else {
      const timeset = {
        alltime: "",
        lastorder: "",
      };
      return timeset;
    }
  };

  let busniessTime = item.businessStatus.businessHours.split("~");

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
    lastOrder: lastOrder,
  };
  return times;
};
