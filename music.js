//logic loop
const fps = 60;
const frameDuration = 1000 / fps;
let prevTime = performance.now();
let accumulatedFrameTime = 0;

var loading = true;


//music stuff
const maxNotesInVoice = 25;
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

//music affect variables
var playSpeed = 1;
var reverbLevel = .1;
let currentKey = ['A','B','C','D','E','F','G'];
let voiceShapes = ["sine", "sine", "sine", "sine"];

const voice0 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});
const voice1 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});
const voice2 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});
const voice3 = new Wad({source : 'sine', volume: .3, env:{attack: .01, hold: .1, release:.8}});

const master = new Wad.Poly({
  reverb  : {
    impulse : "widehall.wav", 
    wet : .3,
  },
  compressor : {
    attack    : .003, 
    knee      : 30,  
    ratio     : 12,   
    release   : .25,  
    threshold : -24,  
  }
});

//number of times the playhead has traveled around the circle
var tripCount = 0;

//degree of playhead out of 360
var degrees = 0;

//objects to keep track of data affects to music
var voices = {
  0 : {voice : voice0},
  1 : {voice : voice1},
  2 : {voice : voice2},
  3 : {voice : voice3}
};
var globalAffects = {};

//object to keep track of notes played from all of the voices.
var notesPlayed = {};

//get playLine from html once the page is loaded
var playLine;
document.addEventListener("DOMContentLoaded", (event) => {
  playLine = document.getElementById("playLine");
});


//main time loop, still needs to be split up between render and update?
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

//logic loop still not actually being utilized. Not sure if I need to
function update(frameDuration)
{

}

//render loop
async function render()
{
  if(playLine == null) {return;}

  await MovePlayline(playLine);

  CheckForNotes();
}

async function MovePlayline(playline)
{
  if(navigator.userAgent.match("Chrome")){
    playline.style.WebkitTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Firefox")){
    playline.style.MozTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("MSIE")){
    playline.style.msTransform = "rotate("+degrees+"deg)";
  } else if(navigator.userAgent.match("Opera")){
    playline.style.OTransform = "rotate("+degrees+"deg)";
  } else {
    playline.style.transform = "rotate("+degrees+"deg)";
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
    CheckForNoteInVoice(voices[i], i);
  }  
}

async function CheckForNoteInVoice(voice, voiceID)
{
  //Return if no notes have been added to this voice
  if(voice.notePositions == null){return;}

  for (let v = 0; v < voice.notePositions.length; v++) 
  {      
    let notePosition = voice.notePositions[v];

    //if the note hasn't already been played
    if(!notesPlayed[voiceID].notePositions.includes(notePosition))
    {
      //if the playline has passed the note
      if(degrees >= notePosition)
      {
        //play it!
        PlayRandomNote(voiceID);
        //make sure it isn't played again until next cycle
        notesPlayed[voiceID].notePositions.push(notePosition);
      }
    }
  }
}

async function PlayRandomNote(voiceID)
{
  var randomNote = await RandomNote();
  voices[voiceID].voice.play({pitch: randomNote});
}

//music stuff
async function RandomNote()
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
  //if weather data is still loading, don't do anything with button press
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
    SetKey(weatherValues[inputValue], inputValue);

  console.log(globalAffects);
  FillRecipeLog();
}

function voiceIDFromStringValue(value)
{
  //parse last character and convert to int, then subtract one to start from 0
  return parseInt(value.slice(-1)) - 1;
}

function NoteAmount(voiceID, data, dataCategory)
{
  //get note amount data
  var rangedData = CalculateNoteAmounts(data);

  //apply data to voice
  voices[voiceID].value = rangedData;
  voices[voiceID].notePositions = [];

  //setup notes played tracking for voice
  notesPlayed[voiceID] = {notePositions : []};

  //find art nodes for previous notes in voice, if any, and remove them
  const oldNodes = document.getElementsByClassName('node' + voiceID);
  const nodeArray = Array.from(oldNodes);
  if(nodeArray.length > 0)
    nodeArray.forEach(node => node.remove());

  //count how many notes we're adding
  var i = 1;
  //Start adding new art nodes to represent notes on screen
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

    //calculate position of new art node
    var newPosition = rangedData * i;

    //apply the rotation to represent the note position
    image.style.transform = "rotate("+newPosition+"deg)";

    //set note to 0 instead of 360 since the playline will only go to 359 before starting over
    if(newPosition == 360)
      newPosition = 0;

    //mute notes that have already been passed by current playhead position
    if(degrees > newPosition)
      notesPlayed[voiceID].notePositions.push(newPosition);
  
    //add noteposition to voice
    voices[voiceID].notePositions.push(newPosition);
  
    //
    i++;
  }
  while((newPosition) <= 360);

  //keep track of voice note amounts
  voices[voiceID].amount = i;
  //keep track of data affecting the note amounts
  voices[voiceID].amountData = dataCategory;

  //TODO figure out better place to do this so that it only happens once
  master.add(voices[voiceID].voice);

  voices[voiceID].voice.defaultEnv.hold = CalculateNoteLength(rangedData);
  voices[voiceID].voice.defaultEnv.attack = CalculateNoteAttack(rangedData);
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

  //apply new shape and volume to voice
  voices[voiceID].voice.source = shape;
  voices[voiceID].voice.defaultVolume = newVolume;

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