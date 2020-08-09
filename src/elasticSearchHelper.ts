import axios from "axios";
import {
  PureTextCardSettings,
  ImageCardSettings,
  CodeCardSettings,
  cardType,
  cardRelationMapping,
  cardTypes
} from "./card";

export const checkAndInitializePureTextCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "puretextcard/"
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "puretextcard/",
      data: PureTextCardSettings
    }).then(result => {
      console.log("PureTextCard建立index成功");
    });
  });

export const checkAndInitializeImageCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "imagecard/"
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "imagecard/",
      data: ImageCardSettings
    }).then(result => {
      console.log("ImageCard建立index成功");
    });
  });

export const checkAndInitializeCodeCardPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "codecard/"
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "codecard/",
      data: CodeCardSettings
    }).then(result => {
      console.log("CodeCard建立index成功");
    });
  });

export const checkAndInitializeCardRelationPromsie = axios({
  method: "head",
  baseURL: "/api",
  url: "card_relation/"
})
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
    // 建立index與mappings
    axios({
      method: "put",
      baseURL: "/api",
      url: "card_relation/",
      data: cardRelationMapping
    }).then(result => {
      console.log("card relation建立index成功");
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
    responseType: "json"
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

export const searchCardPromise = (cardType: cardType, queryObj?: any) => {
  if (queryObj) {
    return axios({
      method: "post",
      baseURL: "/api",
      url: `/${cardType.toLocaleLowerCase()}/_search?size=50`,
      data: { query: queryObj },
      responseType: "json"
    })
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    // 用get method
    return axios({
      method: "get",
      baseURL: "/api",
      url: `/${cardType.toLocaleLowerCase()}/_doc/_search?size=50`,
      responseType: "json"
    })
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }
};

export const relationFetchPromise = () => {
  return axios({
    method: "get",
    baseURL: "/api",
    url: "/card_relation/_search?size=100",
    responseType: "json"
  })
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(err => {
      console.log(err);
    });
};

export const AddRelationPromise = (data: { id: string; name: string }) => {
  return axios({
    method: "POST",
    baseURL: "/api",
    url: "/card_relation/_doc",
    data: data,
    responseType: "json"
  })
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(err => {
      console.log(err);
    });
};

export const addRelationToCardPromise = (
  data: { relation_name: string; related_card: string[] }[],
  cardID: string,
  cardType: cardType
) => {
  return axios({
    method: "post",
    baseURL: "/api",
    url: `/${cardType.toLowerCase()}/_doc/${cardID}/_update`,
    data: {
      doc: {
        /* eslint-disable @typescript-eslint/camelcase */
        card_relation_sets: data
      }
    },
    responseType: "json"
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

export const getCardsByIdArr = (cardType: cardType, IdArr: string[]) => {
  const multiCardIndex = cardTypes
    .map(type => type.toLocaleLowerCase())
    .join(",");
  console.log(multiCardIndex);
  return axios({
    method: "post",
    baseURL: "/api",
    url: `/${cardType.toLowerCase()}/_doc/_mget`,
    data: { ids: IdArr },
    responseType: "json"
  })
    .then(result => {
      console.log(result);
      return result;
    })
    .catch(err => {
      console.log(err);
    });
};
