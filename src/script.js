import "./style.css";

document
  .getElementById("InputHeader")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      fetchAndDisplayWeather();
    }
  });

async function fetchAndDisplayWeather() {
  try {
    let inputValue = document.getElementById("input").value;
    
    // Set default value to "iraq" if input is empty
    if(inputValue.trim() === ''){
      inputValue = 'iraq';
      document.getElementById("input").value = 'iraq'; // Optional: update the input field
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

function displayWeatherData(data) {
 const current = data.currentConditions;
const today = data.days[0];
const sunrise = today.sunrise;
const sunset = today.sunset;
const maxTemp = ((today.tempmax - 32) * 5/9).toFixed(2); // Fahrenheit to Celsius
const minTemp = ((today.tempmin - 32) * 5/9).toFixed(2); // Fahrenheit to Celsius
const feelsLike = ((today.feelslike - 32) * 5/9).toFixed(2); // Fahrenheit to Celsius
const humidity = today.humidity;
const windSpeed = today.windspeed;
const windGust = today.windgust;
const pressure = today.pressure;
const uvIndex = today.uvindex;
const rainChance = today.precipprob;

displayHourlyForecast(data.days[0].hours);
  displayWeeklyForecast(data.days);
  /*
   ! For Weather Container !
  */

  document.getElementById('weather-icon').src = `${iconMap[current.icon] || ""}`
document.getElementById('temperature').textContent = `${((current.temp - 32) * 5/9).toFixed(2)}°C`; 
 document.getElementById('description').textContent = `${current.conditions}`


  /*
  ?? Weather-Container-Side
  */

  document.getElementById('MaxTemp').textContent = `${maxTemp}°C`
  document.getElementById('MinTemp').textContent = `${minTemp}°C`
  document.getElementById('FeelLike').textContent = `Feels Like ${feelsLike}°`

  /*
  *? Chance Rain Container
  */

  document.getElementById('Chance-of-Rain').textContent = 'Chance of rain'
  document.getElementById('description-Chance-of-Rain').textContent = `${rainChance}%`
  
  /*
  * Wind Container  *
  */
  document.getElementById('Chance-of-Wind').textContent = 'Wind'
  document.getElementById('description-Chance-of-Wind').textContent = `${windSpeed} km/h`



  /*
  !! Sunrise Container 
   */
  document.getElementById('Chance-of-Sunrise').textContent = 'Sunrise'
  document.getElementById('description-Chance-of-Sunrise').textContent = `${sunrise} AM`

  /*
  ? SunSet Container 
  */
    document.getElementById('Chance-of-Sunset').textContent = `Sunset`;
    document.getElementById('description-Chance-of-Sunset').textContent = `${sunset} PM`

    /*
    ! Pressure Container
    */
    document.getElementById('Chance-of-Pressure').textContent = 'Pressure'
    document.getElementById('description-Chance-of-Pressure').textContent = `${pressure} mb`

    /*
    !! UV index Container 
    */
   document.getElementById('Chance-of-UvIndex').textContent = 'UV'
   document.getElementById('description-Chance-of-UvIndex').textContent = `${uvIndex}`

   /*
   ?? Humidity - Container
   */
  document.getElementById('Chance-of-Humidity').textContent = 'Humidity'
  document.getElementById('description-Chance-of-Humidity').textContent = `${humidity}%`

  /*
  !? Gusts COntainer  
  */
 document.getElementById('Chance-of-Gusts').textContent = 'Gusts'
 document.getElementById('description-Chance-of-Gusts').textContent = `${windGust} km/h`
}

// Helper functions for time formatting
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { weekday: 'short' });
}

// Display hourly forecast
function displayHourlyForecast(hourlyData) {
  const hourlyContainer = document.getElementById('hourly-forecast');
  hourlyContainer.innerHTML = '';
  
  // Show next 12 hours
  const hoursToShow = 12;
  
  hourlyData.slice(0, hoursToShow).forEach(hour => {
    const tempC = ((hour.temp - 32) * 5/9).toFixed(1);
    const hourCard = document.createElement('div');
    hourCard.className = 'hourly-card';
    hourCard.innerHTML = `
      <div class="time">${formatTime(hour.datetimeEpoch)}</div>
      <img class="forecast-icon" src="${iconMap[hour.icon] || ''}" alt="${hour.conditions}">
      <div class="temp">${tempC}°C</div>
      <div class="precip">${hour.precipprob}%</div>
    `;
    hourlyContainer.appendChild(hourCard);
  });
}

// Display weekly forecast
function displayWeeklyForecast(dailyData) {
  const weeklyContainer = document.getElementById('weekly-forecast');
  weeklyContainer.innerHTML = '';
  
  // Skip today (index 0) and show next 7 days
  dailyData.slice(1, 8).forEach(day => {
    const maxTempC = ((day.tempmax - 32) * 5/9).toFixed(1);
    const minTempC = ((day.tempmin - 32) * 5/9).toFixed(1);
    const dayCard = document.createElement('div');
    dayCard.className = 'daily-card';
    dayCard.innerHTML = `
      <div class="day">${formatDay(day.datetimeEpoch)}</div>
      <img class="forecast-icon" src="${iconMap[day.icon] || ''}" alt="${day.conditions}">
      <div class="temp-range">
        <span class="max-temp">${maxTempC}°</span>
        <span class="min-temp">${minTempC}°</span>
      </div>
      <div class="precip">${day.precipprob}%</div>
    `;
    weeklyContainer.appendChild(dayCard);
  });
}


// Fetch weather for default location (iraq) when page loads
window.addEventListener('load', fetchAndDisplayWeather);


