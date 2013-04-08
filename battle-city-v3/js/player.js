atom.declare('BattleCity.Player', App.Element, {
    speed: 0.09, // скорость перемещения игрока
    angle: 0, // угол поворота спрайта
    rateOfFire: 2.5, // скорострельность
    bullets: 0,

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

        // задаем стартовые координаты танка
        this.shape = new Rectangle(
            128, this.size.height-32, 32, 32
        );
    },

    get controller () {
        return this.settings.get('controller');
    },

    get size () {
        return this.settings.get('size');
    },

    renderTo: function (ctx, resources) {
//        ctx.fill(this.shape, 'indigo');
        ctx.drawImage({
            image : this.image,
            center: this.shape.center,
            angle : this.angle.degree()
        })
    },

    lastShot: 0, // время последнего выстрела

    onUpdate: function (time) {
        var
            keyboard = atom.Keyboard(),
            controls = this.settings.get('controls');

        // проверяем нажатия клавиш и двигаем/поворачиваем танк
        if (keyboard.key(controls.up)) {
            this.move(0, -this.speed*time);
        } else if (keyboard.key(controls.down)) {
            this.move(0, this.speed*time);
        } else if (keyboard.key(controls.left)) {
            this.move(-this.speed*time, 0);
        } else if (keyboard.key(controls.right)) {
            this.move(this.speed*time, 0);
        }

        if (keyboard.key(controls.fire)) {
            this.shot(time);
        }
    },

    // стреляем
    shot: function (time) {
        var now = Date.now();
        if (now > this.lastShot + this.rateOfFire * 1000 && !this.bullets) { // нельзя стрелять чаще, чем раз в rateOfFire секунд
            this.lastShot = now;

            var x = this.angle == 90 ? this.shape.center.x + 24
                : this.angle == 270 ? this.shape.center.x - 24
                : this.shape.center.x;
            var y = this.angle == 0 ? this.shape.center.y - 24
                : this.angle == 180 ? this.shape.center.y + 24
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

            this.controller.game.add(bullet);

            this.bullets++;
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

        // пытаемся выровнять координаты при заходе в поворот
        if (this.angle == 0 && (angle == 270 || angle == 90)) {
            // двигается снизу вверх и поворачивает налево-направо
            y -= this.shape.center.y - Math.round(this.shape.center.y / 16) * 16;
        } else if (this.angle == 180 && (angle == 270 || angle == 90)) {
            // двигается сверху вниз и поворачивает налево-направо
            y += Math.round(this.shape.center.y / 16) * 16 - this.shape.center.y;
        } else if (this.angle == 90 && (angle == 0 || angle == 180)) {
            // двигает слева направо и поворачивает вниз-вверх
            x += Math.round(this.shape.center.x / 16) * 16 - this.shape.center.x;
        } else if (this.angle == 270 && (angle == 0 || angle == 180)) {
            // двигается справа налево и поворачивает вниз-вверх
            x -= this.shape.center.x - Math.round(this.shape.center.x / 16) * 16;
        }

        // можно ехать
        if (!this.checkCollisionWithTextures(this.shape, new Point(x, y))
            && !this.checkOutOfTheField(this.shape, new Point(x, y))) {
            this.shape.move(new Point(x, y));
        }

        // повернуть танк
        this.angle = angle;

        this.redraw();

//        console.log(
//            ['center', this.shape.center.x, this.shape.center.y],
//            ['to', this.shape.to.x, this.shape.to.y],
//            ['from', this.shape.from.x, this.shape.from.y]
//        );
    },

    // проверяем выезд за границы игрового поля
    checkOutOfTheField: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        var top = shape.from.y,
            bottom = shape.to.y - this.controller.size.height,
            left = shape.from.x,
            right = shape.to.x - this.controller.size.width;

        if (top < 0 || bottom > 0 || left < 0 || right > 0) {
            return true;
        }

        return false;
    },

    // проверяем колизии с текстурами
    checkCollisionWithTextures: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (field.shape.intersect(shape)) {
                if (field instanceof BattleCity.Trees) {
                    return false;
                }
                if (field instanceof BattleCity.Asphalt) {
                    return false;
                }

                return true;
            }
        }

        return false;
    }

});