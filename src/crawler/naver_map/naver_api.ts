import axios from "axios";

interface SearchResult {
  result: {
    type: string;
    metaInfo: {
      pageId: string;
      sessionId: any;
      searchedQuery: string;
    };
    address: any;
    place: {
      page: number;
      totalCount: number;
      boundary: any[];
      feedback: any[];
      options: any[];
      filters: object;
      reSearch: any;
      isSiteSortAvailable: boolean;
      specializedSearch: any;
      hasPollingPlace: boolean;
      isAdultKeyword: boolean;
      containAdultContents: boolean;
      address: any;
      brandPromotion: any;
      list: any[];
    };
  };
}

interface naverRequestAPIparams {
  caller?: any;
  type?: string;
  displayCount?: number;
  query?: string;
}

export default {
  naverRequestAPI(params: naverRequestAPIparams) {
    const naverUrl = `https://map.naver.com/v5/api/search?`;

    const defaultParam: naverRequestAPIparams = {
      caller: "pcweb",
      type: "place",
      displayCount: 300,
    };

    let param = {
      ...defaultParam,
      ...params,
    };

    return axios.get<SearchResult>(naverUrl, {
      params: param,
    });
  },
};
