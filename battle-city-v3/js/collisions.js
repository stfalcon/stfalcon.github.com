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

    checkCollisionWithEnemies : function(shape, point, obj) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemies.length; i--;) {
            enemy = this.controller.enemies[i];

            if (enemy.shape.intersect(shape) && obj != enemy) {
                if (obj && obj.collideWithCharacters === false) {
                    return false;
                }

                if (obj && obj.shape.x == enemy.shape.x && obj.shape.y == enemy.shape.y) {
                    return false;
                }

                return true;
            }
        }

        return false;
    },

    checkCollisionWithPlayers : function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemies.length; i--;) {
            player = this.controller.players[i];

            if (player && player.shape.intersect(shape)) {

                return true;
            }
        }

        return false;
    },

    checkCollisionWithBullets : function(shape, point, obj) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemyBullets.length; i--;) {
            bullet = this.controller.enemyBullets[i];

            if (bullet && bullet.shape.intersect(shape) && obj.source instanceof BattleCity.Player
                && bullet.source instanceof BattleCity.Enemy) {
//                console.log(obj.source);
//                console.log(bullet.source);
                this.controller.enemyBullets.erase(bullet);
                console.log('lol');
                bullet.destroy();
                return true;
            }
        }

        return false;
    },

    destroyEnemies : function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemies.length; i--;) {
            enemy = this.controller.enemies[i];

            if (enemy && shape.intersect(enemy.shape)) {
                console.log('enemies: '+this.controller.enemies.length);
                enemy.animation.stop();
                this.controller.enemies.erase(enemy);
                enemy.destroy();
            }
        }
    },

    destroyPlayers : function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.players.length; i--;) {
            player = this.controller.players[i];

            if (player.shape.intersect(shape)) {
                this.controller.endGame = true;
                this.controller.game.endGameMessage();
                player.animation.stop();
                this.controller.players.erase(player);
                player.destroy();
            }
        }
    },

    // рушим стены
    destroyWalls : function(shape, point, angle) {
        var shape = shape.clone();
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
                } else if (field instanceof BattleCity.Base) {
                    var baseRectangle = new Rectangle(field.shape.from.x, field.shape.from.y, 32, 32);

                    this.controller.textures[i]= new BattleCity.BaseDestroyed(this.controller.foreground, {
                        shape: baseRectangle
                    });

                    this.controller.endGame = true;

                    this.controller.game.endGameMessage();
                }
            }
        }
    }
});
