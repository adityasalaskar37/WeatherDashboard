const apiKey = '9520a6aa281a015b42ed4839d10163ee';
const baseUrl = "https://api.openweathermap.org/data/2.5/";

async function getWeatherData(location) {
    try {
        const response = await fetch(`${baseUrl}weather?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        updateMainContainer(data);
        updateAdditionalInfo(data);
        getForecastData(location);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data. Please check the location or try again later.");
    }
}

async function getWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`${baseUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        updateMainContainer(data);
        updateAdditionalInfo(data);
        getForecastDataByCoordinates(lat, lon);
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error);
        alert("Error fetching weather data by coordinates. Please try again later.");
    }
}

function updateMainContainer(data) {
    const mainContainer = document.querySelector('.main-container');
    mainContainer.innerHTML = `
        <div class="current-weather">
            <p style="font-size:60px;">${Math.round(data.main.temp)}°C</p>
            <h2 style="margin-top:-60px;">${data.name}</h2>
        </div>
    `;
}

function updateAdditionalInfo(data) {
    document.querySelectorAll('.big_container1 .small_span')[0].innerHTML = `
        <p style="text-align:center;"><a style="font-size:40px; display: block; margin-left: 10px;">🌵</a><br> <b>Humidity:</b> ${data.main.humidity}%</p>
    `;
    document.querySelectorAll('.big_container1 .small_span')[1].innerHTML = `
        <p style="text-align:center;"><a style="font-size:40px; display: block; margin-left: 10px;">☀️</a><br> <b>UV Index:</b> ${data.uvi ? data.uvi : 'N/A'}</p>
    `;
    document.querySelectorAll('.big_container1 .small_span')[2].innerHTML = `
        <p style="text-align:center;"><a style="font-size:40px; display: block; margin-left: 10px;">🌄</a><br> <b>Sunrise:</b> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
    `;
    document.querySelectorAll('.big_container1 .small_span')[3].innerHTML = `
        <p style="text-align:center;"><a style="font-size:40px; display: block; margin-left: 10px;"">🌇</a><br> <b>Sunset:</b> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
    document.querySelector('.small_container').innerHTML = `
        <p style="color:white; display: block; margin-left: 30px; font-size:20px;"><a style="font-size:40px;">🌧️</a>Monthly Rainfall:   <b>${data.rain ? data.rain["1h"] : 0} mm</b></p>
    `;
}

async function getForecastData(location) {
    try {
        const response = await fetch(`${baseUrl}forecast?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data.cod !== '200') throw new Error(data.message);
        updateForecast(data);
        updateGraph(data);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("Error fetching forecast data. Please try again later.");
    }
}

async function getForecastDataByCoordinates(lat, lon) {
    try {
        const response = await fetch(`${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data.cod !== '200') throw new Error(data.message);
        updateForecast(data);
        updateGraph(data);
    } catch (error) {
        console.error("Error fetching forecast data by coordinates:", error);
        alert("Error fetching forecast data by coordinates. Please try again later.");
    }
}

function updateForecast(data) {
    const forecastSpans = document.querySelectorAll('.bottom_container .small_span');
    for (let i = 0; i < 5; i++) {
        const dayData = data.list[i * 8]; // every 8th item gives daily data
        forecastSpans[i].innerHTML = `
            <p style="text-align: Center;">${new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="${dayData.weather[0].description}" style="width:70px; height: auto; display: block; margin: 0 auto;margin-top:-10px;">
            <p style="text-align: Center;">${Math.round(dayData.main.temp)}°C</p>
        `;
    }
}

function updateGraph(data) {
    const temperatures = data.list.map(item => item.main.temp);
    const precipitations = data.list.map(item => item.rain ? item.rain["3h"] : 0);
    const winds = data.list.map(item => item.wind.speed);
    const labels = data.list.map(item => new Date(item.dt * 1000).toLocaleTimeString());

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Temperature (°C)', data: temperatures, borderColor: 'red', fill: false },
                { label: 'Precipitation (mm)', data: precipitations, borderColor: 'blue', fill: false },
                { label: 'Wind Speed (m/s)', data: winds, borderColor: 'green', fill: false },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Time' } },
                y: { display: true, title: { display: true, text: 'Values' } }
            }
        }
    });
}


// Event listeners for search and location buttons
document.querySelector('.search-btn').addEventListener('click', () => {
    const location = document.querySelector('.search-box').value;
    if (location.trim()) {
        getWeatherData(location);
    }
});

document.querySelector('.search-box').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const location = event.target.value;
        if (location.trim()) {
            getWeatherData(location);
        }
    }
});

document.querySelector('.location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoordinates(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Call the function with a default location
getWeatherData('Pune');
