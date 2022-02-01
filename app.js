const apiKey = "7e459bb5496aadff1a2ce640d0ed5c78";

const searchWeatherBtn = document.querySelector("#search-weather");
const form = document.querySelector("#form");

const date = document.querySelector("#date");
const loc = document.querySelector("#location");
const updatedTime = document.querySelector("#updated-time");

const icon = document.querySelector("#icon");
const weatherMain = document.querySelector("#weather-main");
const weatherDescription = document.querySelector("#weather-description");

const temperature = document.querySelector("#temperature");
const feelsLikeTemp = document.querySelector("#feels-like-temp");
const highLowTemp = document.querySelector("#high-low-temp");

const pressure = document.querySelector("#pressure");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var hour = a.getHours();
  var min = a.getMinutes();
  if (hour > 12) {
    hour -= 12;
  }
  if (min < 10) {
    min = "0" + min;
  }
  var time = hour + ":" + min;
  return time;
}
function currentTime() {
  let today = new Date();
  let hours = today.getHours();
  let mins = today.getMinutes();
  let ampm;
  if (hours > 12) {
    ampm = "PM";
    hours -= 12;
  } else {
    ampm = "AM";
  }
  if (mins < 10) {
    mins = "0" + mins;
  }
  time = hours + ":" + mins + " " + ampm;
  return time;
}
function currentDate() {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  let today = new Date();
  let day = today.getDate();
  let month = months[today.getMonth()];
  let year = today.getFullYear();
  if (day == 1) {
    day += "st";
  } else if (day == 2) {
    day += "nd";
  } else if (day == 3) {
    day += "rd";
  } else {
    day += "th";
  }
  const date = day + " " + month + " " + year;
  return date;
}

function getPosition(options) {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

function displayData(jdata) {
  const jsonData = jdata;
  icon.setAttribute(
    "src",
    ` http://openweathermap.org/img/wn/${jsonData.weather[0].icon}@2x.png`
  );

  const timeNow = currentTime();
  const dateNow = currentDate();

  date.textContent = `${dateNow}`;
  loc.textContent = `${jsonData.name}, ${jsonData.sys.country}`;
  updatedTime.textContent = `Last updated at ${timeNow}`;

  weatherMain.textContent = `${jsonData.weather[0].main}`;
  weatherDescription.textContent = `${jsonData.weather[0].description}`;

  temperature.textContent = `${Math.round(jsonData.main.temp)}°C`;
  feelsLikeTemp.textContent = `Feels like ${jsonData.main.feels_like}°C`;
  highLowTemp.textContent = `Low ${jsonData.main.temp_min}°C | High ${jsonData.main.temp_max}°C`;

  pressure.innerHTML = `<img src="/images/pressure.svg" alt="" />
    Pressure | ${jsonData.main.pressure}`;
  humidity.innerHTML = `<img src="/images/humidity.svg" alt="" />  Humidity | ${jsonData.main.humidity}`;
  windSpeed.innerHTML = `<img src="/images/wind-speed.svg" alt="" />  Wind Speed | ${jsonData.wind.speed}`;
  sunrise.innerHTML = `<img src="/images/sunrise.svg" alt="" />  Sunrise | ${timeConverter(
    jsonData.sys.sunrise
  )} AM`;
  sunset.innerHTML = `<img src="/images/sunset.svg" alt="" />  Sunset | ${timeConverter(
    jsonData.sys.sunset
  )} PM`;
}

async function getLocationWeather() {
  try {
    const position = await getPosition();
    const { latitude, longitude } = position.coords;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    const response = await fetch(weatherUrl);
    const jsonData = await response.json();
    displayData(jsonData);
  } catch (err) {
    console.error(err);
  }
}
getLocationWeather();

async function getCityWeather(city) {
  try {
    const cityName = city;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    const response = await fetch(weatherUrl);
    const jsonData = await response.json();
    displayData(jsonData);
  } catch (err) {
    console.error(err);
  }
}

function searchCityWeather(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const cityName = formData.get("city");
  getCityWeather(cityName);
}
form.addEventListener("submit", searchCityWeather);
