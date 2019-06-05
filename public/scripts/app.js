/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

const weatherApp = {
  selectedLocations: {},
  addDialogContainer: document.getElementById('addDialogContainer'),
};

/**
 * Toggles the visibility of the add location dialog box.
 */
function toggleAddDialog() {
  weatherApp.addDialogContainer.classList.toggle('visible');
}

/**
 * Event handler for butDialogAdd, adds the selected location to the list.
 */
function addLocation() {
  // Hide the dialog
  toggleAddDialog();
  // Get the selected city
  const select = document.getElementById('selectCityToAdd');
  const selected = select.options[select.selectedIndex];
  const geo = selected.value;
  const label = selected.textContent;
  const location = {label: label, geo: geo};
  // Create a new card & get the weather data from the server
  const card = getForecastCard(location);
  getForecastFromNetwork(geo).then((forecast) => {
    renderForecast(card, forecast);
  });
  // Save the updated list of selected cities.
  weatherApp.selectedLocations[geo] = location;
  saveLocationList(weatherApp.selectedLocations);
}

/**
 * Event handler for .remove-city, removes a location from the list.
 *
 * @param {Event} evt
 */
function removeLocation(evt) {
  const parent = evt.srcElement.parentElement;
  parent.setAttribute('hidden', true);
  if (weatherApp.selectedLocations[parent.id]) {
    delete weatherApp.selectedLocations[parent.id];
    saveLocationList(weatherApp.selectedLocations);
  }
}

/**
 * Renders the forecast data into the card element.
 *
 * @param {Element} card The card element to update.
 * @param {Object} data Weather forecast data to update the element with.
 */
function renderForecast(card, data) {

  if (!data) {
    // There's no data, skip the update.
    console.log("Render skipped!")
    return;
  }

  // Find out when the element was last updated.
  const cardLastUpdatedElem = card.querySelector('.card-last-updated');
  const cardLastUpdated = cardLastUpdatedElem.textContent;
  const lastUpdated = parseInt(cardLastUpdated);

  /*
  https://api.openweathermap.org/data/2.5/weather?lat=44.695333&lon=10.241556&APPID=b82ec2f9c61a9f11fbe81ec3d5100227

  {
    "coord":{"lon":10.24,"lat":44.7},
    "weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],
    "base":"stations",
    "main":{"temp":300.14,"pressure":1010,"humidity":57,"temp_min":298.71,"temp_max":301.48},
    "visibility":10000,
    "wind":{"speed":2.1,"deg":340},
    "clouds":{"all":0},
    "dt":1559732035,
    "sys":{"type":1,"id":6744,"message":0.0062,"country":"IT","sunrise":1559705711,"sunset":1559761203},
    "timezone":7200,
    "id":3177125,
    "name":"Felino",
    "cod":200
  }
*/

  // If the data on the element is newer, skip the update.
  // if (lastUpdated >= data.currently.time) {
  if (lastUpdated >= data.dt) {
    console.log("Render skipped for time")
    return;
  }
  // cardLastUpdatedElem.textContent = data.currently.time;
  cardLastUpdatedElem.textContent = data.dt;

  // Render the forecast data into the card.
  card.querySelector('.description').textContent = data.weather[0].description; // data.currently.summary;
  // if (data.minutely) card.querySelector('.description').textContent += " -> " + data.minutely.summary;
  const forecastFrom = luxon.DateTime
      .fromSeconds(data.dt /*data.currently.time*/)
      .setZone(data.timezone)
      .toFormat('DDDD t');
  card.querySelector('.date').textContent = forecastFrom;

  
  // card.querySelector('.current .icon').className = `icon ${data.currently.icon}`;
  card.querySelector('.current .temperature .value').textContent = Math.round(data.main.temp);
  card.querySelector('.current .humidity .value').textContent = Math.round(data.main.humidity);
  card.querySelector('.current .wind .value').textContent = Math.round(data.wind.speed);
  // card.querySelector('.current .wind .direction').textContent = Math.round(data.currently.windBearing);
  
  const sunrise = luxon.DateTime.fromSeconds(data.sys.sunrise).setZone(data.timezone).toFormat('t');
  card.querySelector('.current .sunrise .value').textContent = sunrise;

  const sunset = luxon.DateTime.fromSeconds(data.sys.sunset).setZone(data.timezone).toFormat('t');
  card.querySelector('.current .sunset .value').textContent = sunset;

  card.querySelector('.current .pressure .value').textContent = data.main.pressure;
/*
  // Render the next 7 days.
  const futureTiles = card.querySelectorAll('.future .oneday');
  futureTiles.forEach((tile, index) => {
    const forecast = data.daily.data[index + 1];
    const forecastFor = luxon.DateTime
        .fromSeconds(forecast.time)
        .setZone(data.timezone)
        .toFormat('ccc');
    tile.querySelector('.date').textContent = forecastFor;
    tile.querySelector('.icon').className = `icon ${forecast.icon}`;
    tile.querySelector('.temp-high .value')
        .textContent = Math.round(forecast.temperatureHigh);
    tile.querySelector('.temp-low .value')
        .textContent = Math.round(forecast.temperatureLow);
  });
*/
  // If the loading spinner is still visible, remove it.
  const spinner = card.querySelector('.card-spinner');
  if (spinner) {
    card.removeChild(spinner);
  }
}

/**
 * Get's the latest forecast data from the network.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromNetwork(coords) {
  /* Versione DarkSky via server locale
  var server = "http://192.168.5.70"
  var url = server + `/forecast/${coords}`;
  */

  var coord = coords.split(',')
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&units=metric&APPID=b82ec2f9c61a9f11fbe81ec3d5100227`

  console.log("[getForecastFromNetwork] Fetch coords = '"+coords+"' - URL: "+url)
  return fetch(url)
      .then((response) => {
        console.log("fetch .then > " + response)
        return response.json();
      })
      .catch(() => {
        console.error("fetch .catch")
        return null;
      });
}

/**
 * Get's the cached forecast data from the caches object.
 *
 * @param {string} coords Location object to.
 * @return {Object} The weather forecast, if the request fails, return null.
 */
function getForecastFromCache(coords) {
  // CODELAB: Add code to get weather forecast from the caches object.
  if (!('caches' in window)) {
    console.log("No caches trovate");
    return null;
  }
  const url = `${window.location.origin}/forecast/${coords}`;
  console.log("Cache URL: "+url)
  return caches.match(url)
      .then((response) => {
        console.log("caches then > "+response)
        if (response) {
          return response.json();
        }
        return null;
      })
      .catch((err) => {
        console.error('Error getting data from cache', err);
        return null;
      });
}

/**
 * Get's the HTML element for the weather forecast, or clones the template
 * and adds it to the DOM if we're adding a new item.
 *
 * @param {Object} location Location object
 * @return {Element} The element for the weather forecast.
 */
function getForecastCard(location) {
  const id = location.geo;
  const card = document.getElementById(id);
  if (card) {
    return card;
  }
  const newCard = document.getElementById('weather-template').cloneNode(true);
  newCard.querySelector('.location').textContent = location.label;
  newCard.setAttribute('id', id);
  newCard.querySelector('.remove-city').addEventListener('click', removeLocation);
  document.querySelector('main').appendChild(newCard);
  newCard.removeAttribute('hidden');
  return newCard;
}

/**
 * Gets the latest weather forecast data and updates each card with the
 * new data.
 */
function updateData() {
  Object.keys(weatherApp.selectedLocations).forEach((key) => {
    const location = weatherApp.selectedLocations[key];
    const card = getForecastCard(location);

    // CODELAB: Add code to call getForecastFromCache
    getForecastFromCache(location.geo)
      .then((forecast) => {
        renderForecast(card, forecast);
      });

    // Get the forecast data from the network.
    getForecastFromNetwork(location.geo)
        .then((forecast) => {
          renderForecast(card, forecast);
        });
  });
}

/**
 * Saves the list of locations.
 *
 * @param {Object} locations The list of locations to save.
 */
function saveLocationList(locations) {
  const data = JSON.stringify(locations);
  localStorage.setItem('locationList', data);
}

/**
 * Loads the list of saved location.
 *
 * @return {Array}
 */
function loadLocationList() {
  // Guarda in LocalStorage se ci sono posti salvati
  let locations = localStorage.getItem('locationList');
  if (locations) {
    try {
      locations = JSON.parse(locations);
    } catch (ex) {
      locations = {};
    }
  }
  // Dati di default se non trovati altri salvataggi in localStorage
  if (!locations || Object.keys(locations).length === 0) {
    const key = '40.7720232,-73.9732319';
    locations = {};
    locations[key] = {label: 'New York City', geo: '40.7720232,-73.9732319'};
  }
  return locations;
}

/**
 * Initialize the app, gets the list of locations from local storage, then
 * renders the initial data.
 */
function init() {
  // Get the location list, and update the UI.
  weatherApp.selectedLocations = loadLocationList();
  updateData();

  // Set up the event handlers for all of the buttons.
  document.getElementById('butRefresh').addEventListener('click', updateData);
  document.getElementById('butAdd').addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogCancel').addEventListener('click', toggleAddDialog);
  document.getElementById('butDialogAdd').addEventListener('click', addLocation);
}

init();
