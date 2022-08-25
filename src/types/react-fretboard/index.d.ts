
declare module "react-fretboard" {
  export interface LocShape {
    str: number;
    pos: number;
  }

  export interface LocSelectionShape {
    loc: LocShape;
    status: string;
    label: string;
  }
  export interface NoteSelectionShape {
    note: string;
    status: string;
    label: string;
  }

  export interface FretboardProps {
    skinType: string;
    noteType: string;
    showNotes: boolean;
    showSelectionLabels: boolean;
    highlightOctaves: boolean;
    highlightSelections: boolean;
    showEnharmonics: boolean;
    selectedNotes: noteSelectionShape[];
    selectedLocations: LocSelectionShape[];
    clickAction: (...args: any) => any;
  }
  export default Fretboard = React.FC<FretboardProps>;
}
