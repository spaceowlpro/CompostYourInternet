fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/fort%20wayne%20in?unitGroup=metric&include=current&key=RWFJFVQTWSMVX78RMXGMXK33V&contentType=json", {
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
  
  }).catch((errorResponse) => {
    if (errorResponse.text) { //additional error information
      errorResponse.text().then( errorMessage => {
        //errorMessage now returns the response body which includes the full error message
      })
    } else {
      //no additional error information 
    } 
  });
  
var weatherData;

var weatherValues = {};

function parseWeatherData(weatherData)
{
    console.log('Weather Data recieved for: ' + weatherData['address']);
    weatherValues["moonphase"] = {value: weatherData['days'][0].moonphase, min: 0, max: 100};
    console.log(`Moonphase is ${weatherValues["moonphase"].value}.`);

    weatherValues["temp"] = {value: weatherData['days'][0].temp, min: -27, max: 100};
    console.log(`Temperature is ${weatherValues["temp"].value}.`);

    weatherValues["humidity"] = {value: weatherData['days'][0].humidity, min: 0, max: 100};
    console.log(`Humidity is ${weatherValues["humidity"].value}.`);

    weatherValues["precipprob"] = {value: weatherData['days'][0].precipprob, min: 0, max: 100};
    console.log(`Precipitation Probability is ${weatherValues["precipprob"].value}.`);

    weatherValues["windspeed"] = {value: weatherData['days'][0].windspeed, min: 0, max: 98};
    console.log(`Windspeed is ${weatherValues["windspeed"].value}.`);

    weatherValues["cloudcover"] = {value: weatherData['days'][0].cloudcover, min: 0, max: 100};
    console.log(`Cloud Cover is ${weatherValues["cloudcover"].value}.`);
    
    weatherValues["solarradiation"] = {value: weatherData['days'][0].solarradiation, min: 0, max: 90};
    console.log(`Solar Radiation is ${weatherValues["solarradiation"].value}.`);
}

function rangeData(dataValue, min, max, newMin, newMax)
{
  return Math.ceil((((newMax-newMin) * (dataValue - min)) / (max - min)) + newMin);
}

