const apiKey = '9520a6aa281a015b42ed4839d10163ee';
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const additionalInfo = document.getElementById('additional-info');
const forecastWeather = document.getElementById('forecast-weather');
const loadingIndicator = document.getElementById('loading');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        toggleLoading(true);
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);
        displayAdditionalInfo(currentData);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        displayForecastWeather(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data. Please try again.');
    } finally {
        toggleLoading(false);
    }
}

function displayCurrentWeather(data) {
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentWeather.innerHTML = `
        <h1>${data.name}</h1>
        <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
        <p style="font-size: 20px;">${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
    `;
}

function displayAdditionalInfo(data) {
    additionalInfo.innerHTML = `
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
}

function displayForecastWeather(data) {
    forecastWeather.innerHTML = '<h2>5-Day Forecast</h2>';
    const forecastItems = data.list.filter((item, index) => index % 8 === 0);
    forecastItems.forEach(item => {
        const date = new Date(item.dt_txt);
        const weatherIcon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        forecastWeather.innerHTML += `
            <div class="forecast-item">
                <p>${date.toDateString()}</p>
                <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
                <p>Temp: ${item.main.temp} °C</p>
                <p>Weather: ${item.weather[0].description}</p>
            </div>
        `;
    });
}

function toggleLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}
