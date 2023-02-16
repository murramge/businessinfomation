import { requestData } from "../../interface/output";
import { chunk } from "lodash";
import api from "../../api/api";
import { loger } from "../../loger";
import fs from "fs";
import { CrawlerConfig } from "../../interface/config";

const json = fs.readFileSync(`${__dirname}/config.json`);
const config: CrawlerConfig = JSON.parse(json.toString());

export async function ProcessApiExistCheck(phonenumber: any, requestdata: any) {
  let chunkfiles: string[][] = chunk(phonenumber, config.ExistMaxPhoneCount);

  for (let i = 0; i < chunkfiles.length; i++) {
    (async function () {
      const result = await api.existCheck(
        chunkfiles[i],
        config.ExistMinPhoneCount
      );
      const ExistDBdata = result.data.data.data;
      const NonExistData: string[] = [];
      const CompleteData: string[] = [];

      ExistDBdata.forEach((existdata: any) => {
        if (existdata.exists === false) {
          NonExistData.push(existdata);
        }
      });

      console.log(NonExistData);
      NonExistData.forEach((noexist: any) => {
        requestdata.forEach((dataitem: any) => {
          if (noexist.phoneNumber === dataitem.tel.replace(/-/g, "")) {
            CompleteData.push(dataitem);
          }
        });
      });

      CompleteData.forEach((saveData) => {
        api.addBizData(saveData);
      });

      console.log(`existDB` + ExistDBdata.length);
      console.log(`non` + NonExistData.length);
      console.log(`CompleteData` + CompleteData.length);
      console.log(`i` + i);

      await new Promise((time) => setTimeout(time, config.ExistdelayMs));
    })();
  }
}
