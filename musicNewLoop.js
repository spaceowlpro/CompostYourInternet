//gameloop stuff
const fps = 15;
const frameDuration = 1000 / fps;

let prevTime = performance.now();
let accumulatedFrameTime = 0;


//music stuff
const notes = "ABCDEFG";
const octaves = "345";

var note0 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : 0},
  source : 'square', env:{attack: .01, hold:.1, release:.8}});

var note1 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : 0},
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});

var note2 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : 0},
  source : 'triangle', env:{attack: .01, hold:.1, release:.8}});

var note3 = new Wad({pitch: RandomNote(), volume: .3, reverb  : {impulse : "widehall.wav", wet : 0},
  source : 'sine', env:{attack: .01, hold:.1, release:.8}});


var reverbLevel = 0;

var tripCount = 0;

var voices = {};
var notesPlayed = {};

var playSpeed = 1;


//render stuff
var degrees = 0;


//main time loop
function gameloop(time) {
  const elapsedTimeBetweenFrames = time - prevTime;
  prevTime = time;
  accumulatedFrameTime += elapsedTimeBetweenFrames;
  while (accumulatedFrameTime >= frameDuration) {
    update(frameDuration);
    accumulatedFrameTime -= frameDuration;
  }
  render();
  requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);

//logic loop
function update(frameDuration)
{
}

//render loop
function render()
{
  const elem = document.getElementById("img1");

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

  for(i = 0; i < 4; i++)
  {
    if(voices[i] != null)
    {
      for (let v = 0; v < voices[i].notePositions.length; v++) 
      {      
        var element = voices[i].notePositions[v];
        if(!notesPlayed[i].notePositions.includes(element))
        {
          if(degrees >= element)
          {
            //play note!
            switch(i)
            {
              case 0:
                note0.play({pitch: RandomNote()});
                break;
              case 1:
                note1.play({pitch: RandomNote()});
                break;
              case 2:
                note2.play({pitch: RandomNote()});
                break;
              case 3:
                note3.play({pitch: RandomNote()});
                break;  
            }    
            notesPlayed[i].notePositions.push(element);
          }
        }
      }

      /*
      if(Math.ceil(degrees) % voices[i].value === 0)
      {
        console.log(Math.ceil(degrees));
        if (!navigator.userActivation.hasBeenActive){return;}
        switch(i)
        {
          case 0:
            note0.play({pitch: RandomNote()});
            break;
          case 1:
            note1.play({pitch: RandomNote()});
            break;
          case 2:
            note2.play({pitch: RandomNote()});
            break;
          case 3:
            note3.play({pitch: RandomNote()});
            break;  
        }
      }    
      */
    }
  }  

}


//music stuff
function RandomNote()
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
      NoteAmount(parseInt(musicCategory.slice(-1)), weatherValues[inputValue]);

  if(musicValue == 'reverbLevel')
    ReverbLevel(weatherValues[inputValue]);

  if(musicValue == 'playSpeed')
    PlaySpeed(weatherValues[inputValue]);

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
}

function ReverbLevel(data)
{
  var rangedData = rangeData(data.value, data.min, data.max, 0, 1);

  //round to 2 decimals
  rangedData = Math.round((rangedData + Number.EPSILON) * 100) / 100;

  console.log('setting reverb to ' + rangedData);
  reverbLevel = rangedData;

  note0.reverb.wet = reverbLevel;
  note1.reverb.wet = reverbLevel;
  note2.reverb.wet = reverbLevel;
  note3.reverb.wet = reverbLevel;

}

function PlaySpeed(data)
{
  playSpeed = rangeData(data.value, data.min, data.max, 0, 1.5);
}