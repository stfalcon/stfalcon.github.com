/** @class BattleCity.Collisions */
atom.declare('BattleCity.Collisions', {

    initialize: function(controller) {

        this.controller = controller;
        this.players = [];
        this.textures = [];
        this.bullets = [];
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

    checkCollisionWithEnemies: function(shape, point, obj) {
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

    checkCollisionWithPlayers: function(shape, point) {
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

    checkCollisionWithBullets: function(shape, point, obj) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemyBullets.length; i--;) {
            bullet = this.controller.enemyBullets[i];

            if (bullet && bullet.shape.intersect(shape) && obj.source instanceof BattleCity.Player
                && bullet.source instanceof BattleCity.Enemy) {
                bullet.destroy();
                return true;
            }
        }

        return false;
    },

    destroyEnemies: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.enemies.length; i--;) {
            enemy = this.controller.enemies[i];

            if (enemy && shape.intersect(enemy.shape)) {
                console.log('enemies: ' + this.controller.enemies.length);
                var x = enemy.shape.x;
                var y = enemy.shape.y;
                BattleCity.Message(this.controller.info, {
                    controller: this.controller,
                    shape: new Rectangle({
                            from: new Point(x, y),
                            size: new Size(64, 64)}
                    ),
                    value: '100'
                });
                enemy.animation.stop();
                enemy.spawn.isUsed = false;
                this.controller.enemies.erase(enemy);
                enemy.destroy();
                this.controller.score += 100;
                console.log('score: ' + this.controller.score);
            }
        }
    },

    destroyPlayers: function(shape, point) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения

        for (i = this.controller.players.length; i--;) {
            player = this.controller.players[i];

            if (player.shape.intersect(shape)) {
                player.animation.stop();
                player.spawn.isUsed = false;
                this.controller.players.erase(player);
                this.controller.playerLives--;
                player.destroy();

                if (this.controller.playerLives == 0) {
                    this.controller.endGame = true;
                    this.controller.game.endGameMessage();
                }
            }
        }
    },

    // рушим стены
    destroyWalls: function(shape, point, angle) {
        var shape = shape.clone();
        shape.move(point); // сначала двигаем клонированный объект, а потом ищем столкновения
        var destroyedAmount = 0;

        for (i = this.controller.textures.length; i--;) {
            field = this.controller.textures[i];

            if (this.controller.textures[i].shape.intersect(shape)) {
                destroyedAmount++;
                console.log(destroyedAmount);

                var rectangle = new Rectangle(
                    this.controller.textures[i].shape.from.x,
                    this.controller.textures[i].shape.from.y,
                    16,
                    16
                );

                if (this.controller.textures[i] instanceof BattleCity.Breaks) {

                    switch (angle) {
                        case 90:
                            this.controller.textures[i] = new BattleCity.BreaksWest(this.controller.foreground, {
                                shape: rectangle
                            });
                            break;
                        case 270:
                            this.controller.textures[i] = new BattleCity.BreaksEast(this.controller.foreground, {
                                shape: rectangle
                            });
                            break;
                        case 0:
                            this.controller.textures[i] = new BattleCity.BreaksNorth(this.controller.foreground, {
                                shape: rectangle
                            });
                            break;
                        case 180:
                            this.controller.textures[i] = new BattleCity.BreaksSouth(this.controller.foreground, {
                                shape: rectangle
                            });
                            break;
                    }

                    this.controller.parted[i] = i;
                } else if (field instanceof BattleCity.BreaksWest) {
                    if (angle == 0) {
                        this.controller.textures[i] = new BattleCity.BreaksWestSouthPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else if (angle == 180) {
                        this.controller.textures[i] = new BattleCity.BreaksWestNorthPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                        this.controller.parted.erase(this.controller.parted[i]);
                        this.controller.parted[i] = 0;
                    }
                } else if (field instanceof BattleCity.BreaksEast) {
                    if (angle == 0) {
                        this.controller.textures[i] = new BattleCity.BreaksEastSouthPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else if (angle == 180) {
                        this.controller.textures[i] = new BattleCity.BreaksEastNorthPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                        this.controller.parted.erase(this.controller.parted[i]);
                        this.controller.parted[i] = 0;
                    }
                } else if (field instanceof BattleCity.BreaksNorth) {
                    if (angle == 90) {
                        this.controller.textures[i] = new BattleCity.BreaksNorthWestPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else if (angle == 270) {
                        this.controller.textures[i] = new BattleCity.BreaksNorthEastPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                        this.controller.parted.erase(this.controller.parted[i]);
                        this.controller.parted[i] = 0;
                    }
                } else if (field instanceof BattleCity.BreaksSouth) {
                    if (angle == 90) {
                        this.controller.textures[i] = new BattleCity.BreaksSouthWestPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else if (angle == 270) {
                        this.controller.textures[i] = new BattleCity.BreaksSouthEastPart(this.controller.foreground, {
                            shape: rectangle
                        });
                    } else {
                        this.controller.textures.erase(field);
                        field.destroy();
                        this.controller.parted.erase(this.controller.parted[i]);
                        this.controller.parted[i] = 0;
                    }
                } else if (field instanceof BattleCity.Base) {
                    var baseRectangle = new Rectangle(field.shape.from.x, field.shape.from.y, 32, 32);

                    this.controller.textures[i] = new BattleCity.BaseDestroyed(this.controller.foreground, {
                        shape: baseRectangle
                    });

                    this.controller.endGame = true;

                    this.controller.game.endGameMessage();
                } else  if (
                    field instanceof BattleCity.BreaksWestSouthPart ||
                    field instanceof BattleCity.BreaksWestNorthPart ||
                    field instanceof BattleCity.BreaksEastSouthPart ||
                    field instanceof BattleCity.BreaksEastNorthPart ||
                    field instanceof BattleCity.BreaksNorthWestPart ||
                    field instanceof BattleCity.BreaksNorthEastPart ||
                    field instanceof BattleCity.BreaksSouthWestPart ||
                    field instanceof BattleCity.BreaksSouthEastPart
                    ){
                    this.controller.textures.erase(field);
                    field.destroy();
                    this.controller.parted.erase(this.controller.parted[i]);
                    this.controller.parted[i] = 0;
                    return;
                }
            }
        }
    }
});
