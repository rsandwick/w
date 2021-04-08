define(function(require) {
  let Vue = require("vue");
  let moment = require("moment");
  require("Weather/Hour");

  let template = `
    <div class="weather">
      <div class="jumbotron">
        <h1>{{ loc.city + ", " + loc.state }} Hourly Weather</h1>
        <p>{{ now.format("h:mma") }}</p>
      </div>
      <table class="table table-striped hourly">
        <thead>
          <tr>
            <th>Time</th>
            <th></th>
            <th>Description</th>
            <th>Temp</th>
            <th>Wind</th>
          </tr>
        </thead>
        <tbody>
          <weather-hour
            v-for="period in periods"
            :key="Date.parse(period.startTime)"
            :period="period"
          />
        </tbody>
      </table>
    </div>
  `;

  Vue.component("weather-hourly", {
    data: function() {
      return {
        now: moment(),
        periods: []
      }
    },
    props: ["loc", "periods"],
    template: template
  });
});
