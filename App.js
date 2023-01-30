"use strict";
import { getWeather } from "./Weather.js";
import { ICON_MAP } from "./iconMap.js";

window.addEventListener("load", () => {
  const mapContainer = document.getElementById("map");
  const currentLocationContainer = document.querySelector(".current-location");
  const dailyContainer = document.querySelector(".daily-div");
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let map = L.map(mapContainer).setView([0, 0], 13);
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const coords = [latitude, longitude];

        map.setView(coords, 7);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.on("click", function (e) {
          const { lat, lng } = e.latlng;

          let popup = L.popup({
            className: "current-popup",
            autoPan: false,
          });
          let marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(popup)
            .openPopup();

          let popupDiv = document.createElement("div");
          popupDiv.classList.add("popupDiv");

          function getLocation() {
            return new Promise((resolve, reject) => {
              fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=031bb5bcf3c54b27aec2b960f5baf307`
              )
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  let generalLocation = data.results[0].formatted;
                  let preciseLocation = generalLocation.split(",")[0];
                  let countryAbrev = data.results[0].components.country_code
                    ? data.results[0].components.country_code.toUpperCase()
                    : "";
                  let flag = data.results[0].annotations.flag
                    ? data.results[0].annotations.flag
                    : "no flag for this location";
                  let displayOnMarker = `${preciseLocation}, ${countryAbrev} ${flag}`;

                  let locationDiv = document.createElement("div");
                  locationDiv.innerHTML = displayOnMarker;

                  resolve(locationDiv);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          }

          function updateCurrentLocationContainer() {
            return new Promise((resolve, reject) => {
              getWeather(lat, lng)
                .then(({ current_weather, daily }) => {
                  let temperatureDiv = document.createElement("div");
                  if (current_weather !== undefined) {
                    let temperature = current_weather.temperature;
                    temperatureDiv.innerHTML = `${temperature}°C`;
                    temperatureDiv.classList.add("temp-div");

                    const weatherCode = current_weather.weathercode;
                    const icon =
                      ICON_MAP.get(weatherCode) || "default-icon.svg";
                    const today = new Date();
                    const todayName = daysOfWeek[today.getDay()];
                    const startDayIndex = today.getDay();

                    currentLocationContainer.innerHTML = `
                <div class="current-left">
                      <h1 class="today-name">${todayName}</h1>
                      <img
                        class="weather-icon large"
                        src="svgs/${icon}"
                        data-current-${icon}
                      />
                      <div class="current-temp"><span data-current-temp>${current_weather.temperature}</span>&deg;</div>
                 </div>

                 <div class="current-right">
                       <div class="info-group">
                       <div class="label">High</div>
                       <div><span data-current-high>${daily.temperature_2m_max[0]}</span>&deg</div>
                 </div>

                 <div class="info-group">
                        <div class="label">FL High</div>
                        <div><span data-current-fl-high>${daily.apparent_temperature_max[0]}</span>&deg</div>
                 </div>

                 <div class="info-group">
                   <div class="label">Wind</div>
                   <div>
                    <span data-current-wind>${current_weather.windspeed}</span>
                    <span class="value-sub-info"> km/h</span>
                   </div>
                 </div>

                 <div class="info-group">
                    <div class="label">Low</div>
                    <div><span data-current-low>${daily.temperature_2m_min[0]}</span>&deg</div>
                 </div>

                <div class="info-group">
                    <div class="label">FL Low</div>
                    <div><span data-current-fl-low>${daily.apparent_temperature_min[0]}</span>&deg</div>
                </div>

                <div class="info-group">
                    <div class="label">Precip</div>
                    <div>
                      <span data-current-precip>${daily.precipitation_sum[0]}</span
                      ><span class="value-sub-info"> ml</span>
                    </div>
                </div>`;

                    map.flyTo([lat, lng], 6);
                    const {
                      precipitation_sum,
                      temperature_2m_max,
                      temperature_2m_min,
                      weathercode,
                    } = daily;
                    console.log(daily);
                    dailyContainer.innerHTML = "";

                    for (let i = 1; i < temperature_2m_max.length; i++) {
                      let dailyDiv = document.createElement("div");
                      dailyDiv.classList.add("day");
                      let dayIndex = (i + startDayIndex) % daysOfWeek.length;
                      let day = daysOfWeek[dayIndex];

                      let weatherCode = weathercode[i];

                      let icon = ICON_MAP.get(weatherCode);
                      dailyDiv.innerHTML = `
                  <div class = 'daily-left'>
                     <h3>${day}</h3> 
                    <img class="weather-icon" src="svgs/${icon}"/>
                  </div>
                  <div class="daily-right">
                    <div class="daily-info">
                      <div class="label">Max</div>
                      <div class="daily-temp"><span data-daily-temp>${temperature_2m_max[i]}</span>&deg</div>
                    </div>
                    <div class="daily-info">
                      <div class="label">Min</div>
                      <div class="daily-temp"><span data-daily-temp>${temperature_2m_min[i]}</span>&deg</div>
                    </div>
                    <div class="daily-info">
                      <div class="">Precip</div>
                      <div class="daily-temp"><span data-daily-temp>${precipitation_sum[i]}</span>ml</div>
                    </div>
                  </div>

                      `;
                      dailyContainer.appendChild(dailyDiv);
                    }
                  } else {
                    temperatureDiv.innerHTML =
                      "No temperature data, thanks Putin";
                    dailyContainer.innerHTML = "";
                    currentLocationContainer.innerHTML =
                      "We could not get the weather for this location";
                  }

                  resolve(temperatureDiv);
                })
                .catch((error) => {});
            });
          }

          function setLocationAndTemperatureAsync() {
            const promise1 = updateCurrentLocationContainer();
            const promise2 = getLocation();

            Promise.all([promise1, promise2]).then((results) => {
              popupDiv.appendChild(results[0]);
              popupDiv.appendChild(results[1]);
              popup.setContent(popupDiv);
              popup.update();
            });
          }

          setLocationAndTemperatureAsync();

          marker.on("click", function () {
            map.flyTo([lat, lng], 6);
            updateCurrentLocationContainer();
          });
        });
      },
      (error) => {
        console.log(error);
        map.setView([0, 0], 13);
        alert("Could not get your location");
      }
    );
  }
});
