/** @class BattleCity.Collisions */
atom.declare('BattleCity.Collisions', {

        initialize : function(controller) {

            this.controller = controller;
            this.players = [];
            this.textures = [];
            this.bullets = [];
        },

    // проверяем выезд за границы игрового поля
    checkOutOfTheField : function(shape, point) {
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
    checkCollisionWithTextures : function(shape, point) {
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
    destroyWalls : function(shape, point, angle) {
        var shape = shape.clone();
//        console.log(angle);
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (this.controller.textures[i].shape.intersect(shape)) {
                if (this.controller.textures[i] instanceof BattleCity.Breaks) {
                    var rectangle = new Rectangle(this.controller.textures[i].shape.from.x, this.controller.textures[i].shape.from.y, 16, 16);

                    switch (angle) {
                        case 90:
                            this.controller.textures[i] = new BattleCity.BreaksWest(this.controller.foreground, {
                                shape : rectangle
                            });
                            break;
                        case 270:
                            this.controller.textures[i] = new BattleCity.BreaksEast(this.controller.foreground, {
                                shape : rectangle
                            });
                            break;
                        case 0:
                            this.controller.textures[i] = new BattleCity.BreaksNorth(this.controller.foreground, {
                                shape : rectangle
                            });
                            break;
                        case 180:
                            this.controller.textures[i] = new BattleCity.BreaksSouth(this.controller.foreground, {
                                shape : rectangle
                            });
                            break;
                    }

                    this.controller.parted[i] = i;
                } else if (field instanceof BattleCity.BreaksWest ||
                    field instanceof BattleCity.BreaksEast ||
                    field instanceof BattleCity.BreaksNorth ||
                    field instanceof BattleCity.BreaksSouth) {

                    this.controller.textures.erase(field);
                    field.destroy();
                    this.controller.parted.erase(this.controller.parted[i]);
                    this.controller.parted[i] = 0;
                }
            }
        }
    }
});
