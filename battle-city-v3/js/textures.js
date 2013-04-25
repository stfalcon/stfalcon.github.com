atom.declare('BattleCity.BreaksPartedAbstract', App.Element, {
    spriteX: 32,
    spriteY: 0
});

atom.declare('BattleCity.BreaksWest', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [8, 0, 8, 16],
            draw: [this.shape.from.x + 8, this.shape.from.y, 8, 16],
            center: this.shape.center
        });
    }
});

atom.declare('BattleCity.BreaksEast', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 8, 16],
            draw: [this.shape.from.x, this.shape.from.y, 8, 16],
            center: this.shape.center
        });
    }
});

atom.declare('BattleCity.BreaksNorth', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 16, 8],
            draw: [this.shape.from.x, this.shape.from.y, 16, 8],
            center: this.shape.center
        });
    }
});

atom.declare('BattleCity.BreaksSouth', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 8, 16 , 8],
            draw: [this.shape.from.x, this.shape.from.y + 8, 16, 8],
            center: this.shape.center
        });
    }
});

atom.declare('BattleCity.Wall', App.Element, {
    spriteX: 0,
    spriteY: 0,

    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
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
            image: resources.get('images').get('base'),
            center: this.shape.center
        });
    }
});