export function getWeather(lat, lng) {
  const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=auto`;
  return fetch(api)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {});
}
