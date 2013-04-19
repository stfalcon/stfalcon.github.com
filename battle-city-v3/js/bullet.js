atom.declare('BattleCity.Bullet', App.Element, {
    speed : 0.2, // скорость полета пули

    configure : function method() {
        method.previous.call(this);

        this.controller.sounds.play('shot');

        this.angle = this.settings.get('angle');
        this.image = this.settings.get('images').get('bullet');
    },

    get controller() {
        return this.settings.get('controller');
    },

    renderTo : function(ctx, resources) {
        ctx.drawImage({
            image : this.image,
            center : this.shape.center,
            angle : this.angle.degree()
        });
    },

    onUpdate : function(time) {
        var x = this.angle == 90 ? this.speed * time
            : this.angle == 270 ? -this.speed * time
            : 0;
        var y = this.angle == 0 ? -this.speed * time
            : this.angle == 180 ? this.speed * time
            : 0;

        // двигаем пулю
        this.shape.move(new Point(x, y));
        this.redraw();

        // считаем коллизию с пределами поля
        if (this.controller.game.checkOutOfTheField(this.shape, new Point(x, y))
            || this.controller.game.checkCollisionWithTextures(this.shape, new Point(x, y))) {
            this.controller.game.destroyPartedWalls(this.shape, new Point(x, y));
            this.controller.game.destroyWalls(this.shape, new Point(x, y), this.angle);

            this.settings.get('player').bullets--;

            // создаем инстанс взрыва
            new BattleCity.Explosion(this.controller.units, {
                // @todo координаты центра взрыва нужно подвигать немного вперед
                shape : new LibCanvas.Shapes.Circle(this.shape.center.x, this.shape.center.y, 32),
                animationSheet : this.animationSheet,
                animation : this.animation,
                images : this.settings.get('images')
            });

            // уничтожаем инстанс пули
            this.destroy();
        }
    }
});
