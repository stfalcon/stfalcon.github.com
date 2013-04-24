atom.declare('BattleCity.GameOverMessage', App.Element, {
    speed : 0.1, // скорость движения сообщения

    get controller() {
        return this.settings.get('controller');
    },

    renderTo : function(ctx, resources) {
        ctx.text({
            to   : this.shape,
            text : 'GAME\nOVER',
            family : 'prstart',
            color : '#e44437'
        });
    },
    onUpdate : function(time) {
        var y = this.speed * time;

        if (this.shape.center.y > 225) {
            this.shape.move(new Point(0, -y));
            this.redraw();
        } else {
            this.controller.info.stop();
        }
    }
});