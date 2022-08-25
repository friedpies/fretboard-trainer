import { ReactNode } from "react";
import "./fretboard.css";

export interface IFretboardProps {
  fretboard: string[][];
  markers: number[];
  selectedFret: [number, number] | undefined;
}
export const Fretboard: React.FC<IFretboardProps> = ({
  fretboard,
  markers,
  selectedFret,
}) => {
  const generateRows = (): ReactNode => {
    const stringArray: ReactNode[] = [];
    for (let stringIndex = 0; stringIndex < fretboard.length; stringIndex++) {
      const fretArray: ReactNode[] = [];
      const string = fretboard[stringIndex];
      for (let fretIndex = 0; fretIndex < string.length; fretIndex++) {
        const fret = string[fretIndex];
        const isSelected = fretIndex === selectedFret?.[0] && stringIndex === selectedFret[1];
        fretArray.push(
          <span
            className={`fret ${fretIndex === 0 ? "open-string" : ""}${
              isSelected ? " selected" : ""
            }`}
            key={`${stringIndex}::${fret}`}
            data-string={string}
            data-fret={fret}
          >
            {fret}
            {stringIndex === fretboard.length - 1 &&
              markers.includes(fretIndex) && (
                <div className="marker">{fretIndex === 12 ? "o o" : "o"}</div>
              )}
          </span>
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
