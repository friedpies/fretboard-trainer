import React from "react";
import "./app.css";
import { Fretboard } from "./components/fretboard/Fretboard";
import { fretboardArray } from "./constants";

class App extends React.Component {
  protected startingFretRef = React.createRef<HTMLInputElement>();
  protected endingFretRef = React.createRef<HTMLInputElement>();

  protected handleStartGame = ():void => this.doHandleStartGame();
  protected doHandleStartGame(): void {
    const startingFret = this.startingFretRef.current?.value;
    const endingFret = this.endingFretRef.current?.value;
    if (startingFret !== undefined && endingFret !== undefined) {
      const [randomFret, randomString] = this.pickRandomFret(
        parseInt(startingFret),
        parseInt(endingFret),
        fretboardArray.length
      );
      console.log(randomFret, randomString);
    }
  }

  protected pickRandomFret(
    startingFret: number,
    endingFret: number,
    numStrings: number
  ): [number, number] {
    const fretRange = endingFret - startingFret;
    const randomFret = startingFret + Math.round(Math.random() * fretRange);
    const randomString = Math.ceil(Math.random() * numStrings);
    return [randomFret, randomString];
  }

  render() {
    return (
      <div className="App">
        <div className="fretboard-container">
          <Fretboard markers={[3, 5, 7, 9, 12]} fretboard={fretboardArray} />
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
