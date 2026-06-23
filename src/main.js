import './style.css';
const indicator = document.querySelector("#indicator");
const cityInput = document.querySelector("#city");
const btn = document.querySelector("#searchBtn");

btn.addEventListener("click", get_data);

cityInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
        get_data();
    }
});

window.addEventListener("load", ()=>{

    let lastCity = localStorage.getItem("lastCity");

    if(lastCity){
        cityInput.value = lastCity;
        get_data();
    }
});

async function api_data(city){

    try{

        btn.disabled = true;

        indicator.innerHTML =
        `<span class="spinner"></span> Fetching weather...`;

        let response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=860c00fe6182714c6f84b5cd89ef65cd&units=metric`
        );

        let data = await response.json();

        if(data.cod == "404"){

            indicator.innerText = "❌ City not found";
            btn.disabled = false;
            return;
        }

        document.querySelector("#city-name").innerText =
        data.name;

        document.querySelector("#temp").innerText =
        `🌡️ Temperature: ${data.main.temp} °C`;

        document.querySelector("#humidity").innerText =
        `💧 Humidity: ${data.main.humidity}%`;

        document.querySelector("#wind").innerText =
        `💨 Wind: ${data.wind.speed} m/s`;

        document.querySelector("#weather").innerText =
        `🌤️ Weather: ${data.weather[0].description}`;

        const weatherType = data.weather[0].main;

        const icons = {
            Clear:"☀️",
            Clouds:"☁️",
            Rain:"🌧️",
            Thunderstorm:"⛈️",
            Snow:"❄️",
            Mist:"🌫️",
            Haze:"🌫️",
            Smoke:"🌫️",
            Drizzle:"🌦️"
        };

        document.querySelector("#icon").innerText =
        icons[weatherType] || "🌤️";

        localStorage.setItem("lastCity", city);

        indicator.innerText = "✅ Weather Loaded";

    }
    catch(error){

        console.log(error);

        indicator.innerText =
        "❌ Network Error. Try Again.";

    }
    finally{

        btn.disabled = false;

    }
}

function get_data(){

    let city = cityInput.value.trim();

    if(city === ""){

        indicator.innerText =
        "⚠️ Please enter a city";

        return;
    }

    api_data(city);
}