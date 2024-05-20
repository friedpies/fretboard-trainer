import React, { ReactNode, useCallback } from "react";
import { InstrumentDisplay, isPlayed, lookupTable } from "../../constants";
import "./fretboard.css";

export interface IFretboardProps extends InstrumentDisplay {
  fretboard: string[][];
  markers: number[];
  selectedFret: [number, number] | undefined;
  setPlayedNotes(notes: Set<string>): void;
}
export const Fretboard: React.FC<IFretboardProps> = ({
  fretboard,
  markers,
  selectedFret,
  playedNotes,
  setPlayedNotes,
}) => {
  const onFretClicked = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const noteId = e.currentTarget.getAttribute('data-id');
    console.log(noteId);
    if (noteId) {
      const note = lookupTable.get(noteId);
      console.log(note);
      if (note) {
        setPlayedNotes(new Set([note]));
      }
    }
  },[setPlayedNotes]);

  const onFretReleased = useCallback((e: React.MouseEvent<HTMLDivElement> | React.FocusEvent) => {
    setPlayedNotes(new Set([]));
  },[setPlayedNotes]) ;

  const generateRows = (): ReactNode => {
    const stringArray: ReactNode[] = [];
    for (let stringIndex = 0; stringIndex < fretboard.length; stringIndex++) {
      const fretArray: ReactNode[] = [];
      const string = fretboard[stringIndex];
      for (let fretIndex = 0; fretIndex < string.length; fretIndex++) {
        const fret = string[fretIndex];
        const isSelected =
          fretIndex === selectedFret?.[0] && stringIndex === selectedFret[1];
        fretArray.push(
          <div
            className={`fret ${fretIndex === 0 ? "open-string" : ""}${
              isSelected ? " selected" : ""
            }${isPlayed(stringIndex, fretIndex, playedNotes) ? " played" : ""}`}
            key={`${stringIndex}::${fretIndex}`}
            data-id={`${stringIndex}::${fretIndex}`}
            data-string={string}
            data-fret={fret}
            onMouseDown={onFretClicked}
            onMouseUp={onFretReleased}
            onBlur={onFretReleased}
          >
            <div className="string-line" />
            <span>
              {fret}
              {stringIndex === fretboard.length - 1 &&
                markers.includes(fretIndex) && (
                  <div className="marker">{fretIndex === 12 ? "o o" : "o"}</div>
                )}
            </span>
          </div>
        );
      }
      stringArray.push(
        <div className="string" key={stringIndex}>
          {fretArray}
        </div>
      );
    }
    return <div className="fretboard-grid">{stringArray}</div>;
  };

  return <div>{generateRows()}</div>;
};
