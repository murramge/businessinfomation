import urlencode from "urlencode";
import axios from "axios";
import { DISPLAY_COUNT } from "../constFile/const.js";

import pkg from "lodash";

const { get } = pkg;

export const searchFromNaver = async (query) => {
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
