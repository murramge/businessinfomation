import axios from "axios";

export const API_URL = "http://test.manager.ok114.kr/api/bizData/";
export const API_AXIOS = axios.create({ baseURL: API_URL });
