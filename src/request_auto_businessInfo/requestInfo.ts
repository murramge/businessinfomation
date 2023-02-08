import urlencode from "urlencode";
import axios from "axios";
import pkg from "lodash";
const { get } = pkg;
const config = require("../../config.json");

export const searchFromNaver = async (query: any) => {
  interface defaultParam {
    caller: any;
    type: string;
    displayCount: number;
  }

  const defaultParam: defaultParam = {
    caller: "pcweb",
    type: "place",
    displayCount: config.defaultDisplayCount,
  };
  const param = {
    ...defaultParam,
    query,
  };
  const params = Object.keys(param)
    .map((paramkey: any) => {
      return `${paramkey}=${urlencode(param[paramkey as keyof defaultParam])}`;
    })
    .join("&");
  const naverUrl = `https://map.naver.com/v5/api/search?${params}`;

  const result = await axios.get(naverUrl);

  return get(result, "data.result.place.list", []).map((item: any) => ({
    ...item,
    searchedQuery: result.data.result.metaInfo.searchedQuery,
  }));
};
