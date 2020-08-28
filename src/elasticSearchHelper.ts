import axios from "axios";
import { cardType, PureTextCardSettings, CardSettingInterface } from "./Card";

const elasticSearchURL = "http://127.0.0.1:9200/";

export const getAllCard = axios({
  method: "get",
  baseURL: elasticSearchURL,
  url: "_search/"
}).then(result => {
  return result.data;
});

export const getAllIndex = () =>
  axios({
    method: "GET",
    baseURL: elasticSearchURL,
    url: "_all/"
  })
    .then(result => {
      return result.data;
    })
    .catch(error => {
      return null;
    });

export const deleteAllIndex = () =>
  axios({
    method: "DELETE",
    baseURL: elasticSearchURL,
    url: "_all"
  })
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error.response.data);

      return false;
    });

export const checkAndInitializePureTextCardPromsie = () =>
  axios({
    method: "head",
    baseURL: elasticSearchURL,
    url: "puretextcard/"
  })
    .then(result => {
      return true;
    })
    .catch(async err => {
      console.log("沒有建立PureTextCard的index");
      // 建立index與mappings
      const success = await axios({
        method: "put",
        baseURL: elasticSearchURL,
        url: "puretextcard/",
        data: PureTextCardSettings
      })
        .then(result => {
          console.log("PureTextCard建立index成功");
          return true;
        })
        .catch(error => {
          return false;
        });
      return success;
    });

export const checkCardIndexPromise = (cardType: cardType, redirect: boolean) =>
  axios({
    method: "head",
    baseURL: redirect ? "/api" : elasticSearchURL,
    url: `${cardType.toLocaleLowerCase()}/`
  });

export const checkAndCreateCardIndexPromise = (
  cardType: cardType,
  cardSetting: CardSettingInterface,
  redirect: boolean
) =>
  axios({
    method: "head",
    baseURL: redirect ? "/api" : elasticSearchURL,
    url: `${cardType.toLocaleLowerCase()}/`
  })
    .then(result => {
      return true;
    })
    .catch(async err => {
      console.log(`沒有建立${cardType}的index`);
      // 建立index與mappings
      const success = await axios({
        method: "put",
        baseURL: redirect ? "/api" : elasticSearchURL,
        url: `${cardType.toLocaleLowerCase()}/`,
        data: cardSetting
      })
        .then(result => {
          console.log(`${cardType}建立index成功`);
          return true;
        })
        .catch(error => {
          console.error(error.response.data);

          return false;
        });
      return success;
    });

export const createSanpShotPromise = (
  repository: string,
  snapshotName: string
) =>
  axios({
    method: "PUT",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}/${snapshotName}`
  });

export const createSnapShotRepository = (repository: string) =>
  axios({
    method: "PUT",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}`,
    data: {
      type: "fs",
      settings: { location: "E:/elasticSearch backup repository" }
    }
  })
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error.response.data);
      return false;
    });

export const readSnapShotRepository = (repository: string) =>
  axios({
    method: "GET",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}`
  })
    .then(result => {
      return result.data;
    })
    .catch(error => {
      return null;
    });

export const deleteSnapShotRepository = (repository: string) =>
  axios({
    method: "DELETE",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}`,
    // eslint-disable-next-line @typescript-eslint/camelcase
    data: { wait_for_completion: true }
  })
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error.response.data);

      return false;
    });

export const createSanpshot = (repository: string, snapshot: string) =>
  axios({
    method: "PUT",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}/${snapshot}?wait_for_completion=true`
  })
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error.response.data);
      return false;
    });

export const deleteSnapshot = (repository: string, snapshot: string) => {
  axios({
    method: "DELETE",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}/${snapshot}?wait_for_completion=true`
  })
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error.response.data);

      return false;
    });
};

export const restoreBySnapshot = (repository: string, snapshot: string) =>
  axios({
    method: "POST",
    baseURL: elasticSearchURL,
    url: `_snapshot/${repository}/${snapshot}/_restore?wait_for_completion=true`
  });
