import { application } from "express";
import { requestData } from "../interface/output";
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
  completeArea: (areaname: any) =>
    API_AXIOS.post(`/areaCollectComplete`, { areaName: areaname }),
  completeCategory: (categoryname: any) =>
    API_AXIOS.post(`/categoryCollectComplete`, { categoryName: categoryname }),
  addBizData: (bizCompanyInfo: any) =>
    API_AXIOS.post<{
      code: number;
      message: any;
      data: any;
    }>(
      `/addBizCompany`,

      { bizCompanyInfo: [bizCompanyInfo] }
    ),
};
