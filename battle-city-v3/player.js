atom.declare('BattleCity.Player', App.Element, {
    width : 32,
    height: 32,

    speed: 0.09, // скорость перемещения игрока
    angle: 0, // угол поворота спрайта

    configure: function () {
        // анимация движения гусениц танка
        this.animationSheet = new Animation.Sheet({
            frames: new Animation.Frames(this.settings.get('images').get('player'), this.width, this.height),
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
            128, this.size.height-this.height, this.width, this.height
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

        for (i = this.controller.texturesFields.length; i--;) {
            textureField = this.controller.texturesFields[i];

            if (textureField.shape.intersect(shape)) {
                if (textureField instanceof BattleCity.Trees) {
                    return false;
                }
                if (textureField instanceof BattleCity.Asphalt) {
                    return false;
                }

                return true;
            }
        }

        return false;
    }

});