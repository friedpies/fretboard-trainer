import "../../../node_modules/html-piano/piano/dist/piano.css";
import * as React from "react";
import "./piano.css";
import { InstrumentDisplay } from "../../constants";
import { PianoModel } from "./PianoModel";

export interface IPianoProps extends InstrumentDisplay {
  pianoModel: PianoModel;
}

export const Piano: React.FC<IPianoProps> = ({ pianoModel }) => {
  const pianoContainerRef = React.useRef<HTMLDivElement>(null);

  //   React.useEffect(() => {
  //     pianoModel.handlePlayedNotesChanged(playedNotes);
  //   }, [playedNotes]);

  React.useEffect(() => {
    if (pianoContainerRef.current) {
      pianoContainerRef.current.appendChild(pianoModel.node);
    }
  }, [pianoModel]);

  return <div ref={pianoContainerRef} />;
};
