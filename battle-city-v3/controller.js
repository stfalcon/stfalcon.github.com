/** @class BattleCity.Controller */
atom.declare( 'BattleCity.Controller', {
    initialize: function () {
        atom.ImagePreloader.run({
            player : 'tank.png',
            textures : 'textures.png'
        }, this.start.bind(this));
    },

    start: function (images) {
        this.size = new Size(416, 416);
        this.app = new App({ size: this.size });

        // images ready
        this.app.resources.set('images', images);

        // отдельный слой для текстур, который будем перерисовывать только по команде
        this.textures = this.app.createLayer({
            name: 'textures',
            intersection: 'manual',
            zIndex: 2
        });

        // слой для юнитов, перерисовываем постоянно
        this.units = this.app.createLayer({
            name: 'units',
            invoke: true,
            zIndex: 3
        });

        // игрок
        this.player = new BattleCity.Player(this.units, {
            size: this.size,
            controls: { up: 'aup', down: 'adown', left: 'aleft', right: 'aright' },
            images: images
        });

        // построение уровня
        var data = this.constructor.levels[0];
        for (var y = 0; y < 26; y++) {
            s = data[y];
            for (var x = 0; x < 26; x++) {
                var rectangle = new Rectangle(x*16, y*16, 16, 16);
                switch(s.charAt(x)) {
                    case '#':
                        new BattleCity.Wall(this.textures, {
                            shape: rectangle
                        });
                    case '=':
                        new BattleCity.Breaks(this.textures, {
                            shape: rectangle
                        });
                        break;
                    case '*':
                        new BattleCity.Trees(this.textures, {
                            shape: rectangle
                        });
                        break;
                }
            }
        }

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