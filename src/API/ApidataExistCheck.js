import { API_AXIOS } from "../const_file/Axios.js";

export async function ApiExistCheck(item) {
  let phoneNumber = [];

  item.forEach((itemd, index) => {
    phoneNumber.push(itemd.DBSaveTel);
  });

  const dataexist = async () => {
    const response = await API_AXIOS.post(`/exists`, {
      count: 50,
      phoneNumber: phoneNumber,
    });
    return response.data;
  };

  return dataexist();
}
