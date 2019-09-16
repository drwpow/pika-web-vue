import Vue from "/web_modules/vue.js";
import VueRouter from "/web_modules/vue-router.js";
import Home from "./components/Home.jsx";
import Meredith from "./components/Meredith.jsx";

// register <router-view> and <router-link>
Vue.use(VueRouter);

new Vue({
  template: "<router-view></router-view>",
  router: new VueRouter({
    mode: "history",
    routes: [
      { path: "/", component: Home },
      { path: "/meredith", component: Meredith }
    ]
  })
}).$mount("#app");
