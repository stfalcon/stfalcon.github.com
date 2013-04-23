/** @class BattleCity.Game */
atom.declare('BattleCity.Game', {
    initialize : function(controller) {
//        this.bindMethods('update');

        this.controller = controller;
        this.players = [];
        this.textures = [];
        this.bullets = [];
//        this.enemies = [];
    },
    /** @private */
    getArray : function(item) {
        var a = item instanceof BattleCity.Wall ? this.textures :
            item instanceof BattleCity.Bullet ? this.bullets :
//            item instanceof BattleCity.Enemy ? this.enemies :
            item instanceof BattleCity.Player ? this.players : null;

        if (a == null)
            throw new TypeError('unknown type of ' + item);

        return a;
    },
    add : function(item) {
        this.getArray(item).push(item);
        return this;
    },
    remove : function(item) {
        this.getArray(item).erase(item);
        return this;
    },
    update : function() {
//        console.log(new Date().getTime());
//        this.shipsAsteroids();
//        this.bulletsAsteroids();
    }
});
