# Fretboard Trainer

The purpose of this web app is to attempt to close the metnal gap between a piano keyboard and a guitar fretboard. This app will randomly select a guitar note and the goal is to play the note back on the keyboard (in the correct octave). When the right note is played, another random fret will be generated.

<img width="875" alt="Screen Shot 2022-08-28 at 1 00 22 AM" src="https://user-images.githubusercontent.com/9576306/187060042-d995e859-5ed6-444b-b057-b6d98746ea9b.png">

# Why I made this

As both a piano and guitar player, I've realized that I have completely different mental models of the two instruments. A piano keyboard is laid out linearly and there is a direct mapping of a single note to a single key. But on the guitar a single note may exist in several locations on the fretboard. This can make it pretty difficult to master the fretboard and transition between different positions on the guitar while mentally keeping track of what notes you're playing. Many guitar players rely on "shapes" (e.g. the CAGED system) to get by and tend not to think about **note names** directly, but rather **functional harmony (scale degrees, etc.)**.

There are several fretboard training tools on the web, but none that I've found that map the fretboard to the *piano keyboard*. Instead many require you to select the note names from a list/grid via a mouse click. As a player of both instruments I hope that this app will start to merge two mental models of the instruments, eventually removing the need for an intermediate **note translation** and moving more to a direct visual mapping.

# How to Use

This app was built with Create React App and is pretty easy to get up and running. If you use `yarn`, then `yarn && yarn start` should be enough to get going. For npm, likely `npm install && npm start` should work (though I haven't tested).

MIDI inputs will be listed in a select menu on start, changing the select value should reset the MIDI connection to your desired controller. Clicking "Start" will get you started! **this currently is not set up, but will be shortly**
