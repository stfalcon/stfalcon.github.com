/** @class BattleCity.Collisions */
atom.declare('BattleCity.Collisions', {

    initialize: function (controller) {
        this.controller = controller;
        this.players = [];
        this.textures = [];
        this.bullets = [];
    },

    // проверяем выезд за границы игрового поля
    checkOutOfTheField: function (shape, point) {
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
    checkCollisionWithTextures: function (shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (field.shape.intersect(shape)) {
                if (field instanceof BattleCity.Trees || field instanceof BattleCity.Asphalt) {
                    return false;
                }

                return field;
            }
        }

        return false;
    },

    // рушим стены
    destroyWalls: function(shape, point, angle) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения
        var destroyedAmount = 0;
        var firstState = null;
        var secondState = null;

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (this.controller.textures[i].shape.intersect(shape)) {
                destroyedAmount++;

                var rectangle = new Rectangle(
                    this.controller.textures[i].shape.from.x,
                    this.controller.textures[i].shape.from.y,
                    16,
                    16
                );

                // Рушим часть стены в зависимости от её текущего состояния и от направления полета пули
                if (this.controller.textures[i] instanceof BattleCity.Breaks) { // Рушим половину стены
                    var state = this.controller.textures[i].settings.values.state;
                    var removed = false;

                    if (destroyedAmount == 1) {
                        firstState = state;
                    } else if (destroyedAmount == 2) {
                        secondState = state;
                        if (firstState != secondState) {
                            return;
                        }
                    }

                    if (state === 'intact') {
                        switch (angle) {
                            case 90:
                                state = 'W';
                                break;
                            case 270:
                                state = 'E';
                                break;
                            case 0:
                                state = 'S';
                                break;
                            case 180:
                                state = 'N';
                                break;
                        }
                    } else if (state === 'W') {
                        switch (angle) {
                            case 0:
                                state = 'WS';
                                break;
                            case 180:
                                state = 'WN';
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                                removed = true;
                        }
                    } else if (state === 'E') {
                        switch (angle) {
                            case 0:
                                state = 'ES';
                                break;
                            case 180:
                                state = 'EN';
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                                removed = true;
                        }
                    } else if (state === 'S') {
                        switch (angle) {
                            case 90:
                                state = 'SW';
                                break;
                            case 270:
                                state = 'SE';
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                                removed = true;
                        }
                    } else if (state === 'N') {
                        switch (angle) {
                            case 90:
                                state = 'NW';
                                break;
                            case 270:
                                state = 'NE';
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                                removed = true;
                        }
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                        removed = true;
                        return;
                    }

                    if (!removed) {
                        this.controller.textures[i] = new BattleCity.Breaks(this.controller.walls, {
                            shape: rectangle,
                            state: state
                        });
                    }
                }
            }
        }
    }
});