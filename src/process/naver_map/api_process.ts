import { resultLists } from "../../interface/output";

import fs from "fs";
import api from "../../api/api";

export async function ProcessApiExistCheck(phonenumber: any, datas: any) {
  const result = await api.existCheck(phonenumber);
  const DBdata = result.data.data.data;

  let dataArr: any = [];
  let dbdataArr: any = [];

  DBdata.map((data: any) => {
    if (data.exists === false) {
      dataArr.push(data);
    }
  });

  dataArr.forEach((data: any) => {
    datas.forEach((rjson: resultLists) => {
      if (data.phoneNumber === rjson.DBSaveTel) {
        dbdataArr.push(rjson);
      }
    });
  });

  fs.writeFile("dbdata.json", JSON.stringify(dbdataArr), function (err) {
    if (err) throw err;
  });
  console.log(dbdataArr);
}
