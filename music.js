function startMusic(){
    AddArt();
}

var looper;
var degrees = 0;

const notes = "ABCDEFG";
const octaves = "345";

var reverbLevel = .4;

var tripCount = 0;

var voices = {};


function rotateAnimation(el,speed){
  var elem = document.getElementById(el);
  if(navigator.userAgent.match("Chrome")){
    elem.style.WebkitTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Firefox")){
    elem.style.MozTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("MSIE")){
    elem.style.msTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Opera")){
    elem.style.OTransform = "rotate("+degrees+"deg)";
  } else {
    elem.style.transform = "rotate("+degrees+"deg)";
  }
  looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
  degrees++;
  if(degrees > 359){
    tripCount++;
    degrees = 1;
  }

  if(voices[0] != null)
  {
    if(degrees % voices[0].value === 0)
    {
      if (!navigator.userActivation.hasBeenActive){return;}
      var note = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
        source : 'square', env:{attack: .01, hold:.1, release:.8}});
      note.play();
      console.log("Ding!");
    }  
  }

  //commented out due to console errors
  /*
  if(degrees % moisture0Spacing === 0)
  {
    if (!navigator.userActivation.hasBeenActive){return;}
    var note = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
      source : 'square', env:{attack: .01, hold:.1, release:.8}});
    note.play();
  }

  if(degrees % moisture1Spacing === 0)
  {
    if (!navigator.userActivation.hasBeenActive){return;}
    var note2 = new Wad({pitch: RandomNote(), source : 'sine', env:{attack: .01, hold:.1, release:.5}});
    note2.play();
  }
  */

  if(tripCount >= 4)
  {
    tripCount = 0;
    Rescan();
  }
}

function Rescan()
{
  var holder = window.document.getElementById("holder");
  holder.innerHTML = "";
  GetDataFromWeb();
}

function RandomNote()
{
  var note;
  
  var randomNote = notes[Math.floor(Math.random() * notes.length)];
  var randomOctave = octaves[Math.floor(Math.random() * octaves.length)];

  note = String(randomNote) + String(randomOctave);
  return note;
}

function AddArt()
{
  var i = 1;
  do
  {
    //create div and add it
    var div = document.createElement("div");
    div.setAttribute("class","container");
    var image = document.createElement("img");
    image.setAttribute("class","node0");
    image.setAttribute("src","node0.png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    image.style.transform = "rotate("+moisture0Spacing * i+"deg)";
    i++;
  }
  while((moisture0Spacing * i) < 360);

  var j = 1;
  do
  {
    //create div and add it
    var div = document.createElement("div");
    div.setAttribute("class","container");
    var image = document.createElement("img");
    image.setAttribute("class","node1");
    image.setAttribute("src","node1.png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    image.style.transform = "rotate("+moisture1Spacing * j+"deg)";
    j++;
  }
  while((moisture1Spacing * j) < 360);

}


function affectMusic()
{
  const dataField = document.getElementById("data");

  const dataCategory = document.querySelector('select[name="data"] option:checked').parentElement.label;
  const inputValue = dataField.value;

  const musicField = document.getElementById("musicElement");

  const musicCategory = document.querySelector('select[name="musicElement"] option:checked').parentElement.label;
  const musicValue = musicField.value;


  console.log(inputValue + ' selected from: ' + dataCategory + ' and connected to ' + musicValue);

  if(musicValue == 'noteAmount')
  {
    NoteAmount(0, weatherValues[inputValue]);
  }

}

function NoteAmount(voiceID, data)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 360);

  voices[voiceID] = {value: rangedData};
  console.log("Voice" + voiceID + " will play every " + voices[voiceID].value);

  var i = 1;
  do
  {
    //create div and add it
    var div = document.createElement("div");
    div.setAttribute("class","container");
    var image = document.createElement("img");
    image.setAttribute("class","node0");
    image.setAttribute("src","node0.png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    image.style.transform = "rotate("+rangedData * i+"deg)";
    i++;
  }
  while((rangedData * i) < 360);
}