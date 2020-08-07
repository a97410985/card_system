<template>
  <v-card class="mx-2">
    <div class="mx-2">
      <v-row>
        <v-col class="align-self-center">
          <div class="d-flex justify-start">
            <v-btn small class="mx-2" @click="loadAll">load all</v-btn>
            <v-menu class="mx-2" open-on-hover top offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small v-bind="attrs" color="primary" dark v-on="on"
                  >add card</v-btn
                >
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
            <v-btn
              v-if="addCardTF"
              small
              color="error"
              class="mx-2"
              @click="addCardTF = !addCardTF"
            >
              cancel add card</v-btn
            >
          </div>
        </v-col>
        <v-col class="align-self-center">
          <v-text-field
            label="搜尋卡片"
            hide-details="auto"
            prepend-icon="search"
            v-model="searchText"
            @input="updateSearch"
          ></v-text-field>
        </v-col>
      </v-row>

      <div
        class="d-flex flex-row custom-scroll-bar card-container"
        style="overflow:auto"
        @mousewheel="horizontalMouseScroll"
      >
        <div v-for="(card, index) in cards" v-bind:key="card.id" class="mx-6">
          <component
            v-bind:is="card.type"
            containerName="searchContainer"
            :index="index"
            :cardData="card"
            :addCardTF="addCardTF"
            @addCard="addCard"
            @deleteCard="deleteCard"
            @closeCard="closeCard"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import PureTextCard from "./PureTextCard.vue";
import ImageCard from "./ImageCard.vue";
import CodeCard from "./CodeCard.vue";
import {
  genralCardInterface,
  cardTypes,
  cardType,
  PureTextCardInterface,
  ImageCardInterface,
  CodeCardInterface,
} from "@/card";
import {
  checkAndInitializePureTextCardPromsie,
  checkAndInitializeImageCardPromsie,
  checkAndInitializeCodeCardPromsie,
  searchCardPromise,
} from "@/elasticSearchHelper";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default Vue.extend({
  name: "CardContainer",
  components: {
    PureTextCard,
    ImageCard,
    CodeCard,
  },

  data() {
    return {
      searchText: "" as string,
      cards: [] as genralCardInterface[],
      idArr: [] as number[],
      cardTypes: cardTypes,
      curAddCardType: "PureTextCard" as cardType,
      addCardTF: false,
    };
  },
  methods: {
    loadAll() {
      this.cards = [];
      console.log("loadAll");
      // 。載入所有的卡片;
      Promise.all([
        checkAndInitializePureTextCardPromsie,
        checkAndInitializeImageCardPromsie,
        checkAndInitializeCodeCardPromsie,
      ]).then((values) => {
        console.log(values);
        Promise.all(
          cardTypes.map((type) => {
            return searchCardPromise(type);
          })
        ).then((v: any) => {
          console.log(v);
          console.log(values);
          for (let i = 0; i < cardTypes.length; i++) {
            if (v[i]) {
              v[i].data.hits.hits.forEach((element: any) => {
                const card: genralCardInterface = element._source;
                this.cards.push(card);
              });
            }
          }
        });
      });
    },
    updateSearch() {
      console.log("updateSearch");
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
          this.cards = [];
          result.forEach((r) => {
            if (r)
              r.data.hits.hits.forEach((element: any) => {
                const card: genralCardInterface = element._source;
                this.cards.push(card);
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

    horizontalMouseScroll(event: WheelEvent | any) {
      console.log("horizontalMouseScroll");
      // 使用此函數需要替有scroll bar的DOM element加上card-container這個class
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
    deleteCard(index: number) {
      console.log("deleteCard");
      this.cards.splice(index, 1);
    },
    closeCard(index: number) {
      this.cards.splice(index, 1);
    },

    chooseCardType(typeName: cardType) {
      this.curAddCardType = typeName;
    },
    addCardTrigger() {
      if (this.cards.length === 0) {
        this.addCard(0, 0);
      } else {
        this.addCardTF = true;
      }
    },
    addCard(value: number, offset: number) {
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
  },
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
