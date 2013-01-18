/** @class BattleCity.Controller */
atom.declare( 'BattleCity.Controller', {
    initialize: function () {
        this.app = new App({ size: new Size(416, 416) });

        // отдельный слой для текстур, который будем перерисовывать только по команде
        this.textures = this.app.createLayer({
            name: 'textures',
            intersection: 'manual',
            zIndex: 2
        });

        atom.ImagePreloader.run({
            player : 'tank.png',
            textures : 'textures.png'
        }, this.start.bind(this));

        this.fpsMeter();
    },

    fpsMeter: function () {
        var fps = atom.trace(), time = [], last = Date.now();

        atom.frame.add(function () {
            if (time.length > 5) time.shift();

            time.push( Date.now() - last );
            last = Date.now();

            fps.value = Math.ceil(1000 / time.average()) + " FPS";
        });
    },

    start: function (images) {
        // images ready
        this.app.resources.set('images', images);

        var data = this.constructor.levels[0];

        // построение уровня
        for (var y = 0; y < 26; y++) {
            s = data[y];
            for (var x = 0; x < 26; x++) {
                var image = null;
                switch(s.charAt(x)) {
                    case '#':
                        new BattleCity.Wall(this.textures, {
                            shape: new Rectangle(x*16, y*16, 16, 16)
                        });
                    case '=':
                        new BattleCity.Breaks(this.textures, {
                            shape: new Rectangle(x*16, y*16, 16, 16)
                        });
                        break;
                    case '*':
                        new BattleCity.Trees(this.textures, {
                            shape: new Rectangle(x*16, y*16, 16, 16)
                        });
                        break;
                }
            }
        }
    }
}).own({
    levels: [
        [
            "**          **          **",
            "**          **          **",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==##==  ==  ==  ",
            "  ==  ==  ==##==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==          ==  ==  ",
            "  ==  ==          ==  ==  ",
            "          ==  ==          ",
            "          ==  ==          ",
            "==  ====          ====  ==",
            "##  ====          ====  ##",
            "          ==  ==          ",
            "          ======          ",
            "  ==  ==  ======  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==  ==  ==  ==  ==  ",
            "  ==  ==          ==  ==  ",
            "  ==  ==          ==  ==  ",
            "  ==  ==   ====   ==  ==  ",
            "           =**=           ",
            "           =**=           "
        ]
    ]
});