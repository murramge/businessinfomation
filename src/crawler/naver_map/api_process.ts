import { resultLists } from "../../interface/output";
import { uniqBy } from "lodash";
import { chunk } from "lodash";
import api from "../../api/api";
import { loger } from "../../loger";
import fs from "fs";
import { CrawlerConfig } from "../../interface/config";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function ProcessApiExistCheck(phonenumber: any, datas: any) {
  let chunkfiles: string[][] = chunk(phonenumber, config.ExistMaxPhoneCount);
  let DBdata: any = [];
  let dataArr: any = [];
  let dbdataArr: any = [];

  console.log(`중복 처리 값 ${phonenumber}`);

  function dataExistCheck(i: any) {
    if (i < chunkfiles.length) {
      setTimeout(
        () => {
          api
            .existCheck(chunkfiles[i], config.ExistMinPhoneCount)
            .then(async (result) => {
              DBdata = result.data.data.data;
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
              console.log(`저장된 데이터 ${dbdataArr.length}`);
              handlefsWrite("result1.json", dbdataArr);
            });
          i++;
          dataExistCheck(i);
        },
        i == 0 ? 0 : config.ExistdelayMs
      );
    }
  }

  dataExistCheck(0);

  const handlefsWrite = (filename, dataArr) => {
    dataArr = uniqBy(dataArr, "Tel");
    dataArr = uniqBy(dataArr, "RoadAddress");
    fs.promises.writeFile(filename, JSON.stringify(dataArr));
    loger(`${dataArr.length} 개의 데이터 저장`);
  };
}
