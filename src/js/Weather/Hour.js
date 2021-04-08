define(function(require) {
  let Vue = require("vue");

  let template = `
    <tr>
      <td :title="period.startMoment.format('LLLL')">
        <div>{{ period.startMoment.format("h:mma") }}</div>
        <div>{{ period.startMoment.format("ddd") }}</div>
      </td>
      <td class="weather-icon">
        <img v-if="period.wiIcon === undefined" :src="period.icon" />
        <i v-else :class="'wi wi-' + period.wiIcon"></i>
      </td>
      <td>{{ period.shortForecast }}</td>
      <td>{{ period.temperature }}&deg;{{ period.temperatureUnit }}</td>
      <td>
        {{ period.windDirection }} {{ period.windSpeed }}
        <i v-if="period.windDirection === null" class="wi wi-na"></i>
        <i v-else :class="'wi wi-wind wi-from-' + period.windDirection.toLowerCase()"></i>
      </td>
    </tr>
  `;

  Vue.component("weather-hour", {
    props: ["period"],
    template: template
  });
});
