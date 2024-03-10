class BlackjackScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BlackjackScene' })
    }
  
    preload() {
        let suits = ['H', 'D', 'C', 'S']
        let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  
        for (let suit of suits) {
          for (let rank of ranks) {
            const cardKey = `${suit}${rank}`;
            this.load.image(cardKey, `assets/${cardKey}.png`);
          }
        }
      }
  
    create() {
      // Создание колоды карт
      this.deck = this.createDeck()
  
      // Тасовка колоды
      this.shuffleDeck(this.deck)
  
      // Раздача карт игроку и дилеру
      this.playerHand = [this.deck.pop(), this.deck.pop()]
      this.dealerHand = [this.deck.pop(), this.deck.pop()]
  
      // Инициализация начального счета
      this.playerScore = this.calculateScore(this.playerHand)
      this.dealerScore = this.calculateScore(this.dealerHand)
  
      // Отображение карт и счета
      this.displayHands()
          // Отображаем начальные счета игрока и дилера
    this.playerText = this.add.text(100, 450, 'Player Score: ' + this.playerScore, { fontSize: '32px', fill: '#FFF' })
    this.dealerText = this.add.text(100, 50, 'Dealer Score: ' + this.dealerScore, { fontSize: '32px', fill: '#FFF' })
    // Добавляем кнопки управления
    this.hitButton = this.add.text(100, 550, 'Hit', { fontSize: '32px', fill: '#FFF' })
      .setInteractive()
      .on('pointerdown', () => this.playerHit())

    this.standButton = this.add.text(200, 550, 'Stand', { fontSize: '32px', fill: '#FFF' })
      .setInteractive()
      .on('pointerdown', () => this.playerStand())
  }

  playerHit() {
    // Добавляем карту в руку игрока
    this.playerHand.push(this.deck.pop())
    this.playerScore = this.calculateScore(this.playerHand)
    this.playerText.setText('Player Score: ' + this.playerScore)

    // Проверяем на превышение 21
    if (this.playerScore > 21) {
      this.endGame('Player busts!')
    }
  }

  playerStand() {
    // Ход переходит к дилеру
    while (this.dealerScore < 17) {
      this.dealerHand.push(this.deck.pop())
      this.dealerScore = this.calculateScore(this.dealerHand)
      this.dealerText.setText('Dealer Score: ' + this.dealerScore)
    }

    // Определяем исход игры
    if (this.dealerScore > 21) {
      this.endGame('Dealer busts, player wins!')
    } else if (this.dealerScore > this.playerScore) {
      this.endGame('Dealer wins!')
    } else if (this.dealerScore < this.playerScore) {
      this.endGame('Player wins!')
    } else {
      this.endGame('Push!')
    }
  }

  endGame(message) {
    // Отображаем сообщение о результате игры
    this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, message, { fontSize: '40px', fill: '#FFF' }).setOrigin(0.5)
    this.hitButton.removeInteractive()
    this.standButton.removeInteractive()
  }

  
    createDeck() {
      let suits = ['H', 'D', 'C', 'S']
      let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
      let deck = []
  
      suits.forEach(suit => {
        ranks.forEach(rank => {
          deck.push({ rank, suit, value: this.getCardValue(rank) })
        })
      })
  
      return deck
    }
  
    shuffleDeck(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[deck[i], deck[j]] = [deck[j], deck[i]]
      }
    }
  
    getCardValue(rank) {
      if (rank === 'A') {
        return 11 // Может потребоваться логика для изменения значения туза с 11 на 1
      }
      if (['J', 'Q', 'K'].includes(rank)) {
        return 10
      }
      return parseInt(rank)
    }
  
    calculateScore(hand) {
      let score = hand.reduce((total, card) => total + card.value, 0)
  
      // Адаптация для туза, если сумма очков больше 21
      let aces = hand.filter(card => card.rank === 'A')
      aces.forEach(ace => {
        if (score > 21) score -= 10
      })
  
      return score
    }
  
    displayHands() {
        const offsetX = 100; // Начальное смещение для первой карты
        const offsetY = 500; // Позиция Y для руки игрока
        const spaceBetweenCards = 60; // Расстояние между картами
      
        this.playerHand.forEach((card, index) => {
          const cardText = `${card.rank} `; //of ${card.suit}
          const cardPosX = offsetX + index * spaceBetweenCards;
          // Если у вас есть изображения карт, попробуйте загрузить их
          // В противном случае отобразите текст
          if (this.textures.exists(cardText)) {
            this.add.image(cardPosX, offsetY, cardText);
          } else {
            this.add.text(cardPosX, offsetY, cardText, { fontSize: '18px', fill: '#FFF' });
          }
          this.playerHand.forEach((card, index) => {
    const cardKey = `${card.rank}_of_${card.suit}`;
    const cardPosX = offsetX + index * spaceBetweenCards;
    // Теперь мы используем cardKey для загрузки соответствующего изображения карты
    this.add.image(cardPosX, offsetY, cardKey).setScale(0.6);
  });
        });
      
        // То же самое для руки дилера, но в верхней части экрана
        const dealerOffsetY = 100;
        this.dealerHand.forEach((card, index) => {
          const cardText = `${card.rank}`; //of ${card.suit}
          const cardPosX = offsetX + index * spaceBetweenCards;
          if (this.textures.exists(cardText)) {
            this.add.image(cardPosX, dealerOffsetY, cardText);
          } else {
            this.add.text(cardPosX, dealerOffsetY, cardText, { fontSize: '18px', fill: '#FFF' });
          }
        });
      }
      
  
    // Методы для хода игрока (hit/stand), обновления игры и т.д.
  }
  
  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: BlackjackScene
  }
  
  const game = new Phaser.Game(config)
  