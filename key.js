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