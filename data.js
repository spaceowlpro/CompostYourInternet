//var node0Moisture = 25;
//var node1Moisture = 70;

var moisture0Spacing;
var moisture1Spacing;

function GetNoteSpacing(percentage)
{
    var spacing = Math.ceil(percentage / 100 * 360);
    console.log(spacing);
    return spacing;
}

var id = '1muq5xrjSeglbPRMeIAw5HFgKrKX-AnXuwqzq4W99GzA';
var gid = '0';
var url = 'https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json&tq&gid='+gid;

var finalMoisture0;
var finalMoisture1;

window.onload = (event) => {
  GetDataFromWeb();
};

function GetDataFromWeb()
{
  fetch(url)
  .then(response => response.text())
  .then(data => document.getElementById("json").innerHTML=myItems(data.substring(47).slice(0, -2))  
  );
function myItems(jsonString){
  var json = JSON.parse(jsonString);
  var table = '<table><tr>'
    var newData = "";
    var moisture0Logging;
    var moisture1Logging;
    var lastMoisture0;
    var lastMoisture1;
    var finalMoisture0;
    var finalMoisture1;
  json.table.cols.forEach(colonne => table += '<th>' + colonne.label + '</th>')
  table += '</tr>'
  json.table.rows.forEach(ligne => {
    table += '<tr>'
    ligne.c.forEach(cellule => {
        try{var valeur = cellule.f ? cellule.f : cellule.v}
        catch(e){var valeur = ''}
        table += '<td>' + valeur + '</td>'
        newData += valeur;
        if(valeur == "node0Moisture")
        {
            moisture0Logging = true;
            moisture1Logging = false;
        }
        else if(valeur == "node1Moisture")
        {
            moisture1Logging = true;
            moisture0Logging = false;
        }
        else
        {
            if(moisture0Logging)
            {
                lastMoisture0 = valeur;
            }
            if(moisture1Logging)
            {
                lastMoisture1 = valeur;
            }
            moisture1Logging = false;
            moisture0Logging = false;
        }
      }
    )
    table += '</tr>'
    }
  )
  table += '</table>'
  finalMoisture0 = lastMoisture0;
  console.log("Moisture0 = " + finalMoisture0);
  finalMoisture1 = lastMoisture1;
  console.log("Moisture1 = " + finalMoisture1);
  moisture0Spacing = GetNoteSpacing(finalMoisture0);
  moisture1Spacing = GetNoteSpacing(finalMoisture1);
  startMusic();
  return table
}
}

