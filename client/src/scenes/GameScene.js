import { Deck } from '../objects/Deck.js';
import { Card } from '../objects/Card.js';

    

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
     }
     init(data) {
        this.gameId = data.id; // Получаем ID из переданных данных
    }
    // Получение данных о пользователе
    
    preload() {
        this.load.image('back', 'assets/cards/back1.png'); 
        for (let suit of ['C', 'D', 'H', 'S']) {
            for (let i = 1; i <= 13; i++) {
                let cardName = `${suit}${i < 10 ? '0' + i : i}`;
                this.load.image(cardName, `assets/cards/${cardName}.png`);
            }
        }
    }

    create() {
        console.log("Игра началась с ID:", this.gameId);    
        this.createUI();
        this.cameras.main.setBackgroundColor('#35654d');
        this.deck = new Deck(this);
        this.deck.shuffleDeck();

        this.playerHand = [];
        this.dealerHand = [];
        
        this.dealInitialCards();
        
    }

    dealInitialCards() {
        for (let i = 0; i < 2; i++) {
            this.playerHand.push(this.deck.dealCard());
            this.dealerHand.push(this.deck.dealCard());
        }
        this.displayCards();
        this.updateScores();
    }

    createUI() {
        // Расчёт координат для элементов интерфейса в зависимости от размера экрана
        const camera_width = this.cameras.main.width;
        const camera_height = this.cameras.main.height;
    
        // Создание и инициализация текстовых объектов для очков игрока и дилера
        this.playerScoreText = this.add.text(10, camera_height-200, 'Игрок: 0', { fontSize: '50px', fill: '#FFF' });
        this.dealerScoreText = this.add.text(10, 0, 'Дилер: 0', { fontSize: '50px', fill: '#FFF' });
    
        // Кнопки управления
        this.hitButton = this.add.text(camera_width/6, camera_height-camera_height/15, 'Взять карту', { font: '50px Arial', fill: '#fff', backgroundColor: '#8B4513' })
        .setPadding(10, 10, 10, 10)
        .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
        .setInteractive()
        .on('pointerdown', () => this.playerHit())
        .on('pointerover', () => this.hitButton.setStyle({ fill: '#f39c12' }))
        .on('pointerout', () => this.hitButton.setStyle({ fill: '#fff' }));
    
        this.standButton = this.add.text(camera_width/2, camera_height-camera_height/15, 'Остановиться', { font: '50px Arial', fill: '#fff', backgroundColor: '#8B4513' })
        .setPadding(10, 10, 10, 10)
        .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
        .setInteractive()
        .on('pointerdown', () => this.playerStand())
        .on('pointerover', () => this.standButton.setStyle({ fill: '#f39c12' }))
        .on('pointerout', () => this.standButton.setStyle({ fill: '#fff' }));

        this.cardPositions = {
            playerX: 100,
            playerY: camera_height-camera_height/5,
            dealerX: 100,
            dealerY: camera_height/10,
            cardOffset: camera_width/10 // Расстояние между картами
        };
    }
        
    
    

    playerHit() {
        Telegram.WebApp.sendData("data");
        
        // Пример отправки строки данных
        this.playerHand.push(this.deck.dealCard());
        this.displayCards();
        this.updateScores();
        // Проверка на превышение 21 очка
        if (this.calculateScore(this.playerHand) > 21) {
            this.endGame('Игрок проиграл');
        }
    }

    playerStand() {
        Telegram.WebApp.sendData("data");
        while (this.calculateScore(this.dealerHand) < 17) {
            this.dealerHand.push(this.deck.dealCard());
            this.updateScores();
        }

        this.displayCards();
        let playerScore = this.calculateScore(this.playerHand);
        let dealerScore = this.calculateScore(this.dealerHand);
    
        if (dealerScore > 21 || playerScore > dealerScore) {
            this.endGame('Игрок выиграл!');
        } else if (dealerScore > playerScore) {
            this.endGame('Дилер выиграл!');
        } else {
            this.endGame('Ничья!');
        }
    }
    

    displayCards() {
        // Использование сохранённых координат для расположения карт
        const { playerX, playerY, dealerX, dealerY, cardOffset } = this.cardPositions;
    
        // Отображаем карты игрока
        this.playerHand.forEach((cardData, index) => {
            const card = new Card(this, cardData.name);
            card.setPosition(playerX + (index * cardOffset), playerY);
        });
    
        // Отображаем карты дилера
        this.dealerHand.forEach((cardData, index) => {
            const card = new Card(this, cardData.name);
            card.setPosition(dealerX + (index * cardOffset), dealerY);
        });
    }
    


    updateScores() {
        let playerScore = this.calculateScore(this.playerHand);
        let dealerScore = this.calculateScore(this.dealerHand);
        this.playerScoreText.setText(`Игрок: ${playerScore}`);
        this.dealerScoreText.setText(`Дилер: ${dealerScore}`);
    }

    calculateScore(hand) {
        let score = 0;
        let aceCount = 0;
        hand.forEach(card => {
            if (card.value > 10) score += 10; // For face cards
            else if (card.value === 1) { // Ace
                aceCount += 1;
                score += 11; // Initially count aces as 11
            } else score += card.value;
        });
        // Adjust for aces if score is over 21
        while (score > 21 && aceCount > 0) {
            score -= 10; // Count ace as 1 instead of 11
            aceCount -= 1;
        }
        return score;
    }   

    determineWinner() {
        let playerScore = this.calculateScore(this.playerHand);
        let dealerScore = this.calculateScore(this.dealerHand);
        if (playerScore > 21) {
            this.endGame('Игрок проиграл');
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            this.endGame('Игрок выиграл');
        } else if (playerScore < dealerScore) {
            this.endGame('Дилер выиграл');
        } else {
            this.endGame('Ничья');
        }
    }
    
    endGame(message) {
        // Отображаем результат игры
        let resultText = this.add.text(400, 1000, message, { fontSize: '50px', fill: '#FFF' }).setOrigin(0.5);
        this.hitButton.removeInteractive();
        this.standButton.removeInteractive();
        // Кнопка "Новая игра"
        let restartButton = this.add.text(400, 1100, 'Новая игра', { font: '60px Arial', fill: '#fff', backgroundColor: '#8B4513' })
    .setPadding(10, 10, 10, 10)
    .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
    .setInteractive()
    .on('pointerdown', () => {
        this.scene.restart();
    })
    .setOrigin(0.5);
    }
    
}
