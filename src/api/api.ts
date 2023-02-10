import { API_AXIOS } from "./Axios";

export default {
  existCheck: (phoneNumber: string[], count: number = 20) =>
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
};
