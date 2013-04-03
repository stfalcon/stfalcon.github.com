atom.declare('BattleCity.Wall', App.Element, {
    spriteX: 0,
    spriteY: 0,

    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            center: this.shape.center
        });
    }
});

atom.declare('BattleCity.Breaks', BattleCity.Wall, {
    spriteX: 32,
    spriteY: 0
});

atom.declare('BattleCity.Trees', BattleCity.Wall, {
    spriteX: 64,
    spriteY: 0
});

atom.declare('BattleCity.Water', BattleCity.Wall, {
    spriteX: 96,
    spriteY: 0
});

atom.declare('BattleCity.Asphalt', BattleCity.Wall, {
    spriteX: 128,
    spriteY: 0
});

atom.declare('BattleCity.Base', App.Element, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : resources.get('images').get('base'),
            center: this.shape.center
        });
    }
});