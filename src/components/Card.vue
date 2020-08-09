<template>
  <v-card :style="cardStyle" class="mx-auto">
    <v-card-actions class="pa-0" v-if="addCardType">
      <v-btn icon @click="addToLeft" color="primary">
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="addToRight" color="primary">
        <v-icon>arrow_right_alt</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <v-btn @click="zoomIn" icon small>
        <v-icon>zoom_in</v-icon>
      </v-btn>
      <v-btn @click="zoomOut" icon small>
        <v-icon>zoom_out</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon @click="deleteCard">delete</v-icon>
      </v-btn>
      <v-btn icon small>
        <v-icon @click="closeCard">cancel</v-icon>
      </v-btn>
      <v-btn icon small @click="moveCard">
        m
      </v-btn>
      <v-btn icon small @click="copyID">
        c
      </v-btn>

      <v-menu v-model="relationMenu" :close-on-content-click="false" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="fetchRelationArr"
            color="indigo"
            dark
            v-bind="attrs"
            v-on="on"
            icon
            small
          >
            r
          </v-btn>
        </template>
        <v-card>
          <v-card-title>建立關聯</v-card-title>
          <v-card-text>
            <v-combobox
              v-model="RelationModel"
              :search-input.sync="search"
              hide-selected
              small-chips
              multiple
              :items="relationNameArr"
              label="關聯名稱"
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results matching "<strong>{{ search }}</strong
                      >". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
            <v-text-field
              label="卡片ID"
              v-model="relationCardID"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addRelation">建立關聯</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-spacer></v-spacer>
      <slot name="top-right-bar"></slot>
    </v-card-actions>
    <slot name="content"></slot>
    <div>
      <!-- <v-chip
        class="mx-2"
        v-for="(relation, index) in cardData.card_relation_sets"
        :key="index"
      >
        {{ relation.relation_name }}
      </v-chip> -->
      <v-menu
        :close-on-content-click="false"
        offset-x
        v-for="(relation, index) in cardData.card_relation_sets"
        :key="index"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="mx-2 mb-2"
            color="green"
            dark
            small
          >
            {{ relation.relation_name }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>關聯</v-card-title>
          <v-card-text>
            <display-card-container
              :moveCardTempData="null"
            ></display-card-container>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { cardTypes, cardType } from "../card";
import {
  relationFetchPromise,
  AddRelationPromise,
  addRelationToCardPromise
} from "@/elasticSearchHelper";
import { v4 as uuidv4 } from "uuid";

export default Vue.extend({
  name: "Card",
  props: ["cardData", "addCardType", "index", "containerName"],

  components: {
    "display-card-container": () =>
      import("./CardContainer.vue") /* 用這樣動態載入的方式是為了避免循環參考 */
  },

  created() {
    if (this.cardData.type === "CodeCard") {
      this.cardStyle.height = this.cardData.style.height + "px";
    }
  },
  data() {
    return {
      cardStyle: {
        width: this.cardData.style.width + "px",
        height: "auto"
      },
      cardRelation: (this.cardData.card_relation_sets || []) as {
        relation_name: string;
        related_card: string[];
      }[],
      relationMenu: false,
      relationNameArr: ["test", "haha"] as string[],
      relationCardID: "" as string,
      search: "" as string,
      RelationModel: [] as string[]
    };
  },

  methods: {
    addToLeft() {
      let vm = this.$parent;

      while (vm) {
        vm.$emit("addCard", this.index, 0);
        vm = vm.$parent;
      }
    },
    addToRight() {
      let vm = this.$parent;

      while (vm) {
        vm.$emit("addCard", this.index, 1);
        vm = vm.$parent;
      }
    },
    updateSize(width: number, height: number) {
      // 要update資料，partial updates to documents
      axios({
        method: "post",
        baseURL: "/api",
        url: `/${this.cardData.type.toLowerCase()}/_doc/${
          this.cardData.id
        }/_update`,
        data: {
          doc: {
            style: {
              width: width,
              height: height
            }
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
    },
    zoomIn() {
      const newWidth = this.$el.clientWidth + 100;
      this.cardStyle.width = newWidth.toString() + "px";
      if (
        this.cardData.type === "ImageCard" ||
        this.cardData.type === "PureTextCard"
      ) {
        this.updateSize(newWidth, 200);
      } else {
        const newHeight = this.$el.clientHeight + 100;
        this.cardStyle.height = newHeight.toString() + "px";
        this.updateSize(newWidth, newHeight);
      }
    },
    zoomOut() {
      if (this.$el.clientWidth > 200) {
        const newWidth = this.$el.clientWidth - 100;
        this.cardStyle.width = (this.$el.clientWidth - 100).toString() + "px";
        if (
          this.cardData.type === "ImageCard" ||
          this.cardData.type === "PureTextCard"
        ) {
          this.updateSize(newWidth, 200);
        } else {
          const newHeight = this.$el.clientHeight - 100;
          this.cardStyle.height = newHeight.toString() + "px";
          this.updateSize(newWidth, newHeight);
        }
      }
    },
    deleteCard() {
      // 會刪除elasticSearch中的這張卡的document
      axios({
        method: "delete",
        baseURL: "/api",
        url: `/${this.cardData.type.toLowerCase()}/_doc/${this.cardData.id}`,
        responseType: "json"
      })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
      let vm = this.$parent;

      while (vm) {
        vm.$emit("deleteCard", this.index, this.containerName);
        vm = vm.$parent;
      }
    },
    closeCard() {
      let vm = this.$parent;

      while (vm) {
        vm.$emit("closeCard", this.index, vm);
        vm = vm.$parent;
      }
    },
    moveCard() {
      console.log("move card");
      let vm = this.$parent;

      while (vm) {
        vm.$emit("moveCard", this.cardData);
        vm = vm.$parent;
      }
    },
    fetchRelationArr() {
      // const data = relationFetchPromise();
      // console.log(data);
    },
    addRelation() {
      if (this.RelationModel.length === 0) {
        alert("需要填入關係");
        return;
      }
      if (this.relationCardID === "") {
        // TODO: 卡片名稱為uuid的檢查
        alert("需要填入卡片名稱");
        return;
      }
      console.log("relation");
      console.log(this.RelationModel);
      console.log(this.relationCardID);
      console.log(this.cardData.id);
      // 比較有沒有新增relation，有的話要更新到elasticsearch
      this.RelationModel.forEach(name => {
        if (!this.relationNameArr.includes(name)) {
          // 新增card_relation
          AddRelationPromise({
            id: uuidv4(),
            name: name
          }).then(result => {
            console.log(result);
          });
        }
      });

      // TODO： 在建立關聯的兩張卡片上儲存關係
      // 如果關係已經有了就加到陣列，原本沒有就多加一個關係
      this.RelationModel.forEach(name => {
        let exists = false;
        for (let i = 0; i < this.cardRelation.length; i++) {
          if (this.cardRelation[i].relation_name === name) {
            // 要確認原本沒有這張卡
            if (
              !this.cardRelation[i].related_card.includes(this.relationCardID)
            )
              this.cardRelation[i].related_card.push(this.relationCardID);
            exists = true;
          }
        }
        if (!exists) {
          this.cardRelation.push({
            // eslint-disable-next-line @typescript-eslint/camelcase
            relation_name: name,
            // eslint-disable-next-line @typescript-eslint/camelcase
            related_card: [this.relationCardID]
          });
        }
      });
      console.log("this.cardRelation", this.cardRelation);

      addRelationToCardPromise(
        this.cardRelation,
        this.cardData.id,
        this.cardData.type
      ).then(result => {
        console.log(result);
      });
      this.relationMenu = false;
    },
    copyID() {
      navigator.clipboard
        .writeText(this.cardData.id)
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    relationMenu: async function() {
      const result = await relationFetchPromise();
      if (result) {
        const relationArr = result.data.hits.hits as {
          _source: {
            id: string;
            name: string;
          };
        }[];
        // eslint-disable-next-line prefer-const
        let temp = [] as string[];
        for (let i = 0; i < relationArr.length; i++) {
          if (relationArr[i]._source.name)
            temp.push(relationArr[i]._source.name);
        }
        this.relationNameArr = temp;
      }
      console.log(result);
    }
  }
});
</script>
<style scoped>
@import "~material-icons/iconfont/material-icons.css";
</style>
