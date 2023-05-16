const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need??

                // currentTab = OldTab
                //clickTab = newTab


let currentTab = userTab;
// My API KEY
const API_KEY = "42e15da7eef384e31fc310f5240b1dc9";
currentTab.classList.add("current-tab");
getfromSessionStorage();

//Ek kam or pending hai ??

function switchTab(clickedTab) {
    if(clickedTab != currentTab){

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // if there is no active -> (clicked happens)
        if(!searchForm.classList.contains("active")){
            // search form wala container is invisible , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // I'm first on the search wale tab ma tha , and now i'm in your weather tab is visible hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab m your wether m agya hu to, ab weather bhi display bhi krna pdega , 
            // so lets check local storage first for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}

// Switch in userTab
userTab.addEventListener("click", () =>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

//Switch in searchTab
searchTab.addEventListener("click", () =>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

   async function fetchUserWeatherInfo(coordinates){
        const{lat, lon} = coordinates;
        //make grant container invisible
        grantAccessContainer.classList.remove("active");
        // make loader visible
        loadingScreen.classList.add("active");


        // API_?ALL
        
        try{
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err){
            loadingScreen.classList.remove("active");
            //HW
        }
    }
//  Dynamic UI Showing the weather
    function renderWeatherInfo(weatherInfo){

        // Firstly we have to fetch the elements

        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");


        // Fetching value from weatherInfo Object from UI elements
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;     

    }
//Fetching user location by grant location by user
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
    
    const grantAccessButton = document.querySelector("[data-grantAccess]");
    grantAccessButton.addEventListener("click", getLocation);
    
    const searchInput = document.querySelector("[data-searchInput]");
    
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityName = searchInput.value;
    
        if(cityName === "")
            return;
        else 
            fetchSearchWeatherInfo(cityName);
    })


    async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
    
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
              );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err) {
            //hW
        }
    }

