
function startMusic(){
    AddArt();
}

var looper;
var degrees = 0;

const notes = "ABCDEFG";
const octaves = "345";
let noteArray = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B'
];

let currentKey = ['A','B','C','D','E','F','G'];

var reverbLevel = 0;

var tripCount = 0;

var voices = {};

var playSpeed = 10;

var voice0 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
  source : 'square', env:{attack: .01, hold:.1, release:.8}});

var voice1 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

var voice2 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
  source : 'triangle', env:{attack: .01, hold:.1, release:.8}});

var voice3 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : reverbLevel},
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});


function rotateAnimation(el){
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

  looper = setTimeout('rotateAnimation(\''+el+'\','+playSpeed+')',playSpeed);
  degrees++;
  if(degrees > 359){
    tripCount++;
    degrees = 1;
  }

  if(voices["count"] != null)
  {
    for(i = 0; i < voices["count"].value; i++)
    {
      if(degrees % voices[i].value === 0)
      {
        if (!navigator.userActivation.hasBeenActive){return;}
        switch(i)
        {
          case 0:
            voice0.play({pitch: RandomNote(), reverb : {impulse : "widehall.wav", wet: reverbLevel}});
            break;
          case 1:
            voice1.play({pitch: RandomNote(), reverb : {impulse : "widehall.wav", wet: reverbLevel}});
            break;
          case 2:
            voice2.play({pitch: RandomNote(), reverb : {impulse : "widehall.wav", wet: reverbLevel}});
            break;
          case 3:
            voice3.play({pitch: RandomNote(), reverb : {impulse : "widehall.wav", wet: reverbLevel}});
            break;  
        }
      }  
    }  
  }

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
  
  var randomNote = currentKey[Math.floor(Math.random() * currentKey.length)];
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
    if(voices["count"] == null)
    {
      NoteAmount(0, weatherValues[inputValue]);
      voices["count"] = {value: 1};
    }
    else
    {
      if(voices["count"].value > 3)
      {
        alert("Reached maximum voices.");
        return;
      }
      NoteAmount(voices["count"].value, weatherValues[inputValue]);
      voices["count"].value++;
    }
  }

  if(musicValue == 'reverbLevel')
    ReverbLevel(weatherValues[inputValue]);

  if(musicValue == 'playSpeed')
    PlaySpeed(weatherValues[inputValue]);

}

function NoteAmount(voiceID, data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 360));

  voices[voiceID] = {value: rangedData};
  console.log("Voice" + voiceID + " will play every " + voices[voiceID].value);

  var i = 1;
  do
  {
    //create div and add it
    var div = document.createElement("div");
    div.setAttribute("class","container");
    var image = document.createElement("img");
    image.setAttribute("class","node" + voiceID);
    image.setAttribute("src","node" + voiceID + ".png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    image.style.transform = "rotate("+rangedData * i+"deg)";
    i++;
  }
  while((rangedData * i) < 360);
}

function ReverbLevel(data)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 1);

  //round to 2 decimals
  rangedData = Math.round((rangedData + Number.EPSILON) * 100) / 100;

  console.log('setting reverb to ' + rangedData);
  reverbLevel = rangedData;
}

function PlaySpeed(data)
{
  playSpeed = rangeData(data.value, data.min, data.max, 0, 20);
}

async function SetKey(data, dataCategory)
{
  switch(dataCategory)
  {
    case 'moonphase':
      MoonphaseKey(data);
      break;
    case 'temp':
      TempKey(data);
      break;
    case 'humidity':
      TempKey(data);
      break;
    case 'precipprob':
      PrecipitationKey(data);
      break;
    case 'windspeed':
      WindKey(data);
      break;
    case 'solarradiation':
      SunKey(data);
      break;
  }
}

async function MoonphaseKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  switch(rangedData)
  {
    case 0:
      SetScale(Hirajoshi);
      break;
    case 1:
      SetScale(Insen);
      break;
    case 2:
      SetScale(Iwato);
      break;
    case 3:
      SetScale(Kumoi);
      break;  
  }
}

async function PrecipitationKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  switch(rangedData)
  {
    case 0:
      SetScale(MajorPentatonic);
      break;
    case 1:
      SetScale(MinorPentatonic);
      break;
    case 2:
      SetScale(HarmonicMajor);
      break;
    case 3:
      SetScale(HarmonicMinor);
      break;  
  }
}

async function SunKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 3));

  switch(rangedData)
  {
    case 0:
      MoonphaseKey();
      break;
    case 1:
      SetScale(MinorPentatonic);
      break;
    case 2:
      SetScale(MajorPentatonic);
      break;
  }
}

async function WindKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 3));

  switch(rangedData)
  {
    case 0:
      SetScale(WholeTone);
      break;
    case 1:
      SetScale(HalfWholeDim);
      break;
    case 2:
      SetScale(WholeHalfDim);
      break;
  }
}

async function TempKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  switch(rangedData)
  {
    case 0:
      SetScale(MinorBlues);
      break;
    case 1:
      SetScale(PelogBem);
      break;
    case 2:
      SetScale(Ionian);
      break;
    case 3:
      SetScale(WholeTone);
      break;  
  }
}

async function SetScale(scale)
{
  let notes = [];

  scale.forEach((degree) => notes.push(noteArray[degree]));

  currentKey = notes;
}

let Ionian = [0, 2, 4, 5, 7, 9, 11];
let HarmonicMajor = [0, 2, 4, 5, 7, 8, 11];
let HarmonicMinor = [0, 2, 3, 5, 7, 8, 11];

let WholeTone = [0, 2, 4, 6, 8, 10];
let MajorPentatonic = [0, 2, 4, 7, 9];
let MinorPentatonic = [0, 3, 5, 7, 10];
let MinorBlues = [0, 3, 5, 6, 7, 10];

let HalfWholeDim = [0, 1, 3, 4, 6, 7, 9, 10];
let WholeHalfDim = [0, 2, 3, 5, 6, 8, 9, 11];

let Hirajoshi = [0, 5, 7, 8, 12];
let Insen = [0, 1, 6, 8, 11];
let Iwato = [0, 1, 6, 7, 11];
let Kumoi = [0, 2, 3, 7, 9];

let PelogBem = [0, 1, 6, 7, 8];