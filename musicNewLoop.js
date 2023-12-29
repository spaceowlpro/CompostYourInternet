//gameloop stuff
const fps = 60;
const frameDuration = 1000 / fps;

let prevTime = performance.now();
let accumulatedFrameTime = 0;

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

const voice0 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sine', env:{attack: .5, hold:.1, release:.8}});

const voice1 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

const voice2 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

const voice3 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

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
    degrees = 1;

    for(i = 0; i < 4; i++)
    {
      if(notesPlayed[i] != null)
        notesPlayed[i].notePositions.length = 0;
    }
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
            PlayRandomNote(voice0);
            break;
          case 1:
            PlayRandomNote(voice1);
            break;
          case 2:
            PlayRandomNote(voice2);
            break;
          case 3:
            PlayRandomNote(voice3);
            break;  
        }    
        notesPlayed[i].notePositions.push(element);
      }
    }
  }
}

async function PlayRandomNote(voiceToPlay)
{
  var randomNote = await RandomNote();
  voiceToPlay.play({pitch: randomNote});
  voiceToPlay.stop();
}

//music stuff
async function RandomNote()
{
  var note;
  
  var randomNote = currentKey[Math.floor(Math.random() * currentKey.length)];
  var randomOctave = octaves[Math.floor(Math.random() * octaves.length)];

  note = String(randomNote) + String(randomOctave);
  return note;
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
    NoteAmount(voiceIDFromStringValue(musicCategory), weatherValues[inputValue]);

  if(musicValue == 'reverbLevel')
    ReverbLevel(weatherValues[inputValue]);

  if(musicValue == 'playSpeed')
    PlaySpeed(weatherValues[inputValue]);

  if(musicValue == 'shape')
    NoteShape(voiceIDFromStringValue(musicCategory), weatherValues[inputValue], dataCategory);

  if(musicValue == 'key')
  {
    console.log("setting key");
    SetKey(weatherValues[inputValue], inputValue);
  }

}

function voiceIDFromStringValue(value)
{
  return parseInt(value.slice(-1));
}

function NoteAmount(voiceID, data)
{
  voiceID = voiceID-1;
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 360));

  voices[voiceID] = {value: rangedData};
  voices[voiceID].notePositions = [];

  notesPlayed[voiceID] = {notePositions : []};

  console.log("Voice" + voiceID + " will play every " + voices[voiceID].value);

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
    image.setAttribute("src","node" + voiceID + ".png");

    div.appendChild(image);
    var layout = window.document.getElementsByClassName("layout");
    layout[0].appendChild(div);
    image.style.transform = "rotate("+rangedData * i+"deg)";
    voices[voiceID].notePositions.push(rangedData * i);
    i++;
  }
  while((rangedData * i) < 360);

  voices[voiceID].amount = i;
  console.log(voices[voiceID].notePositions);

  switch(voiceID)
  {
    case 0:
      master.add(voice0)
      break; 
    case 1:
      master.add(voice1)
      break; 
    case 2:
      master.add(voice2)
      break; 
    case 3:
      master.add(voice3)
      break; 
            
  }

  console.log(master);
}

function ReverbLevel(data)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 1);

  //round to 2 decimals
  rangedData = Math.round((rangedData + Number.EPSILON) * 100) / 100;

  console.log('setting reverb to ' + rangedData);
  reverbLevel = rangedData;

  master.reverb.wet = reverbLevel;
  console.log(master);
}

function PlaySpeed(data)
{
  playSpeed = rangeData(data.value, data.min, data.max, 0, 1.5);
}

function NoteShape(voiceID, data, dataType)
{
  //return range between 0-4 and clamp it to the next int as a category
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  //set as sine as failsafe
  var shape = 'sine';

  //potentially use dataType to change the direction of the shape selection
  //maybe you want sound to be more mellow if the moon is full etc

  console.log('ranged data = ' + rangedData);
  switch(rangedData)
  {
    case 1:
      shape = 'sine';
      break;
    case 2:
      shape = 'triangle';
      break;
    case 3:
      shape = 'square';
      break;
    case 4:
      shape = 'sawtooth';
      break;
  }

  switch(voiceID)
  {
    case 1:
      voice0.source = shape;
      break;
    case 2:
      voice1.source = shape;
      break;
    case 3:
      voice2.source = shape;
      break;
    case 4:
      voice3.source = shape;
      break;
  }
}

async function SetKey(data, dataCategory)
{
  console.log("setting key for " + dataCategory);
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
  console.log("setting scale to " + scale);
  let notes = [];

  scale.forEach((degree) => notes.push(noteArray[degree]));

  currentKey.length = 0;
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