/** @class BattleCity.Game */
atom.declare('BattleCity.Game', {

    initialize: function (controller) {
//        this.bindMethods('update');

        this.controller = controller;
        this.players = [];
        this.textures = [];
        this.bullets = [];
//        this.enemies = [];
    },

    /** @private */
    getArray: function (item) {
        var a = item instanceof BattleCity.Wall ? this.textures :
            item instanceof BattleCity.Bullet ? this.bullets :
//            item instanceof BattleCity.Enemy ? this.enemies :
            item instanceof BattleCity.Player ? this.players : null;

        if (a == null) throw new TypeError( 'unknown type of ' + item );

        return a;
    },

    add: function (item) {
        this.getArray(item).push(item);
        return this;
    },

    remove: function (item) {
        this.getArray(item).erase(item);
        return this;
    },

    update: function () {
//        console.log(new Date().getTime());
//        this.shipsAsteroids();
//        this.bulletsAsteroids();
    },

    // проверяем выезд за границы игрового поля
    checkOutOfTheField: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        var top = shape.from.y,
            bottom = shape.to.y - this.controller.size.height,
            left = shape.from.x,
            right = shape.to.x - this.controller.size.width;

        if (top < 0 || bottom > 0 || left < 0 || right > 0) {
            return true;
        }

        return false;
    },

    // проверяем колизии с текстурами
    checkCollisionWithTextures: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (field.shape.intersect(shape)) {
                if (field instanceof BattleCity.Trees || field instanceof BattleCity.Asphalt) {
                    return false;
                }

                return true;
            }
        }

        return false;
    },

    // рушим стены
    destroyWalls: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (this.controller.textures[i].shape.intersect(shape) && this.controller.textures[i] instanceof BattleCity.Breaks) {

                var rectangle = new Rectangle(this.controller.textures[i].shape.from.x, this.controller.textures[i].shape.from.y, 16, 16);

                this.controller.textures[i] = new BattleCity.BreaksWest(this.controller.foreground, {
                    shape: rectangle
                });

//                this.controller.textures.erase(this.controller.textures[i]);
//                this.controller.textures[i].destroy();
            }
        }

        console.log(this.controller.textures);
    }
});
