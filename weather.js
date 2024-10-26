async function GetWeatherData()
{
  fetch("https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-03e4fdc6-f760-4ce0-902e-d4df44ec875e/default/WeatherData", {
    "method": "GET"
    })
  .then(response => {
      if (!response.ok) {
        throw response; //check the http response code and if isn't ok then throw the response as an error
      }
                
      return response.json(); //parse the result as JSON
    
    }).then(response => {
      //response now contains parsed JSON ready for use
      weatherData = response;
      parseWeatherData(weatherData);
      document.getElementById('loadingPopup').style.display = "none";
      loading = false;
      GetDataFromSolarNode();
    }).catch((errorResponse) => {
      if (errorResponse.text) { //additional error information
        errorResponse.text().then( errorMessage => {
          //errorMessage now returns the response body which includes the full error message
        })
      } else {
        //no additional error information 
      } 
    });
}

GetWeatherData();
  
var weatherData;

var dataValues = {};

let weatherDataTypes = {
  moonphase: '%',
  temp: '°F',
  humidity: '%',
  precipprob: '%',
  windspeed: 'mph',
  cloudcover: '%',
  solarradiation: 'W/m2'
}

function parseWeatherData(weatherData)
{
    console.log('Weather Data recieved for: ' + weatherData['address']);
    dataValues["moonphase"] = {value: weatherData['currentConditions'].moonphase, min: 0, max: 1};
    console.log(`Moonphase is ${dataValues["moonphase"].value}.`);

    dataValues["temp"] = {value: weatherData['currentConditions'].temp * 9 / 5 + 32, min: -27, max: 100};
    console.log(`Temperature is ${dataValues["temp"].value}.`);

    dataValues["humidity"] = {value: weatherData['currentConditions'].humidity, min: 0, max: 100};
    console.log(`Humidity is ${dataValues["humidity"].value}.`);

    dataValues["precipprob"] = {value: weatherData['currentConditions'].precipprob, min: 0, max: 100};
    console.log(`Precipitation Probability is ${dataValues["precipprob"].value}.`);

    dataValues["windspeed"] = {value: weatherData['currentConditions'].windspeed, min: 0, max: 98};
    console.log(`Windspeed is ${dataValues["windspeed"].value}.`);

    dataValues["cloudcover"] = {value: weatherData['currentConditions'].cloudcover, min: 0, max: 100};
    console.log(`Cloud Cover is ${dataValues["cloudcover"].value}.`);
    
    dataValues["solarradiation"] = {value: weatherData['currentConditions'].solarradiation, min: 0, max: 90};
    console.log(`Solar Radiation is ${dataValues["solarradiation"].value}.`);

    let weatherDataOptions = document.getElementsByTagName("option");
    let optionArray = Array.from(weatherDataOptions);
    
    optionArray.forEach(item =>{
      if(dataValues[item.value] != null)
      {
        var data = dataValues[item.value].value;
        if(item.value == 'moonphase')
          data = 100 * data;
        item.innerText += ': ' + data + weatherDataTypes[item.value];
      }
    });
}

function rangeData(dataValue, min, max, newMin, newMax)
{
  if (dataValue < min)
    return newMin;
  if (dataValue > max)
    return newMax;
  else
    return (((newMax-newMin) * (dataValue - min)) / (max - min)) + newMin;
}

