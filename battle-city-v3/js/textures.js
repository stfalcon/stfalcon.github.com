// Абстракт разрушеной кирпичной стены
atom.declare('BattleCity.BreaksPartedAbstract', App.Element, {
    spriteX: 32,
    spriteY: 0
});

// Кирпичная стена повреждена на половину с западной стороны
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

// Кирпичная стена повреждена на половину с западной стороны
// и на четверть с северной стороны
atom.declare('BattleCity.BreaksWestNorthPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 8, 8],
            draw: [this.shape.from.x + 8, this.shape.from.y + 8, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с западной стороны
// и на четверть с южной стороны
atom.declare('BattleCity.BreaksWestSouthPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [8, 0, 8, 8],
            draw: [this.shape.from.x + 8, this.shape.from.y, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с восточной стороны
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

// Кирпичная стена повреждена на половину с восточной стороны
// и на четверть с северной стороны
atom.declare('BattleCity.BreaksEastNorthPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [8, 0, 8, 8],
            draw: [this.shape.from.x, this.shape.from.y + 8, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с восточной стороны
// и на четверть с южной стороны
atom.declare('BattleCity.BreaksEastSouthPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 8, 8],
            draw: [this.shape.from.x, this.shape.from.y, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с южной стороны
atom.declare('BattleCity.BreaksSouth', BattleCity.BreaksPartedAbstract, {
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

// Кирпичная стена повреждена на половину с южной стороны
// и на четверть с западной стороны
atom.declare('BattleCity.BreaksSouthWestPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 8, 8, 8],
            draw: [this.shape.from.x + 8, this.shape.from.y, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с южной стороны
// и на четверть с восточной стороны
atom.declare('BattleCity.BreaksSouthEastPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 8, 8],
            draw: [this.shape.from.x, this.shape.from.y, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с северной стороны
atom.declare('BattleCity.BreaksNorth', BattleCity.BreaksPartedAbstract, {
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

// Кирпичная стена повреждена на половину с северной стороны
// и на четверть с западной стороны
atom.declare('BattleCity.BreaksNorthWestPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 0, 8 , 8],
            draw: [this.shape.from.x + 8, this.shape.from.y + 8, 8, 8],
            center: this.shape.center
        });
    }
});

// Кирпичная стена повреждена на половину с северной стороны
// и на четверть с восточной стороны
atom.declare('BattleCity.BreaksNorthEastPart', BattleCity.BreaksPartedAbstract, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [0, 8, 8 , 8],
            draw: [this.shape.from.x, this.shape.from.y + 8, 8, 8],
            center: this.shape.center
        });
    }
});

// Бетонная стена
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

// Целая кирпичная стена
atom.declare('BattleCity.Breaks', BattleCity.Wall, {
    spriteX: 32,
    spriteY: 0,

    renderTo: function (ctx, resources) {
        console.log(this);
        var state = this.settings.values.state;

        var from = 0;
        var to = 0;
        var width = 16;
        var height = 16;

        if (state === 'W') {
            from += 8;
            width -= 8;
        } else if (state == 'E') {
            width -= 8;
        } else if (state == 'S') {
            height -= 8;
        } else if (state == 'N') {
            to += 8;
            height -= 8;
        }

        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [from, to, width, height],
            draw: [this.shape.from.x + from, this.shape.from.y + to, width, height],
            center: this.shape.center
        });
    }
});

// Деревья
atom.declare('BattleCity.Trees', BattleCity.Wall, {
    spriteX: 64,
    spriteY: 0
});

// Вода
atom.declare('BattleCity.Water', BattleCity.Wall, {
    spriteX: 96,
    spriteY: 0
});

// Асфальт
atom.declare('BattleCity.Asphalt', BattleCity.Wall, {
    spriteX: 128,
    spriteY: 0
});

// База
atom.declare('BattleCity.Base', App.Element, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image: resources.get('images').get('base'),
            center: this.shape.center
        });
    }
});

// Разрушенная база
atom.declare('BattleCity.BaseDestroyed', App.Element, {
    renderTo: function (ctx, resources) {
        ctx.drawImage({
            image : resources.get('images').get('baseDestroyed'),
            center: this.shape.center
        });
    }
});