import EventEmitter from "events";
import { WebMidi } from "webmidi";

class MidiHandler {
  protected midiAccess: MIDIAccess | undefined;
  readonly onNotePressedEmitter = new EventEmitter();

  initialize(): Promise<void> {
    if (!this.midiAccess) {
      WebMidi.enable()
        .then(() => this.onEnabled())
        .catch((err) => alert(err));
    }
    return Promise.resolve(undefined);
  }

  protected fireEvent = (note: string): void => {
    console.log("firing event");
    this.onNotePressedEmitter.emit("notepressed", note);
  };

  protected onEnabled(): void {
    WebMidi.inputs.forEach((input) => console.log(input.name));
    const myInput = WebMidi.getInputByName("Nord Stage 3 MIDI Output");
    console.log(myInput);
    myInput.addListener("noteon", (e) => {
      this.fireEvent(e.note.identifier);
    });
  }
}

export const midiHandler = new MidiHandler();
