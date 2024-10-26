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
      GetDataFromSolarNode();
      //document.getElementById('loadingPopup').style.display = "none";
      //loading = false;
  
    }).catch((errorResponse) => {
      if (errorResponse.text) { //additional error information
        errorResponse.text().then( errorMessage => {
          //errorMessage now returns the response body which includes the full error message
        })
      } else {
        //no additional error information 
      } 
    });
    
    console.log("loading from file");

    fetch("tracerData.json", {
    "method": "GET"
    })
    .then(response => {
      if (!response.ok) {
        throw response; //check the http response code and if isn't ok then throw the response as an error
        console.log("failed to fetch file");
      }  
      return response.json(); //parse the result as JSON
    }).then(response => {
      //response now contains parsed JSON ready for use
      console.log("loaded from file");
      serverData = response;
      console.log(serverData);
      console.log(serverData.length);
      document.getElementById('loadingPopup').style.display = "none";
      loading = false;
    }).catch((errorResponse) => {
      if (errorResponse.text) { //additional error information
        errorResponse.text().then( errorMessage => {
          //errorMessage now returns the response body which includes the full error message
          console.log("Not loading server data")
        })
      } else {
        //no additional error information 
        console.log("no error info, but failed");
      } 
    });
}

function loadServerData()
{
    getFileFromServer("http://compostyourinternet.com/tracerData.json", function(content)
        {
            
        }
    );
}

function getFileFromServer(url, doneCallback) 
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    function handleStateChange() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            doneCallback(xhr.responseText);
        }
    }
}


GetWeatherData();
  
var weatherData;
var serverData;

var dataValues = {};
var serverValues = {};

let weatherDataTypes = {
  moonphase: {sign:'%', longText: 'Moonphase'},
  temp: {sign:'°F', longText:'Temperature'},
  humidity: {sign: '%', longText: 'Humidity'},
  precipprob: {sign: '%', longText: 'Chance of rain'},
  windspeed: {sign: 'mph', longText: 'Windspeed'},
  cloudcover: {sign: '%', longText: 'Cloud cover'},
  solarradiation: {sign: 'W/m2', longText: 'Solar Radiation'},
  solarVoltage: {sign: 'V', longText: 'Solar Voltage'},
  batteryVoltage: {sign: 'V', longText: 'Battery Voltage'},
  batteryPercentage: {sign: '%', longText: 'Battery Percentage'}
}

function parseWeatherData(weatherData)
{
    console.log('Weather Data recieved for: ' + weatherData['address']);
    dataValues["moonphase"] = {value: weatherData['currentConditions'].moonphase * 100, min: 0, max: 100};
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

    //weatherValues["dateTime"] = {value: serverData[serverData.length - 1].dateTime};
    //console.log(`Last server update was ${weatherValues["dateTime"].value}.`);

    dataValues["solarVoltage"] = {value: serverData[serverData.length - 1].solarVoltage, min: 0, max: 24};
    console.log(`Solar Voltage is ${dataValues["solarVoltage"].value}.`);

    dataValues["batteryVoltage"] = {value: serverData[serverData.length - 1].batteryVoltage, min: 0, max: 12};
    console.log(`Battery Voltage is ${dataValues["batteryVoltage"].value}.`);

    if(serverData[serverData.length - 1].batteryPercentage != null)
    {
      dataValues["batteryPercentage"] = {value: serverData[serverData.length - 1].batteryPercentage * 100, min: 0, max: 100};
      console.log(`Battery Percentage is ${dataValues["batteryPercentage"].value}.`);  
    }

    let dataOptions = document.getElementsByTagName("option");
    let optionArray = Array.from(dataOptions);
    
    optionArray.forEach(item =>{
      if(dataValues[item.value] != null)
      {
        var data = dataValues[item.value].value;
        item.innerText += ': ' + data + weatherDataTypes[item.value].sign;
      }
    });
}

function rangeData(dataValue, min, max, newMin, newMax)
{
  if(dataValue < min)
    return newMin;
  if(dataValue > max)
    return newMax;
  else
    return (((newMax-newMin) * (dataValue - min)) / (max - min)) + newMin;
}

