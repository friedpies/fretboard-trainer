import "../../../node_modules/html-piano/piano/dist/piano.css";
import * as React from "react";
const htmlPiano = require("html-piano")(window);

export const Piano: React.FC = () => {
  const pianoContainerRef = React.useRef<HTMLDivElement>(null);

//   React.useEffect(() => {
//       if (pianoContainerRef.current) {
//         const newPiano = htmlPiano.newPiano(
//           { note: "c", octave: 2 },
//           { note: "c", octave: 4 }
//         );
//         console.log(newPiano);
//       pianoContainerRef.current.appendChild(newPiano.html);
//     }
//   }, [pianoContainerRef]);

  return <div ref={pianoContainerRef} />;
};
