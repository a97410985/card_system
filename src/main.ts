import Vue from "vue";
import App from "./App.vue";
import Playground from "./CardPlayground.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
const playgroundMode = false;

if (playgroundMode) {
  new Vue({
    vuetify,
    render: (h) => h(Playground),
  }).$mount("#app");
} else {
  new Vue({
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
}
