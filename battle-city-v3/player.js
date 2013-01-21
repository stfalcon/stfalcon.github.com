atom.declare('BattleCity.Player', App.Element, {
    width : 32,
    height: 32,

    speed: 0.07, // скорость перемещения игрока
    angle: 0, // угол поворота спрайта

    configure: function () {
        // анимация движения гусениц танка
        this.animationSheet = new Animation.Sheet({
            frames: new Animation.Frames(this.settings.get('images').get('player'), this.width, this.height),
            delay : 80,
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
        ctx.drawImage({
            image : this.image,
            center: this.shape.center,
            angle : this.angle
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
        this.shape.move(new Point(x, y));
        this.image = this.animation.get(); // "запускаем" анимацию

        var angle =
            y < 0 ? 0 :
            x > 0 ? 90 :
            y > 0 ? 180 :
            x < 0 ? 270 : 0;
        this.rotate(angle);

        this.redraw();
    },

    // повернуть танк
    rotate: function (angle) {
        if (this.angle != angle) {
            this.angle = (angle).degree();
        }
    }
});