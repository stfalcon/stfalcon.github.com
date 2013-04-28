/** @class BattleCity.Controller */
atom.declare( 'BattleCity.Controller', {

    textures: [],
    parted: [],
    enemies: [],
    players: [],
    enemyBullets: [],
    endGame : false,

    initialize: function () {
        atom.ImagePreloader.run({
            player: 'images/tank.png [64:32]{0:0}',
            player2: 'images/tank.png [64:32]{1:0}',
            player3: 'images/tank.png [64:32]{2:0}',
            player4: 'images/tank.png [64:32]{3:0}',
            textures: 'images/textures.png',
            base: 'images/base.png',
            baseDestroyed: 'images/base_destroyed.png',
            bullet: 'images/bullet.png',
            bang: 'images/bang.png'
        }, this.start.bind(this));

        this.fpsMeter();
    },

    start: function (images) {
        this.game = new BattleCity.Game(this);
        this.collisions = new BattleCity.Collisions(this);
        atom.frame.add(this.game.update);

        this.size = new Size(416, 416);

        this.app = new App({ size: this.size });

        // images ready
        this.app.resources.set('images', images);

        this.sounds = new BattleCity.Sounds('sounds/');

        // слой для фона и нижних текстур (вода и асфальт)
        this.background = this.app.createLayer({
            name: 'background',
            intersection: 'manual',
            zIndex: 1
        });
        this.background.ctx.fillAll('black');

        // слой для верхних текстур
        this.foreground = this.app.createLayer({
            name: 'foreground',
            intersection: 'manual',
            zIndex: 3
        });

        this.info = this.app.createLayer({
            name: 'info',
            invoke: true,
            intersection: 'manual',
            zIndex: 4
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
            controls: { up: 'aup', down: 'adown', left: 'aleft', right: 'aright', fire: 'space' },
            images: images,
            controller: this
        });
        this.players.push(this.player);

        this.enemy = new BattleCity.Enemy(this.units, {
            size: this.size,
            images: images,
            shape: new Rectangle(192, 176, 32, 32),
            angle: 270,
            controller: this,
            collideWithCharacters: true
        });
        this.enemies.push(this.enemy);

        this.enemy = new BattleCity.Enemy(this.units, {
            size: this.size,
            images: images,
            shape: new Rectangle(128, 240, 32, 32),
            angle: 0,
            controller: this,
            collideWithCharacters: true
        });
        this.enemies.push(this.enemy);

        // координатная сетка (для дебага)
        for (var y = 0; y < 52; y++) {
            for (var x = 0; x < 52; x++) {
                this.info.ctx.fillStyle   = 'red'; // blue
                this.info.ctx.fillRect(x*8, y*8, 1, 1);
            }
        }

        // построение уровня
        var data = this.constructor.levels[0];
        for (var y = 0; y < 26; y++) {
            s = data[y];
            for (var x = 0; x < 26; x++) {
                var field = null;
                var rectangle = new Rectangle(x*16, y*16, 16, 16);
                var baseRectangle = new Rectangle(x*16, y*16, 32, 32);

                switch(s.charAt(x)) {
                    case '#':
                        field = new BattleCity.Wall(this.foreground, {
                            shape: rectangle
                        });
                        break;
                    case '=':
                        field = new BattleCity.Breaks(this.foreground, {
                            shape: rectangle
                        });
                        break;
                    case '*':
                        field = new BattleCity.Trees(this.foreground, {
                            shape: rectangle
                        });
                        break;
                    case '~':
                        field = new BattleCity.Water(this.background, {
                            shape: rectangle
                        });
                        break;
                    case '>':
                        field = new BattleCity.Asphalt(this.background, {
                            shape: rectangle
                        });
                        break;
                    case 'B':
                        field = new BattleCity.Base(this.foreground, {
                            shape: baseRectangle
                        });
                        break;
                }

                if (field) {
                    this.textures.push(field);
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
            "                          ",
            "                          ",
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
            "           =B =           ",
            "           =  =           "
        ]
    ]
});