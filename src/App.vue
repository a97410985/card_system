<template>
  <v-app>
    <v-app-bar dense app color="primary" dark hide-on-scroll>
      <div class="d-flex align-center">stone card system</div>

      <v-spacer></v-spacer>
      <v-btn
        class="error"
        v-if="moveCardTempData"
        @click="moveCardTempData = null"
      >
        cancel move card
      </v-btn>
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
    </v-app-bar>

    <v-main @moveCard="moveCard" @moveCardEnd="moveCardEnd">
      <v-row>
        <v-col>
          <card-container :moveCardTempData="moveCardTempData">
          </card-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <card-container :moveCardTempData="moveCardTempData">
          </card-container>
        </v-col>
        <v-col cols="6">
          <card-container :moveCardTempData="moveCardTempData">
          </card-container>
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
import CardContainer from "./components/CardContainer.vue";

import DropFilesArea from "./components/DropFilesArea.vue";
import axios from "axios";
import {
  PureTextCardInterface,
  cardTypes,
  genralCardInterface,
  ImageCardInterface,
  CodeCardInterface
} from "./card";

import {
  checkAndInitializePureTextCardPromsie,
  checkAndInitializeImageCardPromsie,
  checkAndInitializeCodeCardPromsie,
  searchCardPromise,
  checkAndInitializeCardRelationPromsie
} from "./elasticSearchHelper";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default Vue.extend({
  name: "App",

  components: {
    DropFilesArea,
    CardContainer
  },

  methods: {
    moveCardEnd() {
      this.moveCardTempData = null;
    },
    moveCard(cardData: genralCardInterface) {
      console.log("app component get moveCard signal");
      console.log(cardData);
      this.moveCardTempData = cardData;
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
            checkAndInitializeCodeCardPromsie
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
                  responseType: "json"
                })
                  .then(result => {
                    console.log(result);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
              ImageCardArr.forEach((element: ImageCardInterface) => {
                axios({
                  method: "put",
                  baseURL: "/api",
                  url: `imagecard/_doc/${element.id}`,
                  data: element,
                  responseType: "json"
                })
                  .then(result => {
                    console.log(result);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
              CodeCardArr.forEach((element: CodeCardInterface) => {
                axios({
                  method: "put",
                  baseURL: "/api",
                  url: `codecard/_doc/${element.id}`,
                  data: element,
                  responseType: "json"
                })
                  .then(result => {
                    console.log(result);
                  })
                  .catch(err => {
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
        cardTypes.map(type => {
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
          type: "application/json"
        });
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = window.URL.createObjectURL(blob);
        a.download = "export";
        a.click();
        a.remove();
      });
    }
  },

  created() {
    Promise.all([
      checkAndInitializeCardRelationPromsie,
      checkAndInitializePureTextCardPromsie,
      checkAndInitializeImageCardPromsie,
      checkAndInitializeCodeCardPromsie
    ]);
  },

  data: () => ({
    cardTypes: cardTypes,
    dropImportJsonDialog: false,
    moveCardTempData: null as genralCardInterface | null
  })
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
