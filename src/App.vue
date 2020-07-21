<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">stone card system</div>

      <v-spacer></v-spacer>

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
          <v-btn v-bind="attrs" color="primary" dark v-on="on">
            add card
          </v-btn>
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
      <div class="d-flex flex-row">
        <div v-for="(card, index) in cards" v-bind:key="card.id" class="mx-6">
          <!-- <PureTextCard
            @addCard="addCard"
            :index="index"
            :cardData="card"
            :addCardTF="addCardTF"
          /> -->
          <component
            v-bind:is="card.type"
            @addCard="addCard"
            :index="index"
            :cardData="card"
            :addCardTF="addCardTF"
          />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import PureTextCard from "./components/PureTextCard.vue";
import ImageCard from "./components/ImageCard.vue";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  PureTextCardInterface,
  cardTypes,
  cardType,
  genralCardTpye,
  ImageCardInterface,
} from "./card";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default Vue.extend({
  name: "App",

  components: {
    PureTextCard,
    ImageCard,
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
      let obj;
      if (this.curAddCardType === "PureTextCard") {
        obj = {
          id: uuid,
          type: this.curAddCardType,
          text: "",
          style: {
            width: 250,
            height: 200,
          },
        } as PureTextCardInterface;
      } else if (this.curAddCardType === "ImageCard") {
        obj = {
          id: uuid,
          type: this.curAddCardType,
          img: "",
          style: {
            width: 250,
            height: 200,
          },
        } as ImageCardInterface;
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
    chooseCardType(typeName: cardType) {
      this.curAddCardType = typeName;
    },
  },

  created() {
    // 會先檢查某種卡片的index是否存在，如果沒有就根據mapping建立
    axios({
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
          data: {
            mappings: {
              properties: {
                id: {
                  type: "keyword",
                },
                type: {
                  type: "keyword",
                },
                text: {
                  type: "text",
                },
              },
            },
          },
        }).then((result) => {
          console.log("建立index成功");
        });
      });

    axios({
      method: "get",
      baseURL: "/api",
      url: "/puretextcard/_doc/_search",
      responseType: "json",
    })
      .then((result) => {
        console.log(result);
        const cardsArr = result.data.hits.hits;
        for (let i = 0; i < cardsArr.length; i++) {
          console.log(cardsArr[i]._source.type);
          const card: PureTextCardInterface = {
            id: cardsArr[i]._source.id,
            type: cardsArr[i]._source.type,
            text: cardsArr[i]._source.text,
            style: cardsArr[i]._source.style,
          };
          this.cards.push(card);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
      method: "get",
      baseURL: "/api",
      url: "/imagecard/_doc/_search",
      responseType: "json",
    })
      .then((result) => {
        console.log(result);
        const cardsArr = result.data.hits.hits;
        for (let i = 0; i < cardsArr.length; i++) {
          const card: ImageCardInterface = {
            id: cardsArr[i]._source.id,
            type: cardsArr[i]._source.type,
            img: cardsArr[i]._source.img,
            style: cardsArr[i]._source.style,
          };
          this.cards.push(card);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  data: () => ({
    addCardTF: false,
    curAddCardType: "PureTextCard" as cardType,
    cards: [] as genralCardTpye[],
    cardTypes: cardTypes,
  }),
});
</script>
