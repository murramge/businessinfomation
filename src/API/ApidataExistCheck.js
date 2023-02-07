import fs from "fs";
import { API_AXIOS } from "../constFile/Axios.js";

export const bb = (async () => {
  let phoneNumber = [];
  if (fs.existsSync("result.json")) {
    const file = await fs.promises.readFile("result.json");
    const item = JSON.parse(file.toString());
    item.forEach((itemd, index) => {
      phoneNumber.push(itemd.DBSaveTel);
    });
    // console.log("result.json 파일 존재");
  }

  const dataexist = async () => {
    const response = await API_AXIOS.post(`/exists`, {
      count: 100,
      phoneNumber: phoneNumber,
    });
    return response.data.data;
  };

  return dataexist();
})();
