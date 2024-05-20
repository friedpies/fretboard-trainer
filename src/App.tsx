import React from "react";
import { Input } from "webmidi";
import "./app.css";
import { Fretboard } from "./components/fretboard/Fretboard";
import { Piano } from "./components/piano/Piano";
import { PianoModel } from "./components/piano/PianoModel";
import { ScoreKeeper } from "./components/scorekeeper/ScoreKeeper";
import { fretboardArray } from "./constants";
import { midiHandler } from "./Midi";
import { pitchDetector } from "./components/pitch-detector/PitchDetector";
import { PitchCard } from "./components/pitch-detector/PitchCard";

interface IAppState {
  selectedFret: undefined | [number, number];
  playedNotes: Set<string>;
  inputs: Input[];
  numSuccess: number;
  numFail: number;
  noteMode: "Single" | "Multi";
}
class App extends React.Component<{}, IAppState> {
  protected startingFretRef = React.createRef<HTMLInputElement>();
  protected endingFretRef = React.createRef<HTMLInputElement>();
  protected midiInputRef = React.createRef<HTMLSelectElement>();
  protected midiHandler = midiHandler;
  protected pitchDetector = pitchDetector;
  protected pianoModel = new PianoModel();

  state: IAppState = {
    selectedFret: undefined,
    playedNotes: new Set(),
    inputs: [],
    numSuccess: 0,
    numFail: 0,
    noteMode: "Single",
  };

  protected generateNewFret = (e?: React.MouseEvent<HTMLButtonElement>): void =>
    this.doHandleStartGame(e);
  protected doHandleStartGame(e?: React.MouseEvent<HTMLButtonElement>): void {
    const startingFret = this.startingFretRef.current?.value;
    const endingFret = this.endingFretRef.current?.value;
    if (startingFret !== undefined && endingFret !== undefined) {
      const selectedFret = this.pickRandomFret(
        parseInt(startingFret),
        parseInt(endingFret),
        fretboardArray.length
      );
      this.setState({ selectedFret });
      if (e && e.currentTarget.getAttribute("data-id") === "reset-button") {
        this.setState({ numFail: 0, numSuccess: 0 });
      }
    }
  }

  componentDidMount(): void {
    Promise.all([
      this.midiHandler.initialize(),
      this.pitchDetector.initialize(),
    ]).then(() => this.registerListeners());
  }

  protected registerListeners(): void {
    const onNoteOn = (note: string) => {
      const playedNotes = new Set(
        this.state.noteMode === "Multi"
          ? [...this.state.playedNotes, note]
          : [note]
      );
      this.setState({ playedNotes });

      if (this.state.selectedFret) {
        const [fret, string] = this.state.selectedFret;
        const highlightedNote = fretboardArray[string][fret];
        if (note === highlightedNote) {
          this.setState({ numSuccess: this.state.numSuccess + 1 });
          this.generateNewFret();
        } else {
          this.setState({ numFail: this.state.numFail + 1 });
        }
      }
    };
    const onNoteOff = (note: string) => {
      if (this.state.noteMode === "Multi") {
        const playedNotes = this.state.playedNotes;
        playedNotes.delete(note);
        this.setState({ playedNotes: new Set([...playedNotes]) });
      } else {
        this.setState({ playedNotes: new Set() });
      }
    };

    this.midiHandler.onKeyEmitter.on("noteon", onNoteOn);
    this.midiHandler.onKeyEmitter.on("noteoff", onNoteOff);
    this.midiHandler.onMidiEventEmitter.on(
      "inputs-received",
      (inputs: Input[]) => {
        this.setState({ inputs });
      }
    );

    this.pianoModel.onKeyEmitter.on("noteon", onNoteOn);
    this.pianoModel.onKeyEmitter.on("noteoff", onNoteOff);

    this.pitchDetector.onKeyEmitter.on("noteon", onNoteOn);
    this.pitchDetector.onKeyEmitter.on("noteoff", onNoteOff);
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

  protected handleNoteModeChanged = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = e.currentTarget.value;
    if (value === "Single" || value === "Multi") {
      this.setState({ noteMode: value });
    }
  };

  protected setPlayedNotes = (playedNotes: Set<string>) => {
    console.log('notes', Array.from(playedNotes))
    this.setState({playedNotes: playedNotes});
  }

  render() {
    return (
      <div className="App">
        <div className="instrument-container">
          <Fretboard
            selectedFret={this.state.selectedFret}
            setPlayedNotes={this.setPlayedNotes}
            markers={[3, 5, 7, 9, 12]}
            fretboard={fretboardArray}
            playedNotes={this.state.playedNotes}
          />
        </div>
        <div className="piano-container">
          <Piano
            playedNotes={this.state.playedNotes}
            pianoModel={this.pianoModel}
          />
        </div>
        <ScoreKeeper
          numSuccess={this.state.numSuccess}
          numFail={this.state.numFail}
        />
        <div className="controls-container">
          <div className="game-controls card-wrapper">
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
            <button data-id="reset-button" onClick={this.generateNewFret}>
              Start/Reset
            </button>
          </div>
          <div className="midi-controls card-wrapper">
            <label htmlFor="inputs">Available MIDI Inputs</label>
            <select id="inputs" ref={this.midiInputRef}>
              {this.state.inputs.map((input) => (
                <option key={input.name}>{input.name}</option>
              ))}
            </select>
            <button onClick={this.handleMidiInputChanged}>
              Select MIDI Input
            </button>
            <br />
            <label htmlFor="node-mode">Note Mode</label>
            <select
              id="note-mode"
              onChange={this.handleNoteModeChanged}
              value={this.state.noteMode}
            >
              <option key="multi">Multi</option>
              <option key="single">Single</option>
            </select>
          </div>
        </div>
        <PitchCard pitchDetector={this.pitchDetector} />
        <footer>
          <a href="https://github.com/friedpies/fretboard-trainer">repo</a>
        </footer>
      </div>
    );
  }
}

export default App;
