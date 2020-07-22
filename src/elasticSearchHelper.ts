import axios from "axios";
import { PureTextCardMappings, ImageCardMappings } from "./card";

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
      data: PureTextCardMappings,
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
      data: ImageCardMappings,
    }).then((result) => {
      console.log("ImageCard建立index成功");
    });
  });
