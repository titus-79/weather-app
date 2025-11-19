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
        document.getElementById('wind-speed').textContent = `Vent: ${weatherData.current.wind_kph} kph ${weatherData.current.wind_dir}`;
        document.getElementById('feels-like').textContent = `Ressenti: ${weatherData.current.feelslike_c} °C`;
        document.getElementById('humidity').textContent = `Humidité: ${weatherData.current.humidity} %`;
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

document.addEventListener("DOMContentLoaded", async () => {
  await updateWeather() ;
});


/*
 {
     "ville": "Niort",
     "api_key": "50717e49bb624e5092a145346251911"
 }
 const url = `https://api.weatherapi.com/v1/current.json?key=50717e49bb624e5092a145346251911&q=Niort&lang=fr`;

 {"location":
    {"name":"Niort",
    "region":"Poitou-Charentes",
    "country":"France","lat":46.3167,
    "lon":-0.4667,"tz_id":"Europe/Paris",
    "localtime_epoch":1763570432,
    "localtime":"2025-11-19 17:40"},
 "current":
    {"last_updated_epoch":1763569800,
    "last_updated":"2025-11-19 17:30",
    "temp_c":9.1,
    "temp_f":48.4,
    "is_day":0,
    "condition":
        {"text":"Clair","icon":"//cdn.weatherapi.com/weather/64x64/night/113.png","code":1000},
        "wind_mph":13.0,
        "wind_kph":20.9,
        "wind_degree":329,
        "wind_dir":"NNW",
        "pressure_mb":1011.0,
        "pressure_in":29.85,
        "precip_mm":0.0,
        "precip_in":0.0,
        "humidity":62,
        "cloud":0,
        "feelslike_c":6.2,
        "feelslike_f":43.1,
        "windchill_c":2.9,
        "windchill_f":37.3,
        "heatindex_c":6.6,
        "heatindex_f":43.8,
        "dewpoint_c":2.2,
        "dewpoint_f":35.9,
        "vis_km":10.0,
        "vis_miles":6.0,
        "uv":0.0,
        "gust_mph":20.4,
        "gust_kph":32.9,
        "short_rad":0,
        "diff_rad":0,
        "dni":0,
        "gti":0}}


*/