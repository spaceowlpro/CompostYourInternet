async function MoonphaseKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 4));

  switch(rangedData)
  {
    case 0:
      SetScale(Hirajoshi);
      break;
    case 1:
      SetScale(Hirajoshi);
      break;
    case 2:
      SetScale(Insen);
      break;
    case 3:
      SetScale(Iwato);
      break;
    case 4:
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
        SetScale(MajorPentatonic);
        break;  
    case 2:
      SetScale(MinorPentatonic);
      break;
    case 3:
      SetScale(HarmonicMajor);
      break;
    case 4:
      SetScale(HarmonicMinor);
      break;  
  }
}

async function CloudKey(data)
{
  var rangedData = Math.ceil(rangeData(data.value, data.min, data.max, 0, 3));

  switch(rangedData)
  {
    case 0:
      MoonphaseKey();
      break;
    case 1:
      MoonphaseKey();
      break;
    case 2:
      SetScale(MinorPentatonic);
      break;
    case 3:
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
      SetScale(WholeTone);
      break;
    case 2:
      SetScale(HalfWholeDim);
      break;
    case 3:
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
      SetScale(MinorBlues);
      break;
    case 2:
      SetScale(PelogBem);
      break;
    case 3:
      SetScale(Ionian);
      break;
    case 4:
      SetScale(WholeTone);
      break;  
  }
}

async function SetScale(scale)
{
  console.log("setting scale to " + scale.scale);
  let notes = [];

  scale.scale.forEach((degree) => notes.push(noteArray[degree]));

  currentKey.length = 0;
  currentKey = notes;
  InteractNotification('Setting key to a ' + scale.name + ' scale.');
}

let Ionian = {scale: [0, 2, 4, 5, 7, 9, 11], name: 'Ionian'};
let HarmonicMajor = {scale: [0, 2, 4, 5, 7, 8, 11], name: 'Harmonic Major'};
let HarmonicMinor = {scale: [0, 2, 3, 5, 7, 8, 11], name: 'Harmonic Minor'};

let WholeTone = {scale: [0, 2, 4, 6, 8, 10], name: 'Whole-tone'};
let MajorPentatonic = {scale: [0, 2, 4, 7, 9], name: 'Major Pentatonic'};
let MinorPentatonic = {scale: [0, 3, 5, 7, 10], name: 'Minor Pentatonic'};
let MinorBlues = {scale: [0, 3, 5, 6, 7, 10], name: 'Minor Blues'};

let HalfWholeDim = {scale: [0, 1, 3, 4, 6, 7, 9, 10], name: 'Half-whole Diminished'};
let WholeHalfDim = {scale: [0, 2, 3, 5, 6, 8, 9, 11], name: 'Whole-half Diminished'};

let Hirajoshi = {scale: [0, 5, 7, 8], name: 'Hirajoshi'};
let Insen = {scale: [0, 1, 6, 8, 11], name: 'Insen'};
let Iwato = {scale: [0, 1, 6, 7, 11], name: 'Iwato'};
let Kumoi = {scale: [0, 2, 3, 7, 9], name: 'Kumoi'};

let PelogBem = {scale: [0, 1, 6, 7, 8], name: 'Pelog Bem'};