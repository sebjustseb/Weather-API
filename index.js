async function getWeather(city) {
    const apiKey = '834dc2ea44a6165c4be10efb181bac81';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display weather data
function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = ''; // Clear previous weather cards

    // Current weather data
    const currentWeather = data.list[0];
    const currentWeatherCard = createWeatherCard(currentWeather);
    weatherContainer.appendChild(currentWeatherCard);

    // 5-day forecast
    const forecast = data.list.slice(1, 6); // Get next 5 days
    forecast.forEach(day => {
        const forecastCard = createWeatherCard(day);
        weatherContainer.appendChild(forecastCard);
    });
}

function createWeatherCard(data) {
    const card = document.createElement('div');
    card.classList.add('weather-card');

    // City name
    const cityName = document.createElement('h2');
    cityName.textContent = data.name;
    card.appendChild(cityName);

    // Date
    const date = document.createElement('p');
    date.textContent = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    card.appendChild(date);

    // Weather icon
    const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const icon = document.createElement('img');
    icon.src = iconUrl;
    card.appendChild(icon);

    // Temperature
    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${Math.round(data.main.temp - 273.15)}°C`;
    card.appendChild(temperature);

    // Humidity
    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    card.appendChild(humidity);

    // Wind speed
    const windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    card.appendChild(windSpeed);

    return card;
}
// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city)
            .then(data => {
                displayWeather(data);
                // Save city to localStorage
                saveToLocalStorage(city);
            })
            .catch(error => console.error(error));
    } else {
        alert('Please enter a city name');
    }
}

// Function to save searched city to localStorage
function saveToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

// Function to load weather data for a saved city from localStorage
function loadFromLocalStorage() {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.length > 0) {
        // Load weather data for the first city in the list
        getWeather(cities[0])
            .then(data => {
                displayWeather(data);
            })
            .catch(error => console.error(error));
    }
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', handleSubmit);

// Load weather data for a saved city when the page loads
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);