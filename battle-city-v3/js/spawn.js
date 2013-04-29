atom.declare('BattleCity.Spawn', App.Element, {

    configure: function() {
        this.isUsed = false;
        this.amount = 1;
        this.timeCreated = Date.now();
        this.spawnTimeOut = this.settings.get('spawnTimeOut');
    },

    get controller() {
        return this.settings.get('controller');
    },

    onUpdate: function(time) {

        var now = Date.now();
        if (now > this.timeCreated + this.spawnTimeOut && !this.isUsed
            && !this.controller.collisions.checkCollisionWithPlayers(this.shape, new Point(0, 0))
            && !this.controller.collisions.checkCollisionWithEnemies(this.shape, new Point(0, 0))
            ) {
            this.amount--;
            this.isUsed = true;
            this.timeCreated = now;

            var enemy = new BattleCity.Enemy(this.controller.units, {
                size: this.settings.get('size'),
                images: this.settings.get('images'),
                shape: new Rectangle(this.shape.x, this.shape.y, 32, 32),
                angle: this.settings.get('angle'),
                controller: this.controller,
                spawn: this
            });

            this.controller.enemies.push(enemy);
            console.log('spwned!');
        }
    }

});