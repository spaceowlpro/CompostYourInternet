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

function parseWeatherData(weatherData)
{
    console.log('Weather Data recieved for: ' + weatherData['address']);
    console.log(`Moonphase is ${weatherData['days'][0].moonphase}.`);
    console.log(`Temperature is ${weatherData['days'][0].temp}.`);
    console.log(`Humidity is ${weatherData['days'][0].humidity}.`);
    console.log(`Precipitation Probability is ${weatherData['days'][0].precipprob}.`);
    console.log(`Windspeed is ${weatherData['days'][0].windspeed}.`);
    console.log(`Cloud Cover is ${weatherData['days'][0].cloudcover}.`);
    console.log(`Solar Radiation is ${weatherData['days'][0].solarradiation}.`);
}

function rangeData(dataValue, min, max, newMin, newMax)
{
  return (((newMax-newMin) * (dataValue - min)) / (max - min)) + newMin;
}