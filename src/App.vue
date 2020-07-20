<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">stone card system</div>

      <v-spacer></v-spacer>

      <v-btn color="primary" @click="addCardTrigger">add card</v-btn>
    </v-app-bar>

    <v-main>
      <div class="d-flex flex-row">
        <div v-for="(card, index) in cards" v-bind:key="card.text" class="mx-6">
          <PureTextCard
            @addCard="addCard"
            :index="index"
            :textContent="card.text"
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

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

interface Card {
  id: string;
  text: string;
}

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
        this.addCardTF = !this.addCardTF;
      }
    },
    addCard(value: number, offset: number) {
      // axios("/api/").then((Response) => {
      //   console.log(Response);
      // });
      axios({
        method: "post",
        baseURL: "/api",
        url: "card_system/card",
        data: {
          id: uuidv4(),
          text: "haha",
        },
        responseType: "json",
      })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
      this.cards.splice(value + offset, 0, { id: uuidv4(), text: "" });
      this.addCardTF = false;
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
    cards: [
      // { id: uuidv4(), text: "haha" },
      // { id: uuidv4(), text: "haha2" },
    ] as Card[],
  }),
});
</script>
