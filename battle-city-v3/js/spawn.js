atom.declare('BattleCity.Spawn', App.Element, {

    configure: function() {
        this.isUsed = false;
        this.amount = 1;
        this.timeCreated = Date.now();
        this.spawnTimeOut = this.settings.get('spawnTimeOut');
        this.type = this.settings.get('type');
    },

    get controller() {
        return this.settings.get('controller');
    },

    onUpdate: function(time) {

        var now = Date.now();
        if (now > this.timeCreated + this.spawnTimeOut && !this.isUsed) {
            this.amount--;
            this.isUsed = true;
            this.timeCreated = now + this.spawnTimeOut;

            if (this.type == 'enemy') {
                var enemy = new BattleCity.Enemy(this.controller.units, {
                    size: this.settings.get('size'),
                    images: this.settings.get('images'),
                    shape: new Rectangle(this.shape.x, this.shape.y, 32, 32),
                    angle: this.settings.get('angle'),
                    controller: this.controller,
                    spawn: this
                });

                this.controller.enemies.push(enemy);
//                console.log('spwned!');

            } else if (this.type == 'player' && !this.controller.endGame) {
                var player = new BattleCity.Player(this.controller.units, {
                    size: this.settings.get('size'),
                    controls: { up: 'aup', down: 'adown', left: 'aleft', right: 'aright', fire: 'space' },
                    images: this.settings.get('images'),
                    shape: new Rectangle(this.shape.x, this.shape.y, 32, 32),
                    controller: this.controller,
                    spawn: this
                });

                this.controller.players.push(player);
            }
        }
    }

});