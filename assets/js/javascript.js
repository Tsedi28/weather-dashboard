//Variables
var cityResultText = $("#cityResult");
var tempResultText = $("#tempResult");
var humidityResult = $("#humidityResult");
var windResultText = $("#windResult");
var UVIndexText = $("#UVIndexResult");
var mainIcon = $("#mainIcon");
var rowCards = $("#rowCards");
var dayForecast = $("#row5day");
var cardDisplay = $("#cardDisplay");
var buttonList = $("#buttonsList");
var forecastDate = {};
var forecastIcon = {};
var forecastTemp = {};
var forecastHum = {};
var today = moment().format('MM' + "/" + 'DD' + '/' + 'YYYY');

//API Key from OpenWeather
var APIKey = "&units=imperial&APPID=e334ca0ec3c7c1d4dad9064c8d7ebff6";
var url =  "https://api.openweathermap.org/data/2.5/weather?q=";
var citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];

$(document).ready(function (){
    var userInput = citiesArray[citiesArray.length - 1];
    currentWeather(userInput);
    forecast(userInput);
    lastSearch ();

});

//Current weather
function currentWeather(userInput) {
    mainIcon.empty();
    var queryURL = url + userInput + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        var cityInfo = response.name;
        var country = response.sys.country; 
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var icon = response.weather[0].icon;
        var UVindexURL = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + lat + "&" + "lon=" + lon + "&APPID=d17a4e27c0a9f45be714b6ae8a3d89ee";
        var newImgMain = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
        mainIcon.append(newImgMain);
        cityResultText.text(cityInfo + ", " + country + " " + today);
        tempResultText.text("Temperature: " + temp + " ºF");
        humidityResult.text("Humidity: " + humidity + " %");
        windResultText.text("Wind Speed: " + wind + " MPH");
        $.ajax({
            url: UVindexURL,
            method: "GET"
        }).then(function(uvIndex){
            var UV = uvIndex.value;
            var colorUV;
            if (UV <= 3) {
                colorUV = "green";
            } else if (UV >= 3 & UV <= 6) {
                colorUV = "yellow";
            } else if (UV >= 6 & UV <= 8) {
                colorUV = "orange";
            } else {
                colorUV = "red";
            }
            UVIndexText.empty();
            var UVResultText = $("<p>").attr("class", "card-text").text("UV Index: ");
            UVResultText.append($("<span>").attr("class", "uvindex").attr("style", ("background-color: " + colorUV)).text(UV))
            UVIndexText.append(UVResultText);
            cardDisplay.attr("style", "display: flex; width: 98%");
        })    
    })
    }

    //The forecast based on user search/input
    function forecast (userInput) {
        dayForecast.empty();
        rowCards.empty();
        var fore5 = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&units=imperial&APPID=d17a4e27c0a9f45be714b6ae8a3d89ee";
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
            for (var i = 0; i < response.list.length; i += 8){
                
                forecastDate[i] = response.list[i].dt_txt;
                forecastIcon[i] = response.list[i].weather[0].icon;
                forecastTemp[i] = response.list[i].main.temp; 
                forecastHum[i] = response.list[i].main.humidity;  
    
                var newCol2 = $("<div>").attr("class", "col-2");
                rowCards.append(newCol2);
    
                var newDivCard = $("<div>").attr("class", "card text-white bg-primary mb-3");
                newDivCard.attr("style", "max-width: 18rem;")
                newCol2.append(newDivCard);
    
                var newCardBody = $("<div>").attr("class", "card-body");
                newDivCard.append(newCardBody);
    
                var newH5 = $("<h5>").attr("class", "card-title").text(moment(forecastDate[i]).format("MMM Do"));
                newCardBody.append(newH5);
    
                var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastIcon[i] + "@2x.png");
                newCardBody.append(newImg);
    
                var newPTemp = $("<p>").attr("class", "card-text").text("Temp: " + Math.floor(forecastTemp[i]) + "ºF");
                newCardBody.append(newPTemp);
    
                var newPHum = $("<p>").attr("class", "card-text").text("Humidity: " + forecastHum[i] + " %");
                newCardBody.append(newPHum);
    
                dayForecast.append(fore5);
                };
                })
    
            }
            
            //Local storage
            function storeData (userInput) {
                var userInput = $("#searchInput").val().trim().toLowerCase();
                var containsCity = false;
            
                if (citiesArray != null) {
            
                    $(citiesArray).each(function(x) {
                        if (citiesArray[x] === userInput) {
                            containsCity = true;
                        }
                    });
                }
            
                if (containsCity === false) {
                    citiesArray.push(userInput);
                }
            
                localStorage.setItem("Saved City", JSON.stringify(citiesArray));
            
            }

            //Previous searches
            function lastSearch () {
                buttonList.empty()
                for (var i = 0; i < citiesArray.length; i ++) {
                    var newButton = $("<button>").attr("type", "button").attr("class","savedBtn btn btn-secondary btn-lg btn-block");
                    newButton.attr("data-name", citiesArray[i])
                    newButton.text(citiesArray[i]);
                    buttonList.prepend(newButton);
                }
                $(".savedBtn").on("click", function(event){
                    event.preventDefault();
                    var userInput = $(this).data("name");
                    currentWeather(userInput);
                    forecast(userInput);
                })
            
            }
            
            //Search button
            $(".btn").on("click", function (event){
                event.preventDefault();
                if ($("#searchInput").val() === "") {
                alert("Please type a userInput to know the current weather");
                } else
                var userInput = $("#searchInput").val().trim().toLowerCase();
                currentWeather(userInput);
                forecast(userInput);
                storeData();
                lastSearch();
                $("#searchInput").val("");
            
            })