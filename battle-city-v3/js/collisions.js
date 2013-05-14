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
        var first = null;
        var second = null;

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

                if (destroyedAmount == 1) {
                    first = field;
                } else if (destroyedAmount == 2) {
                    second = field;

                    if (first.Constructor != second.Constructor) {
                        return;
                    }
                }

                // Рушим часть стены в зависимости от её текущего состояния и от направления полета пули
                if (this.controller.textures[i] instanceof BattleCity.Breaks) { // Рушим половину стены
                    var state = this.controller.textures[i].settings.values.state;

                    if (state === 'intact') {
                        this.controller.textures[i] = new BattleCity.Breaks(this.controller.walls, {
                            shape: rectangle,
                            state: state
                        });

                        switch (angle) {
                            case 90:
                                this.controller.textures[i].settings.values.state = 'W';
                                break;
                            case 270:
                                this.controller.textures[i].settings.values.state = 'E';
                                break;
                            case 0:
                                this.controller.textures[i].settings.values.state = 'S';
                                break;
                            case 180:
                                this.controller.textures[i].settings.values.state = 'N';
                                break;
                        }
                    } else if (state === 'W') {
                        switch (angle) {
                            case 0:
                                break;
                            case 180:
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                        }
                    } else if (state === 'E') {
                        switch (angle) {
                            case 0:
                                break;
                            case 180:
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                        }
                    } else if (state === 'S') {
                        switch (angle) {
                            case 90:
                                break;
                            case 270:
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                        }
                    } else if (state === 'N') {
                        switch (angle) {
                            case 90:
                                break;
                            case 270:
                                break;
                            default:
                                this.controller.textures.erase(field);
                                field.destroy();
                        }
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                    }
//
//                    this.controller.parted[i] = i;
                }
//                else if (field instanceof BattleCity.BreaksWest) { // Отбиваем четверть западной стены или рушим
//                    // её полностью
//                    if (angle == 0) {
//                        this.controller.textures[i] = new BattleCity.BreaksWestSouthPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else if (angle == 180) {
//                        this.controller.textures[i] = new BattleCity.BreaksWestNorthPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else {
//                        this.controller.textures.erase(field);
//                        field.destroy();
//                        this.controller.parted.erase(this.controller.parted[i]);
//                        this.controller.parted[i] = 0;
//                    }
//                } else if (field instanceof BattleCity.BreaksEast) { // Отбиваем четверть восточной стены или рушим
//                    // её полностью
//                    if (angle == 0) {
//                        this.controller.textures[i] = new BattleCity.BreaksEastSouthPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else if (angle == 180) {
//                        this.controller.textures[i] = new BattleCity.BreaksEastNorthPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else {
//                        this.controller.textures.erase(field);
//                        field.destroy();
//                        this.controller.parted.erase(this.controller.parted[i]);
//                        this.controller.parted[i] = 0;
//                    }
//                } else if (field instanceof BattleCity.BreaksSouth) { // Отбиваем четверть южной стены или рушим
//                    // её полностью
//                    if (angle == 90) {
//                        this.controller.textures[i] = new BattleCity.BreaksSouthWestPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else if (angle == 270) {
//                        this.controller.textures[i] = new BattleCity.BreaksSouthEastPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else {
//                        this.controller.textures.erase(field);
//                        field.destroy();
//                        this.controller.parted.erase(this.controller.parted[i]);
//                        this.controller.parted[i] = 0;
//                    }
//                } else if (field instanceof BattleCity.BreaksNorth) { // Отбиваем четверть северной стены или рушим
//                    // её полностью
//                    if (angle == 90) {
//                        this.controller.textures[i] = new BattleCity.BreaksNorthWestPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else if (angle == 270) {
//                        this.controller.textures[i] = new BattleCity.BreaksNorthEastPart(this.controller.walls, {
//                            shape: rectangle
//                        });
//                    } else {
//                        this.controller.textures.erase(field);
//                        field.destroy();
//                        this.controller.parted.erase(this.controller.parted[i]);
//                        this.controller.parted[i] = 0;
//                    }
//                } else  if (
//                    field instanceof BattleCity.BreaksWestSouthPart ||
//                        field instanceof BattleCity.BreaksWestNorthPart ||
//                        field instanceof BattleCity.BreaksEastSouthPart ||
//                        field instanceof BattleCity.BreaksEastNorthPart ||
//                        field instanceof BattleCity.BreaksNorthWestPart ||
//                        field instanceof BattleCity.BreaksNorthEastPart ||
//                        field instanceof BattleCity.BreaksSouthWestPart ||
//                        field instanceof BattleCity.BreaksSouthEastPart
//                    ) { // Уничтожаем оставшийся кирпич (четверть стены)
//                    this.controller.textures.erase(field);
//                    field.destroy();
//                    this.controller.parted.erase(this.controller.parted[i]);
//                    this.controller.parted[i] = 0;
//                    return;
//                }
            }
        }
    }
});