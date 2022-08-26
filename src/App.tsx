import React from "react";
import { Input } from "webmidi";
import "./app.css";
import { Fretboard } from "./components/fretboard/Fretboard";
import { Piano } from "./components/piano/Piano";
import { fretboardArray } from "./constants";
import { midiHandler } from "./Midi";

interface IAppState {
  selectedFret: undefined | [number, number];
  playedNotes: Set<string>;
  inputs: Input[];
}
class App extends React.Component<{}, IAppState> {
  protected startingFretRef = React.createRef<HTMLInputElement>();
  protected endingFretRef = React.createRef<HTMLInputElement>();
  protected midiInputRef = React.createRef<HTMLSelectElement>();
  protected midiHandler = midiHandler;

  state: IAppState = {
    selectedFret: undefined,
    playedNotes: new Set(),
    inputs: [],
  };

  protected generateNewFret = (): void => this.doHandleStartGame();
  protected doHandleStartGame(): void {
    const startingFret = this.startingFretRef.current?.value;
    const endingFret = this.endingFretRef.current?.value;
    if (startingFret !== undefined && endingFret !== undefined) {
      const selectedFret = this.pickRandomFret(
        parseInt(startingFret),
        parseInt(endingFret),
        fretboardArray.length
      );
      this.setState({ selectedFret });
    }
  }

  componentDidMount(): void {
    this.midiHandler.initialize()?.then(() => {
      this.registerListeners();
    });
  }

  protected registerListeners(): void {
    this.midiHandler.onNoteOnEmitter.on("noteon", (note: string) => {
      const playedNotes = new Set([...this.state.playedNotes, note]);
      this.setState({ playedNotes });
      if (this.state.selectedFret) {
        const [fret, string] = this.state.selectedFret;
        const highlightedNote = fretboardArray[string][fret];
        if (note === highlightedNote) {
          this.generateNewFret();
        }
      }
    });
    this.midiHandler.onNoteOffEmitter.on("noteoff", (note: string) => {
      const playedNotes = this.state.playedNotes;
      playedNotes.delete(note);
      this.setState({ playedNotes: new Set([...playedNotes]) });
    });
    this.midiHandler.onInputsReceived.on(
      "inputs-received",
      (inputs: Input[]) => {
        this.setState({ inputs });
      }
    );
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

  protected handleMidiInputChanged = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => this.doHandleMidiInputChanged(e);
  protected doHandleMidiInputChanged(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    const selectedInputName = this.midiInputRef.current?.value;
    if (selectedInputName) {
      this.midiHandler.onInputSelect(selectedInputName);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="instrument-container">
          <Fretboard
            selectedFret={this.state.selectedFret}
            markers={[3, 5, 7, 9, 12]}
            fretboard={fretboardArray}
            playedNotes={this.state.playedNotes}
          />
        </div>
        <div className="piano-container">
          <Piano playedNotes={this.state.playedNotes} />
        </div>
        <div className="controls-container">
          <div className="game-controls">
            <div>
              <label htmlFor="starting-fret">Starting Fret</label>
              <input
                ref={this.startingFretRef}
                id="starting-fret"
                type="number"
                defaultValue={0}
              />
            </div>
            <div>
              <label htmlFor="ending-fret">Ending Fret</label>
              <input
                ref={this.endingFretRef}
                id="starting-fret"
                type="number"
                defaultValue={12}
              />
            </div>
            <button onClick={this.generateNewFret}>Start</button>
          </div>
          <div className="midi-controls">
            <label htmlFor="inputs">Available MIDI Inputs</label>
            <select id="inputs" ref={this.midiInputRef}>
              {this.state.inputs.map((input) => (
                <option key={input.name}>{input.name}</option>
              ))}
            </select>
            <button onClick={this.handleMidiInputChanged}>
              Select MIDI Input
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
