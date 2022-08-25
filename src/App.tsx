import React from "react";
import "./app.css";
import { Fretboard } from "./components/fretboard/Fretboard";
import { fretboardArray } from "./constants";
import { midiHandler } from "./Midi";

interface IAppState {
  selectedFret: undefined | [number, number];
}
class App extends React.Component<{}, IAppState> {
  protected startingFretRef = React.createRef<HTMLInputElement>();
  protected endingFretRef = React.createRef<HTMLInputElement>();
  protected midiHandler = midiHandler;

  state: IAppState = {
    selectedFret: undefined,
  };

  protected handleStartGame = (): void => this.doHandleStartGame();
  protected doHandleStartGame(): void {
    const startingFret = this.startingFretRef.current?.value;
    const endingFret = this.endingFretRef.current?.value;
    if (startingFret !== undefined && endingFret !== undefined) {
      const selectedFret = this.pickRandomFret(
        parseInt(startingFret),
        parseInt(endingFret),
        fretboardArray.length
      );
      console.log(selectedFret);
      this.setState({ selectedFret });
    }
  }

  componentDidMount(): void {
    this.midiHandler.initialize()?.then(() => {
      console.log("ready");
      this.midiHandler.onNotePressedEmitter.on(
        "notepressed",
        (note: string) => {
          if (this.state.selectedFret) {
            const [fret, string] = this.state.selectedFret;
            const highlightedNote = fretboardArray[string][fret];
            console.log("converted note", note);
            if (note === highlightedNote) {
              this.handleStartGame();
            }
          }
          console.log("APP GOT", note);
        }
      );
    });
  }

  protected pickRandomFret(
    startingFret: number,
    endingFret: number,
    numStrings: number
  ): [number, number] {
    const fretRange = endingFret - startingFret;
    const randomFret = startingFret + Math.round(Math.random() * fretRange);
    const randomString = Math.floor(Math.random() * numStrings);
    return [randomFret, randomString];
  }

  render() {
    return (
      <div className="App">
        <div className="fretboard-container">
          <Fretboard
            selectedFret={this.state.selectedFret}
            markers={[3, 5, 7, 9, 12]}
            fretboard={fretboardArray}
          />
        </div>
        <div className="controls-container">
          <div>
            <div>
              <label htmlFor="starting-fret">Starting Fret</label>
              <input
                ref={this.startingFretRef}
                id="starting-fret"
                type="number"
              />
            </div>
            <div>
              <label htmlFor="ending-fret">Ending Fret</label>
              <input
                ref={this.endingFretRef}
                id="starting-fret"
                type="number"
              />
            </div>
            <button onClick={this.handleStartGame}>Start</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
