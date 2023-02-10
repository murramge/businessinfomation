import { resultLists } from "../../interface/output";
import { uniqBy } from "lodash";
import { chunk } from "lodash";
const fs = require("fs");
import api from "../../api/api";

export async function ProcessApiExistCheck(phonenumber: any, datas: any) {
  let chunkfiles: string[][] = chunk(phonenumber, 50);
  let DBdata: any = [];
  let dataArr: any = [];
  let dbdataArr: any = [];

  function times(i: any) {
    if (i < chunkfiles.length) {
      setTimeout(
        () => {
          api.existCheck(chunkfiles[i]).then(async (result) => {
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
            if (fs.existsSync("result1.json")) {
              const file = await fs.promises.readFile("result1.json");
              dbdataArr = JSON.parse(file.toString()).concat(dbdataArr);
              dbdataArr = uniqBy(dbdataArr, "Tel");
              dbdataArr = uniqBy(dbdataArr, "RoadAddress");
            } else {
              console.log(" ");
            }
            handlefsWrite("result1.json", dbdataArr);
          });
          i++;
          times(i);
        },
        i == 0 ? 0 : 2000
      );
    }
  }
  times(0);

  // if (!!DBdata.length) {
  //   DBdata.map((data: any) => {
  //     if (data.exists === false) {
  //       console.log(data);
  //       dataArr.push(data);
  //     }
  //   });

  //   // console.log(dataArr);
  //   dataArr.forEach((data: any) => {
  //     datas.forEach((rjson: resultLists) => {
  //       if (data.phoneNumber === rjson.DBSaveTel) {
  //         dbdataArr.push(rjson);
  //       }
  //     });
  //   });
  //   // console.log(dbdataArr);
  // }
}

// console.log(i);
// setTimeout(async () => {
//   console.log(i);
//   let dataArr: any = [];
//   let dbdataArr: any = [];
//   console.log(chunkfile);
//   const result = await api.existCheck(chunkfile);
//   console.log(result);
// const DBdata = result.data;

// console.log(DBdata);

// DBdata.map((data: any) => {
//   if (data.exists === false) {
//     dataArr.push(data);
//   }
// });

// dataArr.forEach((data: any) => {
//   datas.forEach((rjson: resultLists) => {
//     if (data.phoneNumber === rjson.DBSaveTel) {
//       dbdataArr.push(rjson);
//     }
//   });
// });

// if (fs.existsSync("result1.json")) {
//   const file = await fs.promises.readFile("result1.json");
//   dbdataArr = JSON.parse(file.toString()).concat(dbdataArr);
//   dbdataArr = uniqBy(dbdataArr, "Tel");
//   dbdataArr = uniqBy(dbdataArr, "RoadAddress");
// } else {
//   console.log(" ");
// }

// handlefsWrite("result1.json", dbdataArr);

// chunkfile.forEach(async (phone: string[]) => {
//   let dataArr: any = [];
//   let dbdataArr: any = [];

//   const result = api.existCheck(phone);
// });
// const DBdata = result.data.data.data;
// DBdata.map((data: any) => {
//   if (data.exists === false) {
//     dataArr.push(data);
//   }
// });

// console.log(dataArr);
// dataArr.forEach((data: any) => {
//   datas.forEach((rjson: resultLists) => {
//     if (data.phoneNumber === rjson.DBSaveTel) {
//       dbdataArr.push(rjson);
//     }
//   });
// });

// handlefsWrite("result2.json", dbdataArr);
// });

const handlefsWrite = (filename, dataArr) => {
  fs.promises.writeFile(filename, JSON.stringify(dataArr), function (err) {
    if (err) throw err;
  });
};

// if (fs.existsSync("result1.json")) {
//   const file = await fs.promises.readFile("result1.json");
//   dbdataArr = JSON.parse(file.toString()).concat(dbdataArr);
//   dbdataArr = uniqBy(dbdataArr, "Tel");
//   dbdataArr = uniqBy(dbdataArr, "RoadAddress");
// } else {
//   console.log(" ");
// }

// handlefsWrite("result1.json", dbdataArr);
