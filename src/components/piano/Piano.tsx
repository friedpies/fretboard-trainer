import "../../../node_modules/html-piano/piano/dist/piano.css";
import * as React from "react";
import "./piano.css";
import { InstrumentDisplay } from "../../constants";
const htmlPiano = require("html-piano")(window);

export interface IPianoProps extends InstrumentDisplay {}

const noteToSelector = (note: string): string => {
  const noteName = note.toLowerCase().substring(0, note.length - 1);
  const octave = note.toLowerCase().substring(note.length - 1, note.length);
  const baseNote = noteName.charAt(0);
  let noteSelector = `piano-note-${baseNote}`;
  if (noteName.endsWith("#")) {
    noteSelector = `${noteSelector}-sh`;
  }
  const octaveSelector = `piano-octave-${octave}`;
  return `.${noteSelector}.${octaveSelector}`;
};

export const Piano: React.FC<IPianoProps> = ({ playedNotes }) => {
  const pianoContainerRef = React.useRef<HTMLDivElement>(null);
  const [pianoObj, setPianoObj] = React.useState<any>();
  const [previousNotes, setPreviousNotes] = React.useState(new Set<string>());

  React.useEffect(() => {
    playedNotes.forEach((note) => {
      const noteSelector = noteToSelector(note);
      const key = pianoContainerRef.current?.querySelector(noteSelector);
      pianoObj.forceKeyDown(key);
    });
    previousNotes.forEach((note) => {
      if (!playedNotes.has(note)) {
        const noteSelector = noteToSelector(note);
        const key = pianoContainerRef.current?.querySelector(noteSelector);
        pianoObj.forceKeyUp(key);
      }
    });
    setPreviousNotes(new Set([...playedNotes]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playedNotes, pianoObj]);

  React.useEffect(() => {
    if (pianoContainerRef.current) {
      const newPiano = htmlPiano.newPiano(
        { note: "e", octave: 2 },
        { note: "e", octave: 5 }
      );
      pianoContainerRef.current.appendChild(newPiano.HTML);
      setPianoObj(newPiano);
    }
  }, []);

  return <div ref={pianoContainerRef} />;
};
