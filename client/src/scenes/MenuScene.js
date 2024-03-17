export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Задаем фон
        const user = Telegram.WebApp.initDataUnsafe.user || { id: '0', first_name: 'Guest', score: 100 };

        // Отображение приветствия и очков
        this.add.text(10, 10, `Привет, ${user.first_name}! Очки: ${user.score}`, { fontSize: '32px', fill: '#FFF' });

        // Создание кнопки "Новая игра"
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Новая игра', { font: '24px Arial', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene', { userId: user.id, score: user.score }));
        // Создаем кнопку "Играть"
        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Играть', { font: '50px Arial', fill: '#fff', backgroundColor: '#8B4513' })
            .setPadding(10, 10, 10, 10)
            .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene', { user }))
            .on('pointerover', () => playButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => playButton.setStyle({ fill: '#fff' }))
            .setOrigin(0.5);

        // Опционально: добавляем текст счета игрока
        const scoreText = this.add.text(this.cameras.main.width - 200, this.cameras.main.height - 50, 'Score', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
    }
}

