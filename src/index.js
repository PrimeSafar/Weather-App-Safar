import "./style.css";
import "../asset/cloudnight.png";
import "../asset/cloudsun.png";
import "../asset/fag.png";
import "../asset/lighting.png";
import "../asset/moon.png";
import "../asset/rainy.png";
import "../asset/snow.png";
import "../asset/sunnny.png";
import "../asset/sunrain.png";
import "../asset/wind.png";

function getWeatherIcon(iconName) {
  const iconMap = {
    "clear-day": "../asset/sunnny.png",
    "clear-night": "../asset/moon.png",
    "partly-cloudy-day": "../asset/cloudsun.png",
    "partly-cloudy-night": "../asset/cloudnight.png",
    "rain": "../asset/rainy.png",
    "snow": "../asset/snow.png",
    "wind": "../asset/wind.png",
    "cloudy": "../asset/cloudnight.png",
    "fog": "../asset/fag.png",
  };
  return iconMap[iconName] || "../asset/default.png";
}

document.getElementById("InputHeader").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    fetchAndDisplayWeather();
  }
});

async function fetchAndDisplayWeather() {
  try {
    let inputValue = document.getElementById("input").value;
    
    if (inputValue.trim() === '') {
      inputValue = 'iraq';
      document.getElementById("input").value = 'iraq';
    }
    
    const API_KEY = "HJBWZXX9E58Q64DFWM8XDAYUH";
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${inputValue}?unitGroup=us&key=${API_KEY}&contentType=json`
    );
    const weatherData = await response.json();
    displayWeatherData(weatherData);
  } catch (error) {
    document.getElementById("MainShow").innerHTML = `
      <div class="error">Error fetching weather data: ${error.message}</div>
    `;
  }
}

function displayWeatherData(data) {
  const current = data.currentConditions;
  const today = data.days[0];
  const sunrise = today.sunrise;
  const sunset = today.sunset;
  const maxTemp = ((today.tempmax - 32) * 5/9).toFixed(2);
  const minTemp = ((today.tempmin - 32) * 5/9).toFixed(2);
  const feelsLike = ((today.feelslike - 32) * 5/9).toFixed(2);
  const humidity = today.humidity;
  const windSpeed = today.windspeed;
  const windGust = today.windgust;
  const pressure = today.pressure;
  const uvIndex = today.uvindex;
  const rainChance = today.precipprob;

  displayHourlyForecast(data.days[0].hours);
  displayWeeklyForecast(data.days);

  // Weather Container
  document.getElementById('weather-icon').src = getWeatherIcon(current.icon);
  document.getElementById('temperature').textContent = `${((current.temp - 32) * 5/9).toFixed(2)}°C`;
  document.getElementById('description').textContent = `${current.conditions}`;

  // Weather-Container-Side
  document.getElementById('MaxTemp').textContent = `${maxTemp}°C`;
  document.getElementById('MinTemp').textContent = `${minTemp}°C`;
  document.getElementById('FeelLike').textContent = `Feels Like ${feelsLike}°`;

  // Chance Rain Container
  document.getElementById('Chance-of-Rain').textContent = 'Chance of rain';
  document.getElementById('description-Chance-of-Rain').textContent = `${rainChance}%`;
  
  // Wind Container
  document.getElementById('Chance-of-Wind').textContent = 'Wind';
  document.getElementById('description-Chance-of-Wind').textContent = `${windSpeed} km/h`;

  // Sunrise Container
  document.getElementById('Chance-of-Sunrise').textContent = 'Sunrise';
  document.getElementById('description-Chance-of-Sunrise').textContent = `${sunrise} AM`;

  // SunSet Container
  document.getElementById('Chance-of-Sunset').textContent = `Sunset`;
  document.getElementById('description-Chance-of-Sunset').textContent = `${sunset} PM`;

  // Pressure Container
  document.getElementById('Chance-of-Pressure').textContent = 'Pressure';
  document.getElementById('description-Chance-of-Pressure').textContent = `${pressure} mb`;

  // UV index Container
  document.getElementById('Chance-of-UvIndex').textContent = 'UV';
  document.getElementById('description-Chance-of-UvIndex').textContent = `${uvIndex}`;

  // Humidity Container
  document.getElementById('Chance-of-Humidity').textContent = 'Humidity';
  document.getElementById('description-Chance-of-Humidity').textContent = `${humidity}%`;

  // Gusts Container
  document.getElementById('Chance-of-Gusts').textContent = 'Gusts';
  document.getElementById('description-Chance-of-Gusts').textContent = `${windGust} km/h`;
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { weekday: 'short' });
}

function displayHourlyForecast(hourlyData) {
  const hourlyContainer = document.getElementById('hourly-forecast');
  hourlyContainer.innerHTML = '';
  
  const hoursToShow = 12;
  
  hourlyData.slice(0, hoursToShow).forEach(hour => {
    const tempC = ((hour.temp - 32) * 5/9).toFixed(1);
    const hourCard = document.createElement('div');
    hourCard.className = 'hourly-card';
    hourCard.innerHTML = `
      <div class="time">${formatTime(hour.datetimeEpoch)}</div>
      <img class="forecast-icon" src="${getWeatherIcon(hour.icon)}" alt="${hour.conditions}">
      <div class="temp">${tempC}°C</div>
      <div class="precip">${hour.precipprob}%</div>
    `;
    hourlyContainer.appendChild(hourCard);
  });
}

function displayWeeklyForecast(dailyData) {
  const weeklyContainer = document.getElementById('weekly-forecast');
  weeklyContainer.innerHTML = '';
  
  dailyData.slice(1, 8).forEach(day => {
    const maxTempC = ((day.tempmax - 32) * 5/9).toFixed(1);
    const minTempC = ((day.tempmin - 32) * 5/9).toFixed(1);
    const dayCard = document.createElement('div');
    dayCard.className = 'daily-card';
    dayCard.innerHTML = `
      <div class="day">${formatDay(day.datetimeEpoch)}</div>
      <img class="forecast-icon" src="${getWeatherIcon(day.icon)}" alt="${day.conditions}">
      <div class="temp-range">
        <span class="max-temp">${maxTempC}°</span>
        <span class="min-temp">${minTempC}°</span>
      </div>
      <div class="precip">${day.precipprob}%</div>
    `;
    weeklyContainer.appendChild(dayCard);
  });
}

window.addEventListener('load', fetchAndDisplayWeather);
//new 