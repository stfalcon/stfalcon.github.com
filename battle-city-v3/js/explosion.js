/** @class BattleCity.Explosion */
atom.declare('BattleCity.Explosion', App.Element, {

    configure : function method() {

        // анимация взрыва
        this.animationSheet = new Animation.Sheet({
            frames : new Animation.Frames(this.settings.get('images').get('bang'), 32, 32),
            delay : 50,
            looped : false
        });
        this.animation = new Animation({
            sheet : this.animationSheet,
            onUpdate : this.redraw,
            onStop : this.destroy
        });
    },

    renderTo: function (ctx) {
        var image = this.animation.get();

        if (image) {
            ctx.drawImage({
                image: image,
                center: this.shape.center,
                angle: this.angle
            });
        }
    }
});