import { API_AXIOS } from "../const_file/Axios";

export default {
  existCheck: async (phoneNumber: string[], count: number = 50) =>
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
