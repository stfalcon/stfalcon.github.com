/** @class BattleCity.Controller */
atom.declare( 'BattleCity.Controller', {

    texturesFields: [],

    initialize: function () {
        atom.ImagePreloader.run({
            player : 'tank.png [64:32]{0:0}',
            player2 : 'tank.png [64:32]{1:0}',
            player3 : 'tank.png [64:32]{2:0}',
            player4 : 'tank.png [64:32]{3:0}',
            textures : 'textures.png'
        }, this.start.bind(this));

        this.fpsMeter();
    },

    start: function (images) {
        this.game = new BattleCity.Game(this);
        atom.frame.add(this.game.update);

        this.size = new Size(416, 416);

        this.app = new App({ size: this.size });

        // images ready
        this.app.resources.set('images', images);

        // слой для фона и нижних текстур (вода и асфальт)
        this.background = this.app.createLayer({
            name: 'background',
            intersection: 'manual',
            zIndex: 1
        });
        this.background.ctx.fillAll('black');

        // слой для верхних текстур
        this.textures = this.app.createLayer({
            name: 'textures',
            intersection: 'manual',
            zIndex: 3
        });

        // слой для юнитов, перерисовываем постоянно
        this.units = this.app.createLayer({
            name: 'units',
            invoke: true,
            zIndex: 2
        });

        // игрок
        this.player = new BattleCity.Player(this.units, {
            size: this.size,
            controls: { up: 'aup', down: 'adown', left: 'aleft', right: 'aright' },
            images: images,
            controller: this
        });

        // координатная сетка (для дебага)
//        for (var y = 0; y < 52; y++) {
//            for (var x = 0; x < 52; x++) {
//                this.textures.ctx.fillStyle   = 'red'; // blue
//                this.textures.ctx.fillRect(x*8, y*8, 1, 1);
//            }
//        }

        // построение уровня
        var data = this.constructor.levels[0];
        for (var y = 0; y < 26; y++) {
            s = data[y];
            for (var x = 0; x < 26; x++) {
                var textureField = null;
                var rectangle = new Rectangle(x*16, y*16, 16, 16);
                switch(s.charAt(x)) {
                    case '#':
                        textureField = new BattleCity.Wall(this.textures, {
                            shape: rectangle
                        });
                    case '=':
                        textureField = new BattleCity.Breaks(this.textures, {
                            shape: rectangle
                        });
                        break;
                    case '*':
                        textureField = new BattleCity.Trees(this.textures, {
                            shape: rectangle
                        });
                        break;
                    case '~':
                        textureField = new BattleCity.Water(this.background, {
                            shape: rectangle
                        });
                        break;
                    case '>':
                        textureField = new BattleCity.Asphalt(this.background, {
                            shape: rectangle
                        });
                        break;
                }

                if (textureField) {
                    this.texturesFields.push(textureField);
                }
            }
        }
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