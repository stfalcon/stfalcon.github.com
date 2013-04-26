atom.declare('BattleCity.Enemy', App.Element, {
    speed: 0.09, // скорость перемещения
    angle: 0, // угол поворота спрайта
    bullets: 0,
    rateOfFire: 1,
    lastShot: 0,
    reverseTime: 0,
    chaoticReverseTime: 0,
    spawnNewEnemyTime: 0,
    canShot: true,
    collideWithCharacters: true,

    configure: function () {
        // анимация движения гусениц танка
        this.animationSheet = new Animation.Sheet({
            frames: new Animation.Frames(this.settings.get('images').get('player'), 32, 32),
            delay : 60,
            looped: true
        });
        this.animation = new Animation({
            sheet   : this.animationSheet,
            onUpdate: this.redraw
        });

        // для первой отрисовки танка берем нулевой кадр анимации
        this.image = this.animation.get(0);
        this.modifier = -1;
    },

    get controller () {
        return this.settings.get('controller');
    },

    get size () {
        return this.settings.get('size');
    },

    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : this.image,
            center: this.shape.center,
            angle : this.angle.degree()
        })
    },

    onUpdate: function (time) {
        var angle = parseInt(this.settings.get('angle'));

        if (this.modifier >= 0 ) {
            angle = this.modifier;
        }

        if (angle == 270) {
            this.move(-this.speed*time, 0);
        } else if (angle == 90) {
            this.move(this.speed*time, 0);
        } else if (angle == 0) {
            this.move(0, -this.speed*time);
        } else if (angle == 180) {
            this.move(0, this.speed*time);
        }

        if(!this.controller.endGame && this.canShot) {
            this.shot(time);
        }

//        var randomTime = 2000;
//        var now = Date.now();
//        if () {
//            this.collideWithCharacters = true;
//        }

        var randomTime = 30000;
        this.spawnNewEnemyTime = Date.now() - randomTime;
        var nowA = Date.now();

        if (nowA > this.spawnNewEnemyTime + randomTime) {
            this.spawnNewEnemyTime = nowA;
            var enemy = new BattleCity.Enemy(this.controller.units, {
                size : this.size,
                images : this.settings.get('images'),
                shape : new Rectangle(256, 176, 32, 32),
                angle : 270,
                controller : this.controller
            });

            this.controller.enemies.push(enemy);
        }
    },

    // стреляем
    shot: function (time) {
        var now = Date.now();

        if (now > this.lastShot + this.rateOfFire * 3000) { // пока стреляем по одной пуле
            this.lastShot = now;

            var x = this.angle == 90 ? this.shape.center.x + 16
                : this.angle == 270 ? this.shape.center.x - 16
                : this.shape.center.x;
            var y = this.angle == 0 ? this.shape.center.y - 16
                : this.angle == 180 ? this.shape.center.y + 16
                : this.shape.center.y;

            var bullet = new BattleCity.Bullet(this.controller.units, {
                controller: this.controller,
                angle: this.angle,
                shape: new Rectangle({
                        center: new Point(x, y),
                        size: new Size(8, 8)}
                ),
                player: this,
                images: this.settings.get('images')
            });

            this.controller.enemyBullets.push(bullet);
        }
    },

    // двигать танк
    move: function (x, y) {
        // "запускаем" анимацию гусениц
        this.image = this.animation.get();

        // округляем координаты к целым числам
        var x = Math.round(x),
            y = Math.round(y);

        var angle =
            y < 0 ? 0 :
                x > 0 ? 90 :
                    y > 0 ? 180 :
                        x < 0 ? 270 : 0;

        var posX = 128;
        var posY = this.size.height-32;

        var now = Date.now();

        var randomTime = (Math.floor(Math.random() * 5) + 2) * 1000;

        if (now > this.chaoticReverseTime + randomTime) {
            this.canShot = false;
            this.chaoticReverseTime = now;
            var angles = [0, 90, 180, 270];
            var rand = angles[Math.floor(Math.random() * angles.length)];
            this.modifier = rand;
            this.canShot = true;
        }

        // пытаемся выровнять координаты при заходе в поворот
        if (this.angle == 0 && (angle == 270 || angle == 90)) {
            // двигается снизу вверх и поворачивает налево-направо
            posX = this.shape.center.x - 16;
            posY = this.shape.center.y - (this.shape.center.y % 16) - 16;
            this.shape.moveTo(new Point(posX, posY));
        } else if (this.angle == 180 && (angle == 270 || angle == 90)) {
            // двигается сверху вниз и поворачивает налево-направо
            posX = this.shape.center.x - 16;
            posY = this.shape.center.y - (this.shape.center.y % 16) - 16;
            this.shape.moveTo(new Point(posX, posY));
        } else if (this.angle == 90 && (angle == 0 || angle == 180)) {
            // двигает слева направо и поворачивает вниз-вверх
            posY = this.shape.center.y - 16;
            posX = this.shape.center.x - (this.shape.center.x % 16) - 16;
            this.shape.moveTo(new Point(posX, posY));
        } else if (this.angle == 270 && (angle == 0 || angle == 180)) {
            // двигается справа налево и поворачивает вниз-вверх
            posY = this.shape.center.y - 16;
            posX = this.shape.center.x - (this.shape.center.x % 16) - 16;
            this.shape.moveTo(new Point(posX, posY));
        }

        // можно ехать
        if (!this.controller.collisions.checkCollisionWithTextures(this.shape, new Point(x, y))
            && !this.controller.collisions.checkOutOfTheField(this.shape, new Point(x, y))
            && !this.controller.collisions.checkCollisionWithPlayers(this.shape, new Point(x, y))
            && !this.controller.collisions.checkCollisionWithEnemies(this.shape, new Point(x, y), this)
            ) {
            this.shape.move(new Point(x, y));
        } else {
            var now = Date.now();

            if (now > this.reverseTime + 1000) {
                this.canShot = false;
                this.reverseTime = now;
                var angles = [0, 90, 180, 270];
                var rand = angles[Math.floor(Math.random() * angles.length)];
                this.modifier = rand;
                this.canShot = false;
            }
        }

        // повернуть танк
        this.angle = angle;

        this.redraw();
    }

});