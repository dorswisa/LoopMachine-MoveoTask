# Machine Loop - Moveo Task 
***

## Intro:
Create a page with 8 rows, each row is a channel which should represent
an audio loop. (use unique color for each row)
- For each channel add a mute button (toggle on/off)
- Add section to the bottom of the page with the following buttons :
- Play button - should start playing all channels simultaneously (which
  isn’t muted)
- Stop button - should stop all playing channels and go back to start.
- Loop button (toggle on/off) - when active, each time the loop ends
  you should immediately go back to start and play again (loop).
  *make sure to detect toggle changes while playing
* don’t use native audio elements for UI (you can use it behind).
* make sure nothing can break the sync between all channels
* avoid any delay each time a loop is finished and starts over again.

- Add cursor on top of all channels (1px width from top to bottom) to show
  your current playing position in real time (while playing).

Bonus :
Add drag and drop abilities to the cursor ! (moving the playback to the
dropped position)
***

## Installation:
### Install Project

1. Install packages:

    <code>npm install</code>

2. Run app on port 3000

   <code>npm start</code> or <code>node app</code>
