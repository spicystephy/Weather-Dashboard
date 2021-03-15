var apiKey = "7700c46b2698574dd90c566760e9e94d";
var searchFormEl = document.querySelector("#theForm");
var cityInput = document.getElementById("#cityText");
var searchBtn = document.querySelector("fa fa-seach");
var searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

// create event for submit button that grabs text from the text box
//then do a fetch with the url with that text
function citySearchBtn(event) {
  event.preventDefault();
  var searchInput = document.querySelector("#cityText").value;
  searchHistory.push(searchInput);
  localStorage.setItem("cities", JSON.stringify(searchHistory));
  if (!searchInput) {
    console.error("Enter a valid city name.");
    return;
  }
  var currentWeather =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput + 
    "&units=imperial&appid=" +
    apiKey;
  //fetch api call
  fetch(currentWeather)
    .then((data) => data.json())
    .then(function (weather) {
      console.log(weather);

      var lat = weather.coord.lat;
      var lon = weather.coord.lon;
      var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(oneCall)
        .then((data) => data.json())
        .then(function (oneCallData) {
          console.log(oneCallData);
        });

      document.querySelector(".card").innerHTML = "";
      var weatherCard = document.createElement("div");
      weatherCard.innerHTML = weather.name;
      weatherCard.classList.add("card", "bg-light", "text-dark", "mb-3", "p-3");
      
      var dateTitle = document.createElement("h5");
      dateTitle.innerHTML = new Date(weather.dt);
      weatherCard.appendChild(dateTitle);
      
      var temp = document.createElement("p");
      temp.innerHTML = weather.main.temp + " F";
      weatherCard.appendChild(temp);

      var humidity = document.createElement("p");
      humidity.innerHTML = weather.main.humidity + " %";
      weatherCard.appendChild(humidity);

      var windSpeed = document.createElement("p");
      windSpeed.innerHTML = weather.wind.speed + " mph";
      weatherCard.appendChild(windSpeed);

      var currentWeatherCard = document.createElement("div");
      currentWeatherCard.classList.add("cardBody");
      weatherCard.append(currentWeatherCard);
      document.querySelector(".card").append(weatherCard);
    });

  //display a part of this data inside weatherCard
}
searchFormEl.addEventListener("submit", citySearchBtn);


//function to create clickable list of cities
function searchList() {
  var btnContainer = document.querySelector(".searchHistory");
  //run function for each cityinput
  searchHistory.forEach(function (cityInput) {
    //create city as btn
    var cityBtn = document.createElement("button");
    //have text content of citybtn to be the cityinput
    cityBtn.textContent = cityInput;
    //append citybtn to btncontainer
    btnContainer.append(cityBtn);
  });
}



