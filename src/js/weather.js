requirejs.config({
  paths: {
    "moment": "https://unpkg.com/moment@2.24.0/min/moment.min",
    "moment-interval": "https://unpkg.com/moment-interval@0.2.1/src/moment-interval",
    "vue": "https://unpkg.com/vue@2.6.10/dist/vue.min"
  },
});

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response.json())
    .then(data => { resolve(data); });
  });
}

function getPosition(options) {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function fixedN(x, N) {
  return Number(Math.round(x+"e"+N)+"e-"+N);
}

function getCoords(options) {
  return new Promise((resolve, reject) => {
    getPosition(options).then(p => {
      resolve({
        x: fixedN(p.coords.longitude, 4),
        y: fixedN(p.coords.latitude, 4),
      });
    });
  });
};

define(function (require) {
  let Vue = require("vue");
  let moment = require("moment");
  require("moment-interval");

  // TODO: componentize this?
  var wiIcon = require("Weather/wiIcon");
  var wiRegex = /.*\/icons\/land\/((?:day|night)\/[^,?]+)(?:,(\d+))?(?:\?.*)?/;

  var apiBase = "https://api.weather.gov";
  var relativeLocation;
  getCoords()
  .then(p => fetchJSON(apiBase + "/points/" + p.y + "," + p.x))
  .then(points => {
    relativeLocation = points.properties.relativeLocation.properties;
    let loc = relativeLocation;
    document.title = "Hourly Forecast for " + loc.city + ", " + loc.state;
    return fetchJSON(points.properties.forecastHourly);
  })
  .then(hourly => {
    require("Weather/Hourly");
    let vue = new Vue({
      el: "#weather",
      data: function() {
        return {
          loc: {
            city: "",
            state: ""
          },
          periods: []
        }
      },
      mounted: function() {
        this.loc = relativeLocation;
      },
      template: `<weather-hourly :loc="loc" :periods="periods"/>`
    });
    hourly.properties.periods.forEach(period => {
      period.startMoment = moment(period.startTime);
      let [_, dayNightDesc, rain] = period.icon.match(wiRegex);
      period.wiIcon = wiIcon[dayNightDesc];
      vue.periods.push(period);
    });
    return vue;
  });
});
