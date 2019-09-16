import Vue from "/web_modules/vue/dist/vue.esm.browser.js";
var Home = Vue.extend({
  render: function render(h) {
    return h("div", [h("div", {
      "class": "center"
    }, [h("br"), h("h1", ["Under Construction"]), h("p", [h("img", {
      "attrs": {
        "src": "/static/dundermifflini.gif",
        "width": "350",
        "alt": "Dunder Mifflin"
      }
    })]), h("br"), h("p", [h("img", {
      "attrs": {
        "src": "/static/under-construction.gif",
        "alt": "Dunder Mifflin is under construction"
      }
    })]), h("h1", ["Coming ", h("span", {
      "class": "red"
    }, ["C"]), h("span", {
      "class": "green"
    }, ["h"]), h("span", {
      "class": "red"
    }, ["r"]), h("span", {
      "class": "green"
    }, ["i"]), h("span", {
      "class": "red"
    }, ["s"]), h("span", {
      "class": "green"
    }, ["t"]), h("span", {
      "class": "red"
    }, ["m"]), h("span", {
      "class": "green"
    }, ["a"]), h("span", {
      "class": "red"
    }, ["s"]), h("span", {
      "class": "green"
    }, ["2"]), h("span", {
      "class": "red"
    }, ["0"]), h("span", {
      "class": "green"
    }, ["0"]), h("span", {
      "class": "red"
    }, ["2"]), h("span", {
      "class": "green"
    }, ["!"])]), h("br"), h("p", [h("router-link", {
      "attrs": {
        "to": "/meredith"
      }
    }, [h("img", {
      "attrs": {
        "src": "/static/doctor.gif",
        "alt": "doctor"
      }
    }), "Donate to the Michael Scott\u2019s Dunder Mifflin Scranton Meredith Palmer Memorial Celebrity Rabies Awareness Pro-Am Fun Run Race For The Cure"])])])]);
  }
});
export default Home;