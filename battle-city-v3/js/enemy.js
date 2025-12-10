atom.declare('BattleCity.Enemy', BattleCity.Player, {
    speed: 0.05, // швидкість ворога повільніша за гравця
    health: 1, // кількість влучань для знищення

    configure: function() {
        // випадково вибираємо тип ворога
        var types = ['enemyBasic', 'enemyFast', 'enemyPower', 'enemyBonus'];
        var type = types[Math.random() * types.length | 0];
        this.type = type;
        
        // налаштування в залежності від типу
        type == 'enemyBasic' && (this.speed = 0.05);  // звичайний
        type == 'enemyFast' && (this.speed = 0.08);   // швидкий
        type == 'enemyPower' && (this.speed = 0.03, this.health = 4); // повільний але міцний
        type == 'enemyBonus' && (this.speed = 0.05);  // бонусний
        
        this.animationSheet = new Animation.Sheet({
            frames: new Animation.Frames(this.settings.get('images').get(type), 32, 32),
            delay: 60,
            looped: true
        });
        this.animation = new Animation({
            sheet: this.animationSheet,
            onUpdate: this.redraw
        });
        this.image = this.animation.get(0);

        // спавнимо в одній з трьох позицій
        var spawn = this.settings.get('spawnPosition');
        this.shape = new Rectangle(spawn.x, spawn.y, 32, 32);
        this.angle = 180; // дивимось вниз
    },

    onUpdate: function(time) {
        // випадкова зміна напрямку
        Math.random() < 0.005 && (this.angle = [0, 90, 180, 270][Math.random() * 4 | 0]);

        // рух
        var x = this.angle == 90 ? this.speed * time : this.angle == 270 ? -this.speed * time : 0;
        var y = this.angle == 0 ? -this.speed * time : this.angle == 180 ? this.speed * time : 0;
        
        // вороги не перевіряють колізії один з одним, тільки з текстурами та межами
        this.image = this.animation.get();
        !this.controller.collisions.checkCollisionWithTextures(this.shape, new Point(x, y))
            && !this.controller.collisions.checkOutOfTheField(this.shape, new Point(x, y))
            && this.shape.move(new Point(x, y));
        this.redraw();

        // стрільба
        Math.random() < 0.01 && this.shot(time);
    },

    // стріляємо як гравець, але з позначкою що це ворожа куля
    shot: function(time) {
        var now = Date.now();
        if (now > this.lastShot + this.rateOfFire * 1000 && !this.bullets) {
            this.lastShot = now;
            // розраховуємо позицію кулі в залежності від напрямку
            var x = this.angle == 90 ? this.shape.center.x + 16 : this.angle == 270 ? this.shape.center.x - 16 : this.shape.center.x;
            var y = this.angle == 0 ? this.shape.center.y - 16 : this.angle == 180 ? this.shape.center.y + 16 : this.shape.center.y;
            var bullet = new BattleCity.Bullet(this.controller.units, {
                controller: this.controller,
                angle: this.angle,
                shape: new Rectangle({center: new Point(x, y), size: new Size(8, 8)}),
                player: this,
                isEnemyBullet: true, // позначаємо що це ворожа куля
                images: this.settings.get('images')
            });
            this.controller.game.add(bullet);
            this.bullets++;
        }
    }
});