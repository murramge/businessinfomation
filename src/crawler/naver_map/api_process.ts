import { resultLists } from "../../interface/output";
import { uniqBy } from "lodash";
const fs = require("fs");
import api from "../../api/api";

export async function ProcessApiExistCheck(phonenumber: any, datas: any) {
  let currentIdx = 0;
  let phones: any = [];
  if (phonenumber.length > 50) {
    for (let i = 0; phonenumber.length; i++) {
      let idx = 0;
      while (idx < 50) {
        if (currentIdx == phonenumber.length) break;
        phones.push(phonenumber[currentIdx]);
        idx++;
        currentIdx++;
        // await new Promise((time) => setTimeout(time, 3000));
        if (idx == 50) {
          const result = await api.existCheck(phones);
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

          if (fs.existsSync("result1.json")) {
            const file = await fs.promises.readFile("result1.json");
            dbdataArr = JSON.parse(file.toString()).concat(dbdataArr);
            dbdataArr = uniqBy(dbdataArr, "Tel");
            dbdataArr = uniqBy(dbdataArr, "RoadAddress");
          } else {
            console.log(" ");
          }

          fs.promises.writeFile(
            "result1.json",
            JSON.stringify(dbdataArr),
            function (err) {
              if (err) throw err;
            }
          );
          console.log("1 false > " + dataArr.length);
          console.log("1 > " + dbdataArr.length);
          break;
        }
      }

      if (phones.length < 50) {
        const result = await api.existCheck(phones);
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

        fs.promises.writeFile(
          "result2.json",
          JSON.stringify(dbdataArr),
          function (err) {
            if (err) throw err;
          }
        );
        console.log("2 false > " + dataArr.length);
        console.log("2 > " + dbdataArr.length);
        break;
      }
      phones = [];
      if (currentIdx == phonenumber.length) break;
    }
  } else {
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

    (async () => {
      const datajson = fs.promises.writeFile(
        "result3.json",
        JSON.stringify(dbdataArr),
        function (err) {
          if (err) throw err;
        }
      );
    })();
    console.log("3 false > " + dataArr.length);
    console.log("3 > " + dbdataArr.length);
  }
}
