<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">stone card system</div>

      <v-spacer></v-spacer>

      <v-menu open-on-hover top offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon>
            <v-icon>import_export</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title @click="dropImportJsonDialog = true"
              >import</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="exportCards">export</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="addCardTF"
        color="error"
        @click="
          () => {
            addCardTF = !addCardTF;
          }
        "
        >cancel add card</v-btn
      >
      <v-menu open-on-hover top offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" dark v-on="on">add card</v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in cardTypes"
            :key="index"
            @click="
              () => {
                chooseCardType(item);
                addCardTrigger();
              }
            "
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-row style="height:50%">
        <v-card>
          <div
            id="allcardsContainer"
            @mousewheel="horizontalMouseScroll"
            class="d-flex flex-row custom-scroll-bar card-container"
            style="overflow:auto"
          >
            <div
              v-for="(card, index) in cards"
              v-bind:key="card.id"
              class="mx-6"
            >
              <component
                v-bind:is="card.type"
                @addCard="addCard"
                @deleteCard="deleteCard"
                containerName="allcardsContainer"
                :index="index"
                :cardData="card"
                :addCardTF="addCardTF"
              />
            </div></div
        ></v-card>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-card>
            <v-text-field
              label="搜尋卡片"
              hide-details="auto"
              prepend-icon="search"
              v-model="searchText"
              @input="updateSearch"
              style="margin:10px"
            ></v-text-field>

            <div
              class="d-flex flex-row custom-scroll-bar  card-container"
              style="overflow:auto"
              @mousewheel="horizontalMouseScroll"
            >
              <div
                v-for="(card, index) in filteredCards"
                v-bind:key="card.id"
                class="mx-6"
              >
                <component
                  v-bind:is="card.type"
                  containerName="searchContainer"
                  :index="index"
                  :cardData="card"
                  @deleteCard="deleteCard"
                />
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>固定卡片容器</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    <v-dialog v-model="dropImportJsonDialog" width="300">
      <v-card>
        <v-card-title>拖曳json檔到此</v-card-title>
        <drop-files-area
          style="height: 300px"
          @DropDownGetFiles="handleImoprtJson"
        ></drop-files-area>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import PureTextCard from "./components/PureTextCard.vue";
import ImageCard from "./components/ImageCard.vue";
import CodeCard from "./components/CodeCard.vue";
import DropFilesArea from "./components/DropFilesArea.vue";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  PureTextCardInterface,
  cardTypes,
  cardType,
  genralCardInterface,
  ImageCardInterface,
  PureTextCardSettings,
  ImageCardSettings,
  CodeCardInterface,
} from "./card";

import {
  checkAndInitializePureTextCardPromsie,
  checkAndInitializeImageCardPromsie,
  checkAndInitializeCodeCardPromsie,
  searchCardPromise,
} from "./elasticSearchHelper";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default Vue.extend({
  name: "App",

  components: {
    PureTextCard,
    ImageCard,
    DropFilesArea,
    CodeCard,
  },

  methods: {
    addCardTrigger() {
      if (this.cards.length === 0) {
        this.addCard(0, 0);
      } else {
        this.addCardTF = true;
      }
    },
    addCard(value: number, offset: number) {
      // axios("/api/").then((Response) => {
      //   console.log(Response);
      // });
      const uuid: string = uuidv4();
      const obj = {
        id: uuid,
        type: this.curAddCardType,
        style: {
          width: 250,
          height: 200,
        },
      } as genralCardInterface;
      if (this.curAddCardType === "PureTextCard") {
        (obj as PureTextCardInterface).text = "";
      } else if (this.curAddCardType === "ImageCard") {
        (obj as ImageCardInterface).img = "";
        (obj as ImageCardInterface).description = "";
      } else if (this.curAddCardType === "CodeCard") {
        (obj as CodeCardInterface).code = "";
        (obj as CodeCardInterface).description = "";
      }
      alert("add card");

      axios({
        method: "put",
        baseURL: "/api",
        url: `${this.curAddCardType.toLowerCase()}/_doc/${uuid}`,
        data: obj,
        responseType: "json",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      if (obj) {
        this.cards.splice(value + offset, 0, obj);
      }
      this.addCardTF = false;
    },
    deleteCard(index: number, containerName: string) {
      if (containerName === "allcardsContainer") {
        this.cards.splice(index, 1);
      } else if (containerName === "searchContainer") {
        this.filteredCards.splice(index, 1);
      }
    },
    chooseCardType(typeName: cardType) {
      this.curAddCardType = typeName;
    },
    handleImoprtJson(files: FileList) {
      console.log("handleImoprtJson");
      console.log(files);
      const reader = new FileReader();
      reader.onload = function() {
        if (typeof reader.result === "string") {
          // 先確定資料庫的index都有建好
          Promise.all([
            checkAndInitializePureTextCardPromsie,
            checkAndInitializeImageCardPromsie,
            checkAndInitializeCodeCardPromsie,
          ]).then(() => {
            if (typeof reader.result === "string") {
              console.log(JSON.parse(reader.result));
              const objArr = JSON.parse(reader.result);
              const PureTextCardArr = objArr["PureTextCard"];
              const ImageCardArr = objArr["ImageCard"];
              const CodeCardArr = objArr["CodeCard"];

              PureTextCardArr.forEach((element: PureTextCardInterface) => {
                axios({
                  method: "put",
                  baseURL: "/api",
                  url: `puretextcard/_doc/${element.id}`,
                  data: element,
                  responseType: "json",
                })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
              ImageCardArr.forEach((element: ImageCardInterface) => {
                axios({
                  method: "put",
                  baseURL: "/api",
                  url: `imagecard/_doc/${element.id}`,
                  data: element,
                  responseType: "json",
                })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
              CodeCardArr.forEach((element: CodeCardInterface) => {
                axios({
                  method: "put",
                  baseURL: "/api",
                  url: `codecard/_doc/${element.id}`,
                  data: element,
                  responseType: "json",
                })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          });
        }
      };
      reader.readAsText(files[0]);
    },
    exportCards() {
      Promise.all(
        cardTypes.map((type) => {
          return searchCardPromise(type);
        })
      ).then((values: any) => {
        const tempCardsObj: {
          PureTextCard: genralCardInterface[];
          ImageCard: genralCardInterface[];
          CodeCard: genralCardInterface[];
        } = { PureTextCard: [], ImageCard: [], CodeCard: [] };
        console.log(values);
        for (let i = 0; i < cardTypes.length; i++) {
          if (values[i]) {
            values[i].data.hits.hits.forEach((element: any) => {
              const card: genralCardInterface = element._source;
              tempCardsObj[cardTypes[i]].push(card);
            });
          }
        }

        console.log("tempCardsObj", tempCardsObj);
        // 建立json檔案並下載
        const blob = new Blob([JSON.stringify(tempCardsObj)], {
          type: "application/json",
        });
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = window.URL.createObjectURL(blob);
        a.download = "export";
        a.click();
        a.remove();
      });
    },
    // 使用此函數需要替有scroll bar的DOM element加上card-container這個class
    horizontalMouseScroll(event: WheelEvent | any) {
      event.stopPropagation();
      event.preventDefault();
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].classList.contains("card-container")) {
          const containerDOM = event.path[i];
          containerDOM.scrollLeft += event.deltaY;
          break;
        }
      }
    },
    updateSearch() {
      console.log("updateSearch");
      // TODO: 換掉這種ugly的處理方式
      this.idArr.forEach((id) => {
        clearTimeout(id);
      });
      this.idArr = [];
      const id = setTimeout(() => {
        Promise.all(
          cardTypes.map((type) => {
            if (type !== "PureTextCard") {
              return searchCardPromise(type, {
                match: { description: this.searchText },
              });
            }
            return searchCardPromise(type, {
              match: { text: this.searchText },
            });
          })
        ).then((result) => {
          console.log(result);
          this.filteredCards = [];
          result.forEach((r) => {
            if (r)
              r.data.hits.hits.forEach((element: any) => {
                const card: genralCardInterface = element._source;
                this.filteredCards.push(card);
              });
          });
        });
        this.idArr.forEach((id) => {
          clearTimeout(id);
        });
        this.idArr = [];
      }, 1500);
      this.idArr.push(id);
    },
  },

  created() {
    // 載入所有的卡片
    // Promise.all([
    //   checkAndInitializePureTextCardPromsie,
    //   checkAndInitializeImageCardPromsie,
    //   checkAndInitializeCodeCardPromsie,
    // ]).then((values) => {
    //   console.log(values);
    //   Promise.all(
    //     cardTypes.map((type) => {
    //       return searchCardPromise(type);
    //     })
    //   ).then((v: any) => {
    //     console.log(v);
    //     console.log(values);
    //     for (let i = 0; i < cardTypes.length; i++) {
    //       if (v[i]) {
    //         v[i].data.hits.hits.forEach((element: any) => {
    //           const card: genralCardInterface = element._source;
    //           this.cards.push(card);
    //         });
    //       }
    //     }
    //   });
    // });
  },

  data: () => ({
    addCardTF: false,
    curAddCardType: "PureTextCard" as cardType,
    cards: [] as genralCardInterface[],
    cardTypes: cardTypes,
    dropImportJsonDialog: false,
    filteredCards: [] as genralCardInterface[],
    searchText: "",
    idArr: [] as number[],
  }),
});
</script>

<style scoped>
.custom-scroll-bar::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll-bar::-webkit-scrollbar-thumb {
  background-color: #123456;
  border-radius: 10px;
}
.custom-scroll-bar::-webkit-scrollbar-thumb:hover {
  background-color: #25517c;
}
</style>
