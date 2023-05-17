export default class Winner extends Phaser.Scene {
  constructor() {
    super("winner");
  }

  init() {}

  preload() {}

  create() {
    this.add.text(350, 300, "WINNER");
  }

  update() {}
}
