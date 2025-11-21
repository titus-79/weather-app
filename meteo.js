let config = null;

async function loadConf() {
    try {
        const response = await fetch('conf.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        config = await response.json();
        console.log("Configuration chargée :", config);
        return config;
    } catch (error) {
        console.error("Erreur lors du chargement de la configuration :", error);
        return null;
    }
}

async function fetchWeatherData(ville, api_Key) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_Key}&q=${ville}&lang=fr`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(`Erreur API: ${data.error.message}`);
        }

        if (data.location.country !== "France") {
            console.log("La ville trouvée n'est pas en France.");}

        console.log("Données météo récupérées :", data);
        return data;
    
    } catch (error) {
            console.error("Erreur lors de la récupération des données météo :", error);
            return null;
        }
}

async function updateWeather() {
    try {
        if (!config) {
        config = await loadConf();
        }
        if (!config.ville || !config.api_key) {
            throw new Error('Configuration incomplète (ville ou api_key manquante)');
        }

        const weatherData = await fetchWeatherData(config.ville, config.api_key);
        if (!weatherData || !weatherData.current) {
            throw new Error('Données météo invalides');
        }

        document.getElementById('condition-icon').src = `https:${weatherData.current.condition.icon}`;

        document.getElementById('temperature').textContent = `${weatherData.current.temp_c} °C`;

        document.getElementById('condition-text').textContent = weatherData.current.condition.text;

        document.getElementById('city').textContent = `${weatherData.location.name}, ${weatherData.location.region}`;

        let windSpeedDiv = document.getElementById('wind-speed');
        windSpeedDiv.innerHTML = 'Vent:';
        let windInfo = document.createElement('div');
        windInfo.textContent = `${weatherData.current.wind_kph} km/h ${weatherData.current.wind_dir}`;
        windSpeedDiv.appendChild(windInfo);

        let feelsLikeDiv = document.getElementById('feels-like');
        feelsLikeDiv.innerHTML = 'Ressenti:';
        let feelsLikeInfo = document.createElement('div');
        feelsLikeInfo.textContent = `${weatherData.current.feelslike_c} °C`;
        feelsLikeDiv.appendChild(feelsLikeInfo);

        let humidityDiv =document.getElementById('humidity');
        humidityDiv.innerHTML = 'Humidité:';
        let humidityInfo =document.createElement('div');
        humidityInfo.textContent = `${weatherData.current.humidity} %`;
        humidityDiv.appendChild(humidityInfo);

        document.getElementById('last-updated').textContent = `Dernière mise à jour: ${weatherData.current.last_updated}`;

    } catch (error) {
        console.error("Erreur:", error);

        document.getElementById('temperature').textContent = 'N/A';
        document.getElementById('condition-text').textContent = 'N/A';
        document.getElementById('city').textContent = 'N/A';
        document.getElementById('wind-speed').textContent = 'N/A';
        document.getElementById('feels-like').textContent = 'N/A';
        document.getElementById('humidity').textContent = 'N/A';
        document.getElementById('last-updated').textContent = 'Erreur de chargement des données météo';
    }
   
}

let timerId = null;
document.addEventListener("DOMContentLoaded", async () => {
    await updateWeather();
    timerId = setInterval(updateWeather, 3600000);
});