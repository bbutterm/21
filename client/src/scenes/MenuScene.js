export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Задаем фон
        const user = Telegram.WebApp.initDataUnsafe.user || { id: '13', first_name: 'Guest', score: 100 };
        this.cameras.main.setBackgroundColor('#35654d');
        // Отображение приветствия и очков
        this.add.text(10, 10, `Привет, ${user.first_name}!`, { fontSize: '32px', fill: '#FFF' });
        this.checkAndRegisterUser(user.id);
        // Создание кнопки "Новая игра"
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
        //const scoreText = this.add.text(this.cameras.main.width - 200, this.cameras.main.height - 50, 'Score', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
    }
    async checkAndRegisterUser(userId) {
        const url = 'https://21server.vercel.app/api/player';

        try {
            let response = await fetch(`${url}?id=${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data && Object.keys(data).length > 0) {
                    console.log('Пользователь найден:', data);
                } else {
                    console.log('Пользователь не найден, регистрируем...');
                    response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: userId, score: 100 }),
                    });
                    if (response.ok) {
                        const newUser = await response.json();
                        console.log('Новый пользователь зарегистрирован:', newUser);
                    } else {
                        console.error('Ошибка при регистрации пользователя');
                    }
                }
            } else {
                console.error('Ошибка при получении данных пользователя');
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    }
}

