//gameloop stuff
const fps = 60;
const frameDuration = 1000 / fps;

let prevTime = performance.now();
let accumulatedFrameTime = 0;

var loading = true;

const maxNotesInVoice = 25;

//music stuff
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
var reverbLevel = .1;
let voiceShapes = ["sine", "sine", "sine", "sine"];

const voice0 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});

const voice1 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});

const voice2 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});

const voice3 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});
console.log(voice0);

const master = new Wad.Poly({
  reverb  : {
    impulse : "widehall.wav", 
    wet : .3,
  },
  compressor : {
    attack    : .003, // The amount of time, in seconds, to reduce the gain by 10dB. This parameter ranges from 0 to 1.
    knee      : 30,  // A decibel value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion. This parameter ranges from 0 to 40.
    ratio     : 12,   // The amount of dB change in input for a 1 dB change in output. This parameter ranges from 1 to 20.
    release   : .25,  // The amount of time (in seconds) to increase the gain by 10dB. This parameter ranges from 0 to 1.
    threshold : -24,  // The decibel value above which the compression will start taking effect. This parameter ranges from -100 to 0.
  }
});

var tripCount = 0;

var voices = {};
var globalAffects = {};
var notesPlayed = {};

var playSpeed = 1;


//render stuff
var degrees = 0;


//main time loop
async function gameloop(time) {
  //play around with moving render in and outside the while loop
  const elapsedTimeBetweenFrames = time - prevTime;
  prevTime = time;
  accumulatedFrameTime += elapsedTimeBetweenFrames;
  while (accumulatedFrameTime >= frameDuration) {
    update(frameDuration);
    render();
    accumulatedFrameTime -= frameDuration;
  }
  requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);

//logic loop
function update(frameDuration)
{
}

//render loop
async function render()
{
  const elem = document.getElementById("img1");

  await MovePlayhead(elem);

  CheckForNotes();

}

async function MovePlayhead(playhead)
{
  if(navigator.userAgent.match("Chrome")){
    playhead.style.WebkitTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Firefox")){
    playhead.style.MozTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("MSIE")){
    playhead.style.msTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Opera")){
    playhead.style.OTransform = "rotate("+degrees+"deg)";
  } else {
    playhead.style.transform = "rotate("+degrees+"deg)";
  }

  degrees += 1 * playSpeed;
  if(degrees > 359){
    tripCount++;
    degrees = 0;

    for(i = 0; i < 4; i++)
    {
      if(notesPlayed[i] != null)
        notesPlayed[i].notePositions.length = 0;
    }
  }

  /* Once we have a way of tracking all of the change data we can update weather data and update the music
  if(tripCount > 8)
    UpdateData();
  */
}

async function UpdateData()
{
  await GetWeatherData();

  for(i = 0; i < voices.length; i++)
  {

  }

}

async function CheckForNotes()
{
  for(i = 0; i < 4; i++)
  {
    if(voices[i] != null)
    {
      CheckForNoteInVoice(voices[i], i);
    }
  }  
}

async function CheckForNoteInVoice(voice, i)
{
  for (let v = 0; v < voice.notePositions.length; v++) 
  {      
    var element = voice.notePositions[v];
    if(!notesPlayed[i].notePositions.includes(element))
    {
      if(degrees >= element)
      {
        //play note!
        switch(i)
        {
          case 0:
            PlayRandomNote(voice0, 0);
            break;
          case 1:
            PlayRandomNote(voice1, 1);
            break;
          case 2:
            PlayRandomNote(voice2, 2);
            break;
          case 3:
            PlayRandomNote(voice3, 3);
            break;  
        }    
        notesPlayed[i].notePositions.push(element);
      }
    }
  }
}

async function PlayRandomNote(voiceToPlay, voiceID)
{
  let range = octaves[voiceID];
  var randomNote = await RandomNote(range);
  voiceToPlay.play({pitch: randomNote});
}

//music stuff
async function RandomNote(range)
{
  //use range to select octave instead
  var note;
  
  var randomNote = currentKey[Math.floor(Math.random() * currentKey.length)];
  var randomOctave = octaves[Math.floor(Math.random() * octaves.length)];

  note = String(randomNote) + String(randomOctave);
  return note;
}

function affectMusic()
{
  if(loading){return;}

  const dataField = document.getElementById("data");

  const dataCategory = document.querySelector('select[name="data"] option:checked').parentElement.label;
  const inputValue = dataField.value;

  const musicField = document.getElementById("musicElement");

  const musicCategory = document.querySelector('select[name="musicElement"] option:checked').parentElement.label;
  const musicValue = musicField.value;


  console.log(inputValue + ' selected from: ' + dataCategory + ' and connected to ' + musicValue);

  if(musicValue == 'noteAmount')
    NoteAmount(voiceIDFromStringValue(musicCategory), weatherValues[inputValue], inputValue);

  if(musicValue == 'reverbLevel')
    ReverbLevel(weatherValues[inputValue], inputValue);

  if(musicValue == 'playSpeed')
    PlaySpeed(weatherValues[inputValue], inputValue);

  if(musicValue == 'shape')
    NoteShape(voiceIDFromStringValue(musicCategory), weatherValues[inputValue], inputValue);

  if(musicValue == 'key')
  {
    SetKey(weatherValues[inputValue], inputValue);
  }

  console.log(globalAffects);
  FillRecipeLog();
}

function voiceIDFromStringValue(value)
{
  return parseInt(value.slice(-1));
}

function NoteAmount(voiceID, data, dataCategory)
{
  voiceID = voiceID-1;
  //var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 360));
  var rangedData = CalculateNoteAmounts(data);

  voices[voiceID] = {value: rangedData};
  voices[voiceID].notePositions = [];

  notesPlayed[voiceID] = {notePositions : []};

  const oldNodes = document.getElementsByClassName('node' + voiceID);
  const nodeArray = Array.from(oldNodes);

  if(nodeArray.length > 0)
    nodeArray.forEach(node => node.remove());

  var i = 1;
  do
  {
    //create div and add it
    var div = document.createElement("div");
    div.setAttribute("class","container");
    var image = document.createElement("img");
    image.setAttribute("class","node" + voiceID);
    image.setAttribute("src","images/"+ voiceShapes[voiceID] + voiceID + ".png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    var newPosition = rangedData * i;

    image.style.transform = "rotate("+newPosition+"deg)";

    if(newPosition == 360)
      newPosition = 0;

    //mute notes that have already been passed by current playhead position
    if(degrees > newPosition)
      notesPlayed[voiceID].notePositions.push(newPosition);
  
    voices[voiceID].notePositions.push(newPosition);
  
    i++;
  }
  while((newPosition) <= 360);

  //keep track of voice note amounts
  voices[voiceID].amount = i;
  //keep track of data affecting the note amounts
  voices[voiceID].amountData = dataCategory;

  switch(voiceID)
  {
    case 0:
      master.add(voice0);
      voice0.defaultEnv.hold = CalculateNoteLength(rangedData);
      voice0.defaultEnv.attack = CalculateNoteAttack(rangedData);
      break; 
    case 1:
      master.add(voice1);
      voice1.defaultEnv.hold = CalculateNoteLength(rangedData);
      voice1.defaultEnv.attack = CalculateNoteAttack(rangedData);
      break; 
    case 2:
      master.add(voice2);
      voice2.defaultEnv.hold = CalculateNoteLength(rangedData);
      voice2.defaultEnv.attack = CalculateNoteAttack(rangedData);
      break; 
    case 3:
      master.add(voice3);
      voice3.defaultEnv.hold = CalculateNoteLength(rangedData);
      voice3.defaultEnv.attack = CalculateNoteAttack(rangedData);
      break; 
            
  }
}

function CalculateNoteAmounts(data)
{
  //get rid of Math.ceil if you want things to be less symmetrical
  return 360 / Math.ceil(rangeData(data.value, data.min, data.max, 1, maxNotesInVoice));
}

function CalculateNoteLength(noteAmount)
{
    
  let noteLength = rangeData(noteAmount, 1, 360, .1, 3);

  //for some reason noteLenght is a string if I don't do this...
  noteLength = noteLength;

  return noteLength;
}

function CalculateNoteAttack(noteAmount)
{
  let noteAttack = rangeData(noteAmount, 1, 360, .01, 1);
  noteAttack = noteAttack;

  return noteAttack;
}

function ReverbLevel(data, dataCategory)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 1);

  //round to 2 decimals
  rangedData = Math.round((rangedData + Number.EPSILON) * 100) / 100;

  reverbLevel = rangedData;

  master.reverb.wet = reverbLevel;

  //keep track of level and data categories
  globalAffects.reverb = reverbLevel;
  globalAffects.reverbData = dataCategory;
}

function PlaySpeed(data, dataCategory)
{
  playSpeed = rangeData(data.value, data.min, data.max, 0, 1.5);
  globalAffects.playSpeed = playSpeed;
  globalAffects.playspeedData = dataCategory;
}

function NoteShape(voiceID, data, dataCategory)
{
  voiceID = voiceID - 1;
  //return range between 0-4 and clamp it to the next int as a category
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  //set as sine as failsafe
  var shape = 'sine';
  var newVolume = .3;

  switch(rangedData)
  {
    case 1:
      voiceShapes[voiceID] = 'sine';
      break;
    case 2:
      voiceShapes[voiceID] = 'triangle';
      break;
    case 3:
      voiceShapes[voiceID] = 'square';
      newVolume = .1;
      break;
    case 4:
      voiceShapes[voiceID] = 'sawtooth';
      newVolume = .15;
      break;
  }

  shape = voiceShapes[voiceID];

  switch(voiceID)
  {
    case 0:
      voice0.source = shape;
      voice0.defaultVolume = newVolume;
      console.log(voice0);
      break;
    case 1:
      voice1.source = shape;
      voice1.defaultVolume = newVolume;
      break;
    case 2:
      voice2.source = shape;
      voice2.defaultVolume = newVolume;
      break;
    case 3:
      voice3.source = shape;
      voice3.defaultVolume = newVolume;
      break;
  }
  ChangeShapeImages(voiceID);
  //keep track of shape data
  voices[voiceID].shapeData = dataCategory;
}

async function ChangeShapeImages(voiceID)
{
  let nodes = document.getElementsByClassName("node" + (voiceID));
  let nodeArray = Array.from(nodes);

  nodeArray.forEach(node => node.src = "images/"+ voiceShapes[voiceID] + (voiceID) + ".png");
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
    case 'cloudcover':
      CloudKey(data);
      break;
  }

  globalAffects.keyData = dataCategory;
}

async function FillRecipeLog()
{
  var recipeLog = document.getElementById('recipeWindow');
  recipeLog.innerText = '';

  if(globalAffects.keyData != null)
  {
    recipeLog.innerText += "Music's key is being chosen by " + globalAffects.keyData + '\n';
  }

  if(globalAffects.playspeedData != null)
  {
    recipeLog.innerText += "Playspeed powered by " + globalAffects.playspeedData + '\n';
  }


  for(let i = 0; i < 4; i++)
  {
    if(voices[i] != null)
    {
      if(voices[i].amountData != null) 
        recipeLog.innerText += "Voice" + (i + 1) + "'s notes placed by " + voices[i].amountData + '\n';
    }
    if(voices[i] != null)
    {
      if(voices[i].shapeData != null)
        recipeLog.innerText += "Voice" + (i + 1) + "'s note shape determined by " + voices[i].shapeData + '\n';
    }
  }
}