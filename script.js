// Step 1: Get your free API key from https://openweathermap.org
// Sign up → go to API Keys → copy your key → paste below
const API_KEY = "ac49cf1da375351292a78f2033c537cf";

// This maps weather condition codes to emojis
function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️";   // Thunderstorm
  if (weatherId >= 300 && weatherId < 500) return "🌧️";   // Drizzle
  if (weatherId >= 500 && weatherId < 600) return "🌧️";   // Rain
  if (weatherId >= 600 && weatherId < 700) return "❄️";   // Snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️";   // Mist/Fog
  if (weatherId === 800)                   return "☀️";   // Clear sky
  if (weatherId > 800)                     return "☁️";   // Cloudy
  return "🌡️";
}

async function getWeather() {
  // Step 2: Get what the user typed
  const city = document.getElementById("cityInput").value.trim();

  // Get references to the result and error divs
  const resultDiv = document.getElementById("weatherResult");
  const errorDiv  = document.getElementById("errorMsg");

  // Hide both first (reset state)
  resultDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");

  // If user typed nothing, stop here
  if (!city) return;

  // Step 3: Call the OpenWeatherMap API
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    // If city not found, API returns status 404
    if (!response.ok) {
      errorDiv.classList.remove("hidden");
      return;
    }

    // Step 4: Convert response to JSON
    const data = await response.json();

    // Step 5: Extract the values you need from the response
    const cityName    = data.name + ", " + data.sys.country;
    const temp        = Math.round(data.main.temp);
    const feelsLike   = Math.round(data.main.feels_like);
    const humidity    = data.main.humidity;
    const windSpeed   = data.wind.speed;
    const description = data.weather[0].description;
    const weatherId   = data.weather[0].id;

    // Step 6: Put those values into the HTML elements
    document.getElementById("cityName").textContent      = cityName;
    document.getElementById("temperature").textContent   = temp + "°C";
    document.getElementById("feelsLike").textContent     = feelsLike + "°C";
    document.getElementById("humidity").textContent      = humidity + "%";
    document.getElementById("windSpeed").textContent     = windSpeed + " m/s";
    document.getElementById("description").textContent   = description;
    document.getElementById("weatherIcon").textContent   = getWeatherEmoji(weatherId);

    // Step 7: Show the result box
    resultDiv.classList.remove("hidden");

  } catch (error) {
    // Network error or something else went wrong
    errorDiv.classList.remove("hidden");
  }
}

// Allow pressing Enter key to search instead of clicking button
document.getElementById("cityInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") getWeather();
});