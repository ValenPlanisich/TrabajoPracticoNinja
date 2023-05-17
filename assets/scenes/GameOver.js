export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }

  init() {}

  preload() {}

  create() {
    this.add.text(350, 300, "GAME OVER");
  }

  update() {}
}
