atom.declare('BattleCity.GameOverMessage', App.Element, {
    speed : 0.2, // скорость полета пули

    get controller() {
        return this.settings.get('controller');
    },

    renderTo : function(ctx, resources) {
        ctx.text({
            text : 'GAME\nOVER',
            family : 'prstart',
            padding : [208, 178],
            color : '#e44437'
        });
    },
    onUpdate : function(time) {
        var y = this.speed * time;
        console.log(time);

        // двигаем пулю
        this.shape.move(new Point(0, y));
        this.redraw();
    }
});