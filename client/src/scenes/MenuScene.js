export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        let id = Telegram.WebApp?.initDataUnsafe?.user?.id || 22;
        let name = Telegram.WebApp?.initDataUnsafe?.user?.first_name|| 'Guest';
        this.cameras.main.setBackgroundColor('#35654d');
        
        // Отображение приветствия и очков
        this.add.text(10, 10, `Привет, ${name}!`, { fontSize: '32px', fill: '#FFF' });
        let score = this.checkAndRegisterUser(id)
        // Создание кнопки "Новая игра"
        // Создаем кнопку "Играть"
        let user = { id: id, first_name: name, score: score }
        const playButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Играть', { font: '50px Arial', fill: '#fff', backgroundColor: '#8B4513' })
            .setPadding(10, 10, 10, 10)
            .setStyle({ backgroundColor: '#8B4513', stroke: '#A52A2A', strokeThickness: 2 })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene', {user:user}))
            .on('pointerover', () => playButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => playButton.setStyle({ fill: '#fff' }))
            .setOrigin(0.5);

        // Опционально: добавляем текст счета игрока
        //const scoreText = this.add.text(this.cameras.main.width - 200, this.cameras.main.height - 50, 'Score', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
    }
    async checkAndRegisterUser(userId) {
        const url = `https://21server.vercel.app/api/player`;
        let score = 100; // Предполагаем начальный скор

        try {
            let response = await fetch(`${url}?id=${userId}`);
            if (response.ok) {
                const data = await response.json();
                // Проверяем, существуют ли данные и есть ли в них запись о скоре
                score = data.score || score; // Если скор есть, используем его, иначе оставляем 100
            } else if (response.status === 404) {
                console.log('Пользователь не найден, регистрируем...');
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, score: score })
                });
            } else {
                console.error('Ошибка при получении данных пользователя');
            }
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }

        return score;
    }
}

