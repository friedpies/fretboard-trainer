import EventEmitter from "events";
import { IController } from "../../constants";

export interface IPiano {
  HTML: Element;
  forceKeyDown(key: Element): void;
  forceKeyUp(key: Element): void;
  keyDown(key: Element): void;
  keyUp(key: Element): void;
  keyNumber(key: Element): string;
  keyNote(key: Element): string;
  keyOctave(key: Element): string;
}

export class PianoModel implements IController {
  readonly onKeyEmitter = new EventEmitter();
  protected htmlPiano = require("html-piano")(window);
  protected pianoObj: IPiano;
  public node: Element;
  protected previousNotes = new Set<string>();

  constructor() {
    this.pianoObj = this.htmlPiano.newPiano(
      { note: "e", octave: 2 },
      { note: "e", octave: 5 }
    );
    this.node = this.pianoObj.HTML;
    this.registerListeners();
  }

  protected fireNoteOn = (note: string): void => {
    this.onKeyEmitter.emit("noteon", note);
  };
  protected fireNoteOff = (note: string): void => {
    this.onKeyEmitter.emit("noteoff", note);
  };

  protected registerListeners(): void {
    this.pianoObj.keyDown = (key: Element) => {
      const noteName = this.parseNoteNameFromKey(key);
      this.fireNoteOn(noteName);
    };
    this.pianoObj.keyUp = (key: Element) => {
      const noteName = this.parseNoteNameFromKey(key);
      this.fireNoteOff(noteName);
    };
  }

  protected parseNoteNameFromKey(key: Element): string {
    const noteName = this.pianoObj.keyNote(key).replace("-sh", "#");
    const keyOctave = this.pianoObj.keyOctave(key);
    return `${noteName.toUpperCase()}${keyOctave}`;
  }

//   handlePlayedNotesChanged(playedNotes: Set<string>): void {
//     playedNotes.forEach((note) => {
//       const noteSelector = this.noteToSelector(note);
//       const key = this.node.querySelector(noteSelector);
//       if (key) {
//         this.pianoObj.forceKeyDown(key);
//       }
//     });
//     this.previousNotes.forEach((note) => {
//       if (!playedNotes.has(note)) {
//         const noteSelector = this.noteToSelector(note);
//         const key = this.node.querySelector(noteSelector);
//         if (key) {
//           this.pianoObj.forceKeyUp(key);
//         }
//       }
//     });
//     this.previousNotes = new Set([...playedNotes]);
//   }

  protected noteToSelector(note: string): string {
    const noteName = note.toLowerCase().substring(0, note.length - 1);
    const octave = note.toLowerCase().substring(note.length - 1, note.length);
    const baseNote = noteName.charAt(0);
    let noteSelector = `piano-note-${baseNote}`;
    if (noteName.endsWith("#")) {
      noteSelector = `${noteSelector}-sh`;
    }
    const octaveSelector = `piano-octave-${octave}`;
    return `.${noteSelector}.${octaveSelector}`;
  }
}