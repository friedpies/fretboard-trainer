import EventEmitter from "events";
// @ts-ignore-next-line
import { Input, WebMidi, Listener } from "webmidi";
import { IController } from "./constants";

class MidiHandler implements IController {
  protected midiAccess: MIDIAccess | undefined;
  readonly onKeyEmitter = new EventEmitter();
  readonly onMidiEventEmitter = new EventEmitter();
  protected previouslySelectedInput: Input | undefined = undefined;
  protected noteOnListener: Listener | undefined;
  protected noteOffListener: Listener | undefined;

  initialize(): Promise<void> {
    if (!this.midiAccess) {
      WebMidi.enable()
        .then(() => this.onEnabled())
        .catch((err) => alert(err));
    }
    return Promise.resolve(undefined);
  }

  protected fireNoteOn = (note: string): void => {
    this.onKeyEmitter.emit("noteon", note);
  };
  protected fireNoteOff = (note: string): void => {
    this.onKeyEmitter.emit("noteoff", note);
  };

  protected fireInputsReceived = (inputs: Input[]) => {
    this.onMidiEventEmitter.emit("inputs-received", inputs);
  };

  protected refreshInputs(): void {
    this.fireInputsReceived(WebMidi.inputs);
    if (WebMidi.inputs.length === 1) {
      this.onInputSelect(WebMidi.inputs[0].name);
    }
  }

  onInputSelect(inputName: string): void {
    this.previouslySelectedInput?.removeListener(this.noteOffListener);
    this.previouslySelectedInput?.removeListener(this.noteOnListener);
    const selectedInput = WebMidi.getInputByName(inputName);
    if (selectedInput) {
      this.noteOnListener = selectedInput.addListener("noteon", (e) => {
        this.fireNoteOn(e.note.identifier);
      });
      this.noteOffListener = selectedInput.addListener("noteoff", (e) => {
        this.fireNoteOff(e.note.identifier);
      });
      this.previouslySelectedInput = selectedInput;
    }
  }

  protected onEnabled(): void {
    this.refreshInputs();
  }
}

export const midiHandler = new MidiHandler();
