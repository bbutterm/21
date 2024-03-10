export class Card {
    constructor(scene, cardName) {
        this.scene = scene;
        this.cardName = cardName;
        this.sprite = this.scene.add.sprite(0, 0, this.cardName).setInteractive().setScale(2);
        this.sprite.card = this;
    }

    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
}
