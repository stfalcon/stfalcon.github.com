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

        var explosionXOffset = this.angle == 90 ? 16
            : this.angle == 270 ? -16 : 0;
        var explosionYOffset = this.angle == 0 ? -16
            : this.angle == 180 ? 16 : 0;

        // двигаем пулю
        this.shape.move(new Point(x, y));
        this.redraw();

        // считаем коллизию с пределами поля
        if (this.controller.collisions.checkOutOfTheField(this.shape, new Point(x, y))
            || this.controller.collisions.checkCollisionWithTextures(this.shape, new Point(x, y))) {
            this.controller.collisions.destroyWalls(this.shape, new Point(x, y), this.angle);

            this.settings.get('player').bullets--;

            // создаем инстанс взрыва
            new BattleCity.Explosion(this.controller.units, {
                shape: new LibCanvas.Shapes.Circle(
                    this.shape.center.x + explosionXOffset,
                    this.shape.center.y + explosionYOffset,
                    32
                ),
                animationSheet: this.animationSheet,
                animation: this.animation,
                images: this.settings.get('images')
            });

            // уничтожаем инстанс пули
            this.destroy();
        }
    }
});
