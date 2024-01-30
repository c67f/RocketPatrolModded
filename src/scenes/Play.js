class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }
    
    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0)
        //add fast spaceship
        this.fastShip = new FastSpaceship(this, game.config.width + borderUISize*9, borderUISize*4, 'fastSpaceship', 0, 90).setOrigin(0,0)  //Mod 2: fast spaceship
        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        //initialize score
        this.p1Score = 0
        //initialize high score (Mod 6)
        if (this.p1HighScore == null){
           this.p1HighScore = 0
        }
        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        this.highScore = this.add.text(game.config.width/2, borderUISize + borderPadding*2, this.p1HighScore, scoreConfig) //Mod 6: Persistent High Score
        //GAME OVER flag
        this.gameOver = false


        //play clock
        game.timer = game.settings.gameTimer; 
        console.log(game.timer)

        this.firstFrame = true
        //Mod 4: speed up after halfway done
        /*this.clock = this.time.delayedCall(game.settings.gameTimer/2, () => {
            this.ship01.moveSpeed *= 2
            this.ship02.moveSpeed *= 2
            this.ship03.moveSpeed *= 2
            this.fastShip.moveSpeed *= 2
        })*/
        this.spedUp = false
        
        //console.log(game.settings.gameTimer)
    }

    update() {
        //console.log(this.timer)
        if (this.firstFrame == true){  //Mod 1: hits and misses affect timer
            console.log('first frame')
            this.previousTime = game.getTime()
            this.firstFrame = false
        } 
        if (this.spedUp == false && game.timer <= game.settings.gameTimer/2){
            this.ship01.moveSpeed *= 2
            this.ship02.moveSpeed *= 2
            this.ship03.moveSpeed *= 2
            this.fastShip.moveSpeed *= 2
            this.spedUp = true
        }
        //console.log(this.previousTime)
        this.deltaTime = game.getTime() - this.previousTime
        //console.log(this.deltaTime)
        game.timer = (game.timer - this.deltaTime)
        
        if (game.timer <= 0) {
            let gameOverConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 0
            }
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', gameOverConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2+64, 'Press (R) to Restart or <- for Menu').setOrigin(0.5)
            this.gameOver = true
        }
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 75
        }
        
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            //this.timer = game.settings.gameTimer
            //this.previousTime = 0
            //console.log(this.timer)
            //this.lastHighScore = this.highScore
            this.scene.restart()
            //this.highScore = this.lastHighScore
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        this.starfield.tilePositionX -= 2
        if(!this.gameOver){
            this.p1Rocket.update()  //update rocket sprite
            this.ship01.update()    //update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.fastShip.update() //update fast ship
            this.timeRight = this.add.text(game.config.width - 3*(borderUISize + borderPadding), borderUISize + borderPadding*2, (game.timer/1000).toFixed(1), timeConfig) //Mod 3: visible timer
        }
        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            //this.ship03.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            //this.ship02.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            //this.ship01.reset()
            this.shipExplode(this.ship01)
        }
        //collision for fast spaceship
        if (this.checkCollision(this.p1Rocket, this.fastShip)) {
            this.p1Rocket.reset()
            //this.fastShip.reset()
            this.fastShipExplode(this.fastShip)
        }

        if (game.timer != game.settings.gameTimer){
            this.previousTime = game.getTime()
            //console.log(game.getTime())
        }
    }


    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0
        let particles = this.add.particles(ship.x, ship.y, 'particle', { //Mod 5: Particle explosion on hit
            //accelerationX: Phaser.Math.Between(-2, 0),
            //accelerationY: Phaser.Math.Between(-1, 0),
            angle:  { min: 0, max: 180},
            speed: Phaser.Math.Between(100, 300),
            quantity: Phaser.Math.Between(3, 6),
            lifespan: 500,
            stopAfter: 6,
        })
        this.time.delayedCall(1000, () => {
            particles.destroy()
        }, null, this)
        //particles.on('start', function(particles) {

        //})
        //create explosion at ships position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')             //play explode animation
        boom.on('animationcomplete', () => {   //callback after anim completes
            
            ship.reset()                       //reset ship position
            ship.alpha = 1                     //make ship visible again
            boom.destroy()                     //remove explosion sprite
        })
        //score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        //update high score if current score greater then high score (mod 6)
        if (this.p1Score > this.p1HighScore) {
            this.p1HighScore = this.p1Score
        }
        this.highScore.text = this.p1HighScore

        this.sound.play('sfx-explosion')
        //console.log(game.timer)
        game.timer += (ship.points)*100
        //console.log(game.timer)
        
    }

    fastShipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0

        //create explosion at ships position
        let boom = this.add.sprite(ship.x, ship.y, 'smallExplosion').setOrigin(0, 0)
        boom.anims.play('smallExplode')             //play explode animation
        boom.on('animationcomplete', () => {   //callback after anim completes
            ship.reset()                       //reset ship position
            ship.alpha = 1                     //make ship visible again
            boom.destroy()                     //remove explosion sprite
        })
        //score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        //update high score if current score greater then high score (mod 6)
        if (this.p1Score > this.p1HighScore) {
            this.p1HighScore = this.p1Score
        }
        this.highScore.text = this.p1HighScore

        this.sound.play('sfx-explosion')
        //console.log(game.timer)
        game.timer += (ship.points)*100
        //console.log(game.timer)
    }
}