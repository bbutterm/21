export class Deck {
    constructor(scene) {
        this.scene = scene;
        this.cards = this.createDeck();
        this.shuffleDeck();
    }

    createDeck() {
        const suits = ['C', 'D', 'H', 'S'];
        const cards = [];
        for (let suit of suits) {
            for (let i = 1; i <= 13; i++) {
                let cardName = `${suit}${i < 10 ? '0' + i : i}`;
                cards.push({ name: cardName, suit: suit, value: i });
            }
        }
        return cards;
    }

    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; 
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}
