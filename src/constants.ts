import EventEmitter from "events";

export const fretboardArray = [
  [
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
  ],
  [
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
  ],
  [
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
  ],
  [
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
  ],
  [
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
  ],
  [
    "E2",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
  ],
];

const generateLookupTable = (
  fretboardArray: string[][]
): Map<string, string> => {
  const lookupTable = new Map();
  for (const [stringIndex, string] of fretboardArray.entries()) {
    for (const [fretIndex, note] of string.entries()) {
      const id = `${stringIndex}::${fretIndex}`;
      lookupTable.set(id, note);
    }
  }
  return lookupTable;
};

export interface InstrumentDisplay {
  playedNotes: Set<string>;
}

export interface IController {
  readonly onKeyEmitter: EventEmitter;
}

export const lookupTable = generateLookupTable(fretboardArray);

export const fretToNote = (stringIndex: number, fretIndex: number): string | undefined => {
  return lookupTable.get(`${stringIndex}::${fretIndex}`);
};

export const isPlayed = (
  stringIndex: number,
  fretIndex: number,
  playedNotes: Set<string>
): boolean => {
  const noteAtCoordinates = fretToNote(stringIndex, fretIndex);
  if (!noteAtCoordinates) {
    return false;
  }
  return playedNotes.has(noteAtCoordinates);
};

