import axios from "axios";
import {
  PureTextCardSettings,
  ImageCardSettings,
  CodeCardSettings,
  cardType,
} from "./card";

export const checkAndInitializePureTextCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "puretextcard/",
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "puretextcard/",
      data: PureTextCardSettings,
    }).then((result) => {
      console.log("PureTextCard建立index成功");
    });
  });

export const checkAndInitializeImageCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "imagecard/",
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "imagecard/",
      data: ImageCardSettings,
    }).then((result) => {
      console.log("ImageCard建立index成功");
    });
  });

export const checkAndInitializeCodeCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "codecard/",
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "codecard/",
      data: CodeCardSettings,
    }).then((result) => {
      console.log("CodeCard建立index成功");
    });
  });

export const updateCardSingleField = (
  cardType: cardType,
  cardID: string,
  updateObj: { doc: { [key: string]: string } }
) => {
  axios({
    method: "post",
    baseURL: "/api",
    url: `/${cardType.toLowerCase()}/_doc/${cardID}/_update`,
    data: updateObj,
    responseType: "json",
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchCardPromise = (cardType: cardType, queryObj?: any) => {
  if (queryObj) {
    // TODO: 帶有query的搜尋，會用post
    return axios({
      method: "post",
      baseURL: "/api",
      url: `/${cardType.toLocaleLowerCase()}/_search?size=50`,
      data: { query: queryObj },
      responseType: "json",
    })
      .then((result) => {
        console.log(result);
        const cardsArr = result.data.hits.hits;
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // 用get method
    return axios({
      method: "get",
      baseURL: "/api",
      url: `/${cardType.toLocaleLowerCase()}/_doc/_search`,
      responseType: "json",
    })
      .then((result) => {
        console.log(result);
        const cardsArr = result.data.hits.hits;
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
