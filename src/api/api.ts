import { API_AXIOS } from "./Axios";

export default {
  existCheck: (phoneNumber: string[], count: number) =>
    API_AXIOS.post<{
      code: number;
      message: any;
      data: {
        count: number;
        data: Array<{
          phoneNumber: string;
          situationCode: string;
          exists: boolean;
        }>;
      };
    }>(`/exists`, {
      count: count,
      phoneNumber: phoneNumber,
    }),
  searchArea: (size: number) =>
    API_AXIOS.get<{
      code: number;
      message: any;
      data: string[];
    }>(`/targetAreaName?size=${size}`),
  searchCategory: (size: number) =>
    API_AXIOS.get<{
      code: number;
      message: any;
      data: string[];
    }>(`/targetCategoryName?size=${size}`),
  completeArea: (formdata: any) =>
    API_AXIOS.post(`/areaCollectComplete`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  completeCategory: (formdata: any) =>
    API_AXIOS.post(`/categoryCollectComplete`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
