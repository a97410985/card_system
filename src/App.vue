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
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Card, cardTypes, cardType } from "./card";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default Vue.extend({
  name: "App",

  components: {
    PureTextCard,
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
      const obj: Card = {
        id: uuid,
        type: this.curAddCardType,
        text: "",
      };
      axios({
        method: "put",
        baseURL: "/api",
        url: `card_system/card/${uuid}`,
        data: obj,
        responseType: "json",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      this.cards.splice(value + offset, 0, obj);
      this.addCardTF = false;
    },
    chooseCardType(typeName: cardType) {
      this.curAddCardType = typeName;
    },
  },

  created() {
    axios({
      method: "get",
      baseURL: "/api",
      url: "card_system/card/_search",
      responseType: "json",
    })
      .then((result) => {
        console.log(result);
        const cardsArr = result.data.hits.hits;
        for (let i = 0; i < cardsArr.length; i++) {
          const card: Card = {
            id: cardsArr[i]._source.id,
            type: cardsArr[i]._source.type,
            text: cardsArr[i]._source.text,
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
    cards: [
      // { id: uuidv4(), text: "haha" },
      // { id: uuidv4(), text: "haha2" },
    ] as Card[],
    cardTypes: cardTypes,
  }),
});
</script>
