//gameloop stuff
const fps = 60;
const frameDuration = 1000 / fps;

let prevTime = performance.now();
let accumulatedFrameTime = 0;

//music stuff
const notes = "ABCDEFG";
const octaves = "345";

const voice0 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

const voice1 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'triangle', env:{attack: .01, hold:.1, release:.8}});

const voice2 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'square', env:{attack: .01, hold:.1, release:.8}});

const voice3 = new Wad({pitch: RandomNote(), volume: .3,
  source : 'sawtooth', env:{attack: .01, hold:.1, release:.8}});

const master = new Wad.Poly({
  reverb  : {impulse : "widehall.wav", wet : reverbLevel}
});

var reverbLevel = 0;

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
  
  var randomNote = notes[Math.floor(Math.random() * notes.length)];
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
}

function ReverbLevel(data)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 1);

  //round to 2 decimals
  rangedData = Math.round((rangedData + Number.EPSILON) * 100) / 100;

  console.log('setting reverb to ' + rangedData);
  reverbLevel = rangedData;

  master.reverb.wet = reverbLevel;
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