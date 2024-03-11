export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Задаем фон
        this.cameras.main.setBackgroundColor('#35654d');
        const user = Telegram.WebApp.initDataUnsafe.user;
        console.log(user); // Выводит информацию о пользователе
         // Извлечение ID из хэша URL
        const id = window.location.hash.slice(1);

         // Отображение ID в сцене
         this.add.text(20, 20, `ID: ${id}`, { font: '16px Arial', fill: '#fff' });;

        // Создаем кнопку "Играть"
        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Играть', { font: '50px Arial', fill: '#fff', backgroundColor: '#8B4513' })
            .setPadding(10, 10, 10, 10)
            .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene', { id: id }))
            .on('pointerover', () => playButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => playButton.setStyle({ fill: '#fff' }))
            .setOrigin(0.5);

        // Опционально: добавляем текст счета игрока
        const scoreText = this.add.text(this.cameras.main.width - 200, this.cameras.main.height - 50, 'Счет: 0', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
    }
}

