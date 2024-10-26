var moisture;
var temperature;

function GetNoteSpacing(percentage)
{
    var spacing = Math.ceil(percentage / 100 * 360);
    console.log(spacing);
    return spacing;
}

var id = '16xfsfaJnMO2bnEgKehE0xLqXC3g4te_EwKcZyC8ENo4';
var gid = '0';
var nodeUrl = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&tq&gid='+gid;

function GetDataFromSolarNode()
{
  fetch(nodeUrl)
  .then(response => response.text())
  .then(data => myItems(data.substring(47).slice(0, -2))  
  );
    function myItems(jsonString){
      var json = JSON.parse(jsonString);
      value = json.table.rows[json.table.rows.length - 1].c[0].v;
      console.log("value = " + value);
      ParseData(value);
    }
}

function ParseData(stringData)
{
  var newStringData = splitMulti(stringData, ['m1', 'm2', 't1', 't2'])

  if (newStringData.length == 5)
  {
    var newMoisture = parseInt(newStringData[1]);
    var newTemp = parseInt(newStringData[3]);
    if (newMoisture != null)
      moisture = newMoisture;
    if(newTemp != null)
      temperature = newTemp;
  }
  setSolarData();
}

function splitMulti(str, tokens){
  var tempChar = tokens[0]; // We can use the first token as a temporary join character
  for(var i = 1; i < tokens.length; i++){
      str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}

function setSolarData()
{
  console.log("moisture = " + moisture);
  console.log("temp = " + temperature);

  let dataOptions = document.getElementsByTagName("option");
  let optionArray = Array.from(dataOptions);

  dataValues["compostTemperature"] = {value: temperature, min: 90, max: 180};
  dataValues["compostMoisture"] = {value: moisture, min: 0, max: 100};

  optionArray.forEach(item =>{
    if(item.value == "compostTemperature")
    {
      item.innerText = 'Compost Temperature: ' + temperature + '°F'
    }
    else if(item.value == "compostMoisture")
    {
        item.innerText = 'Compost Moisture: ' + moisture + '%';
    }  
  });
}