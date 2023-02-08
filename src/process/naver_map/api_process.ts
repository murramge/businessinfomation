import { resultLists } from "../../interface/output";
import { ApiExistCheck } from "../../api/ApidataExistCheck";

import fs from "fs";

export async function ProcessApiExistCheck(resultJson: any) {
  const result = await ApiExistCheck(resultJson);
  const DBdata = result.data.data;
  let dataArr: any = [];
  let dbdataArr: any = [];
  DBdata.map((data: any) => {
    if (data.exists === false) {
      dataArr.push(data);
    }
  });

  dataArr.forEach((data: any) => {
    resultJson.forEach((rjson: resultLists) => {
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
