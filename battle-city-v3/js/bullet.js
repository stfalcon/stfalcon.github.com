atom.declare('BattleCity.Bullet', App.Element, {
    speed: 0.2, // скорость полета пули

    configure: function method () {
        method.previous.call(this);

        this.controller.sounds.play('shot');

        this.angle = this.settings.get('angle');
        this.image = this.settings.get('images').get('bullet');
    },

    get controller () {
        return this.settings.get('controller');
    },

    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : this.image,
            center: this.shape.center,
            angle: this.angle.degree()
        });
    },

    onUpdate: function (time) {
        var x = this.angle == 90 ? this.speed*time
            : this.angle == 270 ? -this.speed*time
            : 0;
        var y = this.angle == 0 ? -this.speed*time
            : this.angle == 180 ? this.speed*time
            : 0;

        // двигаем пулю
        this.shape.move(new Point(x, y));
        this.redraw();

        // считаем коллизию с пределами поля
        if (this.checkOutOfTheField(this.shape, new Point(x, y))
            || this.checkCollisionWithTextures(this.shape, new Point(x, y))) {
            this.settings.get('player').bullets--;

            // создаем инстанс взрыва
            new BattleCity.Explosion(this.controller.units, {
                // @todo координаты центра взрыва нужно подвигать немного вперед
                shape: new LibCanvas.Shapes.Circle(this.shape.center.x, this.shape.center.y, 32 ),
                animationSheet: this.animationSheet,
                animation: this.animation,
                images: this.settings.get('images')
            });

            // уничтожаем инстанс пули
            this.destroy();
        }
    },

    // проверяем вылет за границы игрового поля
    // @todo копипаст с player.js
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

                if (field instanceof BattleCity.Breaks) {
                this.controller.textures.erase(field);
                field.destroy();
                }

                return true;
            }
        }

        return false;
    }
});
