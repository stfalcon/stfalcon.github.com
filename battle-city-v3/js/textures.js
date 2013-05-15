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

// Кирпичная стена
atom.declare('BattleCity.Breaks', BattleCity.Wall, {
    spriteX: 32,
    spriteY: 0,

    renderTo: function (ctx, resources) {
        var state = this.settings.values.state;

        var cropFrom = 0;
        var cropTo = 0;
        var drawFrom = 0;
        var drawTo = 0;
        var width = 16;
        var height = 16;

        switch (state) {
            case 'W':
                cropFrom = drawFrom = width = 8;
                break;
            case 'E':
                width = 8;
                break;
            case 'S':
                height = 8;
                break;
            case 'N':
                cropTo = drawTo = height = 8;
                break;
            case 'WN':
                width = height = drawFrom = drawTo = 8;
                break;
            case 'WS':
                width = height = cropFrom = drawFrom = 8;
                break;
            case 'EN':
                width = height = cropFrom = drawTo = 8;
                break;
            case 'ES':
                width = height = 8;
                break;
            case 'SW':
                width = height = cropTo = drawFrom = 8;
                break;
            case 'SE':
                width = height = 8;
                break;
            case 'NW':
                width = height = drawFrom = drawTo = 8;
                break;
            case 'NE':
                width = height = cropTo = drawTo = 8;
                break;
        }

        ctx.drawImage({
            image: resources.get('images').get('textures').sprite(
                new Rectangle(this.spriteX, this.spriteY, 16, 16)
            ),
            crop: [cropFrom, cropTo, width, height],
            draw: [this.shape.from.x + drawFrom, this.shape.from.y + drawTo, width, height],
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