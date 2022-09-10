# Fretboard Trainer

The purpose of this web app is to attempt to close the mental gap between a piano keyboard and a guitar fretboard. This app will randomly select a guitar note and the goal is to play the note back on the keyboard (in the correct octave). When the right note is played, another random fret will be generated.

https://user-images.githubusercontent.com/9576306/189499027-29875478-d765-4cb1-8f82-f23bec2302db.mov


# Why I made this

As both a piano and guitar player, I've realized that I have completely different mental models of the two instruments. A piano keyboard is laid out linearly and there is a direct mapping of a single note to a single key. But on the guitar a single note may exist in several locations on the fretboard. This can make it pretty difficult to master the fretboard and transition between different positions on the guitar while mentally keeping track of what notes are being played. Many guitar players rely on shapes (e.g. the CAGED system) to navigate the fretboard and tend not to think about **note names** directly, but rather **functional harmony (scale degrees, etc.)**.

There are several fretboard training tools on the web, but none that I've found that map the fretboard to the *piano keyboard*. Instead many require you to select the note names from a list/grid via a mouse click. As a player of both instruments I hope that this app will start to merge two mental models of the instruments, eventually removing the need for an intermediate **note translation** and moving more to a direct visual mapping.

# How to Use

Visit the deployed version [here](https://friedpies.github.io/fretboard-trainer/)

- If you have a MIDI keyboard plugged in, select it from the dropdown (you can also use the keyboard display if you don't have a MIDI keyboard)
- Set the fret range (defaults 0-12) and hit "start/reset"
- A random fret note will be generated, try to match it on the keyboard

If that doesn't work for some reason, built it yourself using the instructions below :)

This app was built with Create React App and is pretty easy to get up and running. If you use `yarn`, then `yarn && yarn start` should be enough to get going. For npm, likely `npm install && npm start` should work (though I haven't tested).

MIDI inputs will be listed in a select menu on start, changing the select value should reset the MIDI connection to your desired controller. Clicking "Start" will get you started!



