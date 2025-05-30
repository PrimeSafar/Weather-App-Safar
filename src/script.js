import "./style.css";

// Function to get icon path based on weather condition
function getWeatherIcon(condition) {
  if (!condition) return "assets/default.png";
  
  condition = condition.toLowerCase();

  if (condition.includes("clear-day")) {
    return "../asset/sunnny.png";
  } 
  else if (condition.includes("clear-night")) {
    return "../asset/moon.png";
  }
  else if (condition.includes("partly-cloudy-day")) {
    return "../asset/cloudsun.png";
  }
  else if (condition.includes("partly-cloudy-night")) {
    return "../asset/cloudnight.png";
  }
  else if (condition.includes("rain") || condition.includes("drizzle")) {
    return "../asset/rainy.png";
  }
  else if (condition.includes("snow") || condition.includes("sleet")) {
    return "../asset/snow.png";
  }
  else if (condition.includes("wind") || condition.includes("breezy")) {
    return "../asset/wind.png";
  }
  else if (condition.includes("cloudy") || condition.includes("overcast")) {
    return "../asset/cloudnight.png";
  }
  else if (condition.includes("fog") || condition.includes("haze")) {
    return "assets/fog.png";
  }
  else if (condition.includes("thunder") || condition.includes("lightning")) {
    return "../asset/lighting.png";
  }
  else if (condition.includes("sun") && condition.includes("rain")) {
    return "../asset/sunrain.png";
  }
  else {
    return "../asset/cloudsun.png";
  }
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
  
  // Set main weather icon
  const weatherIcon = document.getElementById('weather-icon');
  weatherIcon.src = getWeatherIcon(current.conditions);
  weatherIcon.onerror = () => { weatherIcon.src = "assets/default.png"; };

  // Set weather data
  document.getElementById('temperature').textContent = `${((current.temp - 32) * 5/9).toFixed(2)}°C`;
  document.getElementById('description').textContent = current.conditions;

  // Set additional weather info
  document.getElementById('MaxTemp').textContent = `${((today.tempmax - 32) * 5/9).toFixed(2)}°C`;
  document.getElementById('MinTemp').textContent = `${((today.tempmin - 32) * 5/9).toFixed(2)}°C`;
  document.getElementById('FeelLike').textContent = `Feels Like ${((today.feelslike - 32) * 5/9).toFixed(2)}°`;
  document.getElementById('description-Chance-of-Rain').textContent = `${today.precipprob}%`;
  document.getElementById('description-Chance-of-Wind').textContent = `${today.windspeed} km/h`;
  document.getElementById('description-Chance-of-Sunrise').textContent = `${today.sunrise} AM`;
  document.getElementById('description-Chance-of-Sunset').textContent = `${today.sunset} PM`;
  document.getElementById('description-Chance-of-Pressure').textContent = `${today.pressure} mb`;
  document.getElementById('description-Chance-of-UvIndex').textContent = today.uvindex;
  document.getElementById('description-Chance-of-Humidity').textContent = `${today.humidity}%`;
  document.getElementById('description-Chance-of-Gusts').textContent = `${today.windgust} km/h`;

  // Display forecasts
  displayHourlyForecast(data.days[0].hours);
  displayWeeklyForecast(data.days);
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
  
  hourlyData.slice(0, 12).forEach(hour => {
    const tempC = ((hour.temp - 32) * 5/9).toFixed(1);
    const hourCard = document.createElement('div');
    hourCard.className = 'hourly-card';
    hourCard.innerHTML = `
      <div class="time">${formatTime(hour.datetimeEpoch)}</div>
      <img class="forecast-icon" src="${getWeatherIcon(hour.conditions)}" 
           alt="${hour.conditions}" 
           onerror="this.src='assets/default.png'">
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
      <img class="forecast-icon" src="${getWeatherIcon(day.conditions)}" 
           alt="${day.conditions}" 
           onerror="this.src='assets/default.png'">
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