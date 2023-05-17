// import ENUMS from "../utils.js";
import {
  PLAYER_MOVEMENTS,
  SHAPE_DELAY,
  SHAPES,
  TRIANGULO,
  ROMBO,
  CUADRADO,
  POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START
} from "../../utils.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.shapesRecolected = {
      ["Triangulo"]: { count: 0, puntos: 10 },
      ["Cuadrado"]: { count: 0, puntos: 20 },
      ["Rombo"]: { count: 0, puntos: 30 },
      

    };

    this.isWinner = false;
    this.isGameOver = false;
    this.leftTime = 30;
    this.score = 0
  }

  preload() {
    // cargar fondo, plataformas, formas, jugador
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("player", "./assets/images/Ninja.png");
    this.load.image(TRIANGULO, "./assets/images/Triangulo.png");
    this.load.image(ROMBO, "./assets/images/Rombo.png");
    this.load.image(CUADRADO, "./assets/images/Cuadrado.png");
  }

  create() {
    // create game objects
    // add sky background
    this.add.image(400, 300, "sky").setScale(0.555);

    // agregado con fisicas
    // add sprite player
    this.player = this.physics.add.sprite(400, 500, "player");

    // add platforms static group
    this.platformsGroup = this.physics.add.staticGroup();
    this.platformsGroup.create(400, 568, "platform").setScale(2).refreshBody();

    this.platformsGroup.create(50, 368, "platform").setScale(1).refreshBody();
    this.platformsGroup.create(800, 368, "platform").setScale(1).refreshBody()

    // add shapes group
    this.shapesGroup = this.physics.add.group();

    // add collider between player and platforms
    this.physics.add.collider(this.player, this.platformsGroup);

    // add collider between platforms and shapes
    this.physics.add.collider(this.shapesGroup, this.platformsGroup);

    // add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape, // funcion que llama cuando player choca con shape
      null, //dejar fijo por ahora
      this //dejar fijo por ahora

    );
    this.physics.add.overlap(
      this.shapesGroup,
      this.platformsGroup,
      this.reduce, // funcion que llama cuando player choca con shape
      null, //dejar fijo por ahora
      this //dejar fijo por ahora

    );
    

    // create cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // create event to add shapes
    this.time.addEvent({
      delay: SHAPE_DELAY,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    //add text score
    this.scoreText = this.add.text(16, 16, "Score: ", {
      fontSize: "20px",
      fill: "#1af",
    });

    //add text time
    this.timeText = this.add.text(16, 40, "Time: " + this.leftTime, {
      fontSize: "20px",
      fill: "#1af",
    });

    // create event timer
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    });
    
  }

  update() {
    // check if game over or win
    if (this.isWinner) {
      this.scene.start("winner");
    }

    if (this.isGameOver) {
      this.scene.start("gameOver");
    }

    // update game objects

    // update player left right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_MOVEMENTS.x);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_MOVEMENTS.x);
    } else {
      this.player.setVelocityX(0);
    }

    // update player jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-PLAYER_MOVEMENTS.y);
    }
  }

  collectShape(jugador, figuraChocada) {
    // remove shape from screen
    const shapeName = figuraChocada.texture.key;
    const percentage = figuraChocada.getData(POINTS_PERCENTAGE);
    const scoreNow = this.shapesRecolected[shapeName].puntos*percentage;
    this.score+=scoreNow;
    figuraChocada.disableBody(true, true);
    this.shapesRecolected[shapeName].count ++ ;
    // update score text
    this.scoreText.setText(
     "Score: " + this.score
    );
    if (
  this.score >= 100
    ) {
      this.isWinner = true;
    }
  }

  addShape() {
    // get random shape
    const randomShape = Phaser.Math.RND.pick(SHAPES);

    // get random position x
    const randomX = Phaser.Math.RND.between(0, 800);

    // add shape to screen
    this.shapesGroup.create(randomX, 0, randomShape)
    .setCircle (32,0,0)
    .setBounce (0.5)
    .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);
    console.log("shape is added", randomX, randomShape);
    
  }

  updateTime() {
    this.leftTime--;
    this.timeText.setText("Time: " + this.leftTime);
    if (this.leftTime === 0) {
      this.isGameOver = true;
    }
  }
  reduce(shape,platform) {
    const newPercentage = shape.getData (POINTS_PERCENTAGE) - 0.25;
    console.log (shape.texture.key, newPercentage);
    shape.setData (POINTS_PERCENTAGE,newPercentage);
    if (newPercentage <=0) {
      shape.disableBody (true, true);
      return;
    }
    const text = this.add.text (shape.body.position.x+10, shape.body.position.y, "-25%", {
      fontSize:"22px",
      fontStyle: "bold",
      fill: "red"
    });
    setTimeout(()=> {
      text.destroy ();
    }, 200
    )
  }
}
