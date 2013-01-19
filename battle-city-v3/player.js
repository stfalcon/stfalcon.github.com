atom.declare('BattleCity.Player', App.Element, {
    width : 26,
    height: 26,
//    speed: new Point(0, 300),
    speed: 1.6, // скорость перемещения игрока
    angle: 0, // угол поворота спрайта

    configure: function () {
        this.shape = new Rectangle(
            128+(32-this.width)/2, this.size.height-32+(32-this.height)/2, this.width, this.height
        );
    },

    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : resources.get('images').get('player'),
            center: this.shape.center,
            angle : this.angle
        })
    },

    get size () {
        return this.settings.get('size');
    },

    onUpdate: function (time) {
        var
            keyboard = atom.Keyboard(),
            controls = this.settings.get('controls');

        if (keyboard.key(controls.up)) {
            this.move(0, -this.speed);
            this.rotate(0);
        } else if (keyboard.key(controls.down)) {
            this.move(0, this.speed);
            this.rotate(180);
        } else if (keyboard.key(controls.left)) {
            this.move(-this.speed, 0);
            this.rotate(270);
        } else if (keyboard.key(controls.right)) {
            this.move(this.speed, 0);
            this.rotate(90);
        }
        this.redraw();
    },

    move: function (x, y) {
        this.shape.move([x, y]);
    },

    // повернуть танк
    rotate: function (angle) {
        this.angle = (angle).degree();
    }
});