import EventEmitter from "events";
// @ts-ignore-next-line
import { Input, WebMidi, Listener } from "webmidi";
import { PitchDetector as Pitchy } from "pitchy";
import { IController } from "../../constants";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A4_FREQ = 440; // Frequency of note A4
// const TWELFTH_ROOT_OF_TWO = Math.pow(2, 1 / 12);

function frequencyToNote(frequency: number): string {
  // Calculate how many half-steps away the frequency is from A4
  const halfStepsFromA4 = Math.round(12 * Math.log2(frequency / A4_FREQ));

  // Calculate the absolute note number where 0 is A0
  const absoluteNoteNumber = 57 + halfStepsFromA4;

  // Convert absolute note number to note and octave
  const note = NOTES[absoluteNoteNumber % 12];
  const octave = Math.floor(absoluteNoteNumber / 12);

  return note + octave.toString();
}

export class PitchDetector implements IController {
  protected midiAccess: MIDIAccess | undefined;
  readonly onKeyEmitter = new EventEmitter();
  readonly onMidiEventEmitter = new EventEmitter();
  protected previouslySelectedInput: Input | undefined = undefined;
  protected noteOnListener: Listener | undefined;
  protected noteOffListener: Listener | undefined;
  protected audioContext: AudioContext | undefined;

  protected onNotes = new Set<string>();

  async initialize(): Promise<void> {
    this.audioContext = new window.AudioContext();
    const analayzerNode = this.audioContext.createAnalyser();

    // Need a button click
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.audioContext.createMediaStreamSource(userMedia).connect(analayzerNode);
    const detector = Pitchy.forFloat32Array(analayzerNode.fftSize);
    const input = new Float32Array(detector.inputLength);
    this.updatePitch(
      analayzerNode,
      detector,
      input,
      this.audioContext.sampleRate
    );
    return Promise.resolve(undefined);
  }

  resumeAudioContext(): void {
    console.log("do we have audio context", this.audioContext);
    this.audioContext?.resume();
  }

  protected updatePitch(
    analyserNode: AnalyserNode,
    detector: Pitchy<Float32Array>,
    input: Float32Array,
    sampleRate: number
  ) {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    const roundedPitch = Math.round(pitch * 10) / 10;
    const clarityPercent = Math.round(clarity * 100);
    console.log(clarityPercent);
    if (clarityPercent > 85) {
      const noteName = frequencyToNote(roundedPitch);
      console.log("Note", noteName);
      this.fireNoteOn(noteName);
    } else {
      this.turnOffNotes();
    }
    // console.log("Pitch", `${Math.round(pitch * 10) / 10} Hz`);

    window.setTimeout(
      () => this.updatePitch(analyserNode, detector, input, sampleRate),
      100
    );
  }

  protected fireNoteOn = (note: string): void => {
    this.onNotes.add(note);
    this.onKeyEmitter.emit("noteon", note);
  };

  protected turnOffNotes = () => {
    Array.from(this.onNotes).forEach(note => {
      this.fireNoteOff(note);
    })
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
    WebMidi.addListener("portschanged", () => {
      this.refreshInputs();
    });
    this.refreshInputs();
  }
}

export const pitchDetector = new PitchDetector();
