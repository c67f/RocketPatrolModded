/*Cal Friedman
  Rocket Patrol: Advanced
  Maybe 6-10 hours?
  Mods:
  5 - Time adding and subtracting on hit and miss

  5 - Additional small fast spaceship

  3 - Display time left (Implementation: required new system for keeping track of time, replacing the delayed call used for game over - timer variable that is set by recording game time at last frame and comparing it to game time this frame to get how much time has passed between frames)

  1 - Speed up after halfway done (Implementation: uses timer implemented in previous mod to check if half of the time has gone by)

  5 - Particle explosion

  1 - High Score

  https://stackoverflow.com/questions/661562/how-to-format-a-float-in-javascript
*/

let config = {
    type:Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config)
//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize /3

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT