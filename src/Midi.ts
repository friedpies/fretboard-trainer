import EventEmitter from "events";
import { WebMidi } from "webmidi";

class MidiHandler {
  protected midiAccess: MIDIAccess | undefined;
  readonly onNoteOnEmitter = new EventEmitter();
  readonly onNoteOffEmitter = new EventEmitter();

  initialize(): Promise<void> {
    if (!this.midiAccess) {
      WebMidi.enable()
        .then(() => this.onEnabled())
        .catch((err) => alert(err));
    }
    return Promise.resolve(undefined);
  }

  protected fireNoteOn = (note: string): void => {
    this.onNoteOnEmitter.emit("noteon", note);
  };
  protected fireNoteOff = (note: string): void => {
    this.onNoteOffEmitter.emit("noteoff", note);
  };

  protected onEnabled(): void {
    WebMidi.inputs.forEach((input) => console.log(input.name));
    const myInput = WebMidi.getInputByName("Nord Stage 3 MIDI Output");
    console.log(myInput);
    myInput.addListener("noteon", (e) => {
      this.fireNoteOn(e.note.identifier);
    });
    myInput.addListener("noteoff", (e) => {
      this.fireNoteOff(e.note.identifier);
    });
  }
}

export const midiHandler = new MidiHandler();
