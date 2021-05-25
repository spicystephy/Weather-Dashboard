var apiKey = "7700c46b2698574dd90c566760e9e94d";
var searchFormEl = document.querySelector("#theForm");
var cityInput = document.getElementById("#cityText");
var searchBtn = document.querySelector("fa fa-search");
var searchHistory = JSON.parse(localStorage.getItem("city name")) || [];
var currentDate = moment().format("LLLL");

// create event for submit button that grabs text from the text box
//then do a fetch with the url with that text
function citySearchBtn(event) {
  event.preventDefault();
  var searchInput = document.querySelector("#cityText").value.trim();
  searchHistory.push(searchInput);
  localStorage.setItem("city name", JSON.stringify(searchHistory));
  // if (!searchInput) {
  //   console.error("Enter a valid city name.");
  //   return;
  // }

  var currentWeather =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput +
    "&units=imperial&appid=" +
    apiKey;
  //fetch api call
  fetch(currentWeather)
    .then((data) => data.json())
    .then(function (weather) {
      console.log(weather);

      if (weather.cod === "404") {
        window.alert("Enter a valid city.");
        return;
      }

      var lat = weather.coord.lat;
      var lon = weather.coord.lon;

      var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
      fetch(oneCall)
        .then((data) => data.json())
        .then(function (oneCallData) {
          displayCurrent(oneCallData);
          renderForecast(oneCallData);
          console.log(oneCallData);

          var cityName = weather.name;

          document.querySelector(".card").innerHTML = "";
          var cityCard = document.createElement("div");
          cityCard.innerHTML = "Weather for " + cityName;
          // cityCard.classList.add("card");
          document.querySelector(".card").append(cityCard);
        });
    });
}
searchFormEl.addEventListener("submit", citySearchBtn);

function displayCurrent(oneCallData) {
  document.querySelector(".container").innerHTML = "";
  var weatherCard = document.createElement("div");

  // var currentWeatherCard = document.createElement("div");
  // currentWeatherCard.classList.add("cardBody");
  // weatherCard.append(currentWeatherCard);
  document.querySelector(".container").append(weatherCard);
  // document.querySelector(".card").append(".container")

  var dateTitle = document.createElement("p");
  dateTitle.innerHTML = "<strong>Date:</strong> " + currentDate;
  weatherCard.appendChild(dateTitle);

  var temp = document.createElement("p");
  temp.innerHTML =
    "<strong>Temperature:</strong> " +
    Math.round(oneCallData.current.temp) +
    " °F";
  weatherCard.appendChild(temp);

  var humidity = document.createElement("p");
  humidity.innerHTML =
    "<strong>Humidity:</strong> " + oneCallData.current.humidity + " %";
  weatherCard.appendChild(humidity);

  var windSpeed = document.createElement("p");
  windSpeed.innerHTML =
    "<strong>Wind Speed:</strong> " +
    Math.round(oneCallData.current.wind_speed) +
    " mph";
  weatherCard.appendChild(windSpeed);

  var uvIndex = document.createElement("p");
  uvIndex.innerHTML = "<strong>UV Index:</strong> " + oneCallData.current.uvi;
  weatherCard.appendChild(uvIndex);

  var icon = document.createElement("img");
  icon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" +
      oneCallData.current.weather[0].icon +
      ".png"
  );
  weatherCard.appendChild(icon);

  //display a part of this data inside weatherCard
}

function renderForecast(oneCallData) {
  document.querySelector(".forecast").innerHTML = "";

  for (let i = 1; i < 6; i++) {
    let n = oneCallData.daily[i];
    var dailyCard = document.createElement("div");

    var dateTitle = document.createElement("p");
    dateTitle.innerHTML = "<strong>Date:</strong> " + n.dt;
    dailyCard.appendChild(dateTitle);

    var dayTemp = document.createElement("p");
    dayTemp.innerHTML =
      "<strong>High:</strong> " + Math.round(n.temp.day) + " °F";
    dailyCard.appendChild(dayTemp);

    var nightTemp = document.createElement("p");
    nightTemp.innerHTML =
      "<strong>Low:</strong> " + Math.round(n.temp.night) + " °F";
    dailyCard.appendChild(nightTemp);
    document.querySelector(".forecast").append(dailyCard);

    var icon = document.createElement("img");
    icon.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" + n.weather[0].icon + ".png"
    );
    dailyCard.appendChild(icon);

    var desc = document.createElement("p");
    desc.innerHTML = n.weather[0].description;
    dailyCard.appendChild(desc);
    document.querySelector(".forecast").append(dailyCard);
  }
}

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
