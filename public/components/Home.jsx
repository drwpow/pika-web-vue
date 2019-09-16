import Vue from "/web_modules/vue.js";
var Home = Vue.extend({
    render: function (h) {
        return (<div>
        <div class="center">
          <br />
          <h1>Under Construction</h1>
          <p>
            <img src="/static/dundermifflini.gif" width="350" alt="Dunder Mifflin"/>
          </p>
          <br />
          <p>
            <img src="/static/under-construction.gif" alt="Dunder Mifflin is under construction"/>
          </p>
          <h1>
            Coming <span class="red">C</span>
            <span class="green">h</span>
            <span class="red">r</span>
            <span class="green">i</span>
            <span class="red">s</span>
            <span class="green">t</span>
            <span class="red">m</span>
            <span class="green">a</span>
            <span class="red">s</span>
            <span class="green">2</span>
            <span class="red">0</span>
            <span class="green">0</span>
            <span class="red">2</span>
            <span class="green">!</span>
          </h1>
          <br />
          <p>
            <router-link to="/meredith">
              <img src="/static/doctor.gif" alt="doctor"/>
              Donate to the Michael Scott’s Dunder Mifflin Scranton Meredith
              Palmer Memorial Celebrity Rabies Awareness Pro-Am Fun Run Race For
              The Cure
            </router-link>
          </p>
        </div>
      </div>);
    }
});
export default Home;
