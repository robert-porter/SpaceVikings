
var World = {
    WIDTH: 600,
    HEIGHT: 600,

    debug_drawBorder: function () {
        View.ctx.beginPath();
        View.ctx.moveTo(0, 0);
        View.ctx.lineTo(this.WIDTH, 0);
        View.ctx.lineTo(this.WIDTH, this.HEIGHT);
        View.ctx.lineTo(0, this.HEIGHT);
        View.ctx.lineTo(0, 0);
        View.ctx.stroke();
    }
};

var Key = {
    pressed: {},

    LEFT: 37, // left arrow
    RIGHT: 39, // right arrow
    SHOOT: 32, // space

    isDown: function (keyCode) {
        return this.pressed[keyCode];
    },

    onKeydown: function (event) {
        this.pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        this.pressed[event.keyCode] = false;
    }
};

var View = {

    init: function (w, h) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = w;
        this.canvas.height = h;
        document.body.appendChild(this.canvas);

    },

    clear: function (color) {

        // Store the current transformation matrix
        this.ctx.save();

        // Use the identity matrix while clearing the canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Restore the transform
        this.ctx.restore();
    }, 
	drawPoints: function(points) {
		this.ctx.font="20px Andale Mono";
		this.ctx.fillText("POINTS: " + points, 10, 50);
	}, 
	drawLives: function(lives) {
		this.ctx.font = "20px Andale Mono";
		this.ctx.fillText("LIVES: " + lives, 500, 50);	
	}
};

var Game = {
    then: 0,
    gameObjects: [],
    player: null,
	points: 0,
	lives: 0,

    init: function () {
        requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

        View.init(window.innerWidth, window.innerHeight);

        window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
		
		this.startLevel();
		
				

    },
	startLevel: function() {
		this.gameObjects = [];
		
        this.player = new Player(50, 500);
        this.gameObjects.push(this.player);
		
		var bunker = null;
		for(var x = 0; x < 4; x++) {
			bunker = new Bunker(100 + x * 100, 350, 50, 50);
			this.gameObjects.push(bunker);
		}
		
		InvadersUpdater.init();
		Spawner.init();
	},

    frame: function () {
        var now = Date.now();
        var delta = now - this.then;

        this.update(delta / 1000);
        this.render(delta / 1000);

        this.then = now;
        var that = this;
        requestAnimationFrame(function () { that.frame() });
    },
    addKeyListener: function (listener) {
        window.addEventListener('keydown', listener, false);
    },
    run: function () {
        this.then = Date.now();
        this.frame();
    },

    update: function (deltaTime) {
        Spawner.update(deltaTime);

        this.gameObjects.forEach(function (o) { o.update(deltaTime); });
		var invaders = this.getInvaders();
		InvadersUpdater.update(deltaTime, invaders);
		
        this.collisions();

        // get rid of dead objects 
        this.gameObjects = this.gameObjects.filter(function (o) { return !o.dead; });
    },

    collisions: function () {
	
		var invaders = this.getInvaders();
		var bullets = this.getBullets();
		var bunkers = this.getBunkers();
		var bonusShips = this.getBonusShips();
		
        for (var i = 0; i < invaders.length; i++) {
            for (var j = 0; j < bullets.length; j++) {
                if (intersect(invaders[i], bullets[j])) {
                    invaders[i].dead = true;
                    bullets[j].dead = true;
					this.points += 20;
                }
            }
        }
		
		for(i = 0; i < bunkers.length; i++) {
			for(j = 0; j < bullets.length; j++) {
				bunkers[i].bulletCollision(bullets[j]);
			}
		}
		
		for(i = 0; i < bonusShips.length; i++) {
			for(j = 0; j < bullets.length; j++) {
				if(intersect(bonusShips[i], bullets[j])) {
					bonusShips[i].dead = true;
					bullets[j].dead = true;
					this.points += 100;
				}
			}
		}
		
		for(i = 0; i < invaders.length; i++) {
			if(invaders[i].y > 500) {
				this.lives--;
				this.startLevel();
				return;
			}
		}
    },
	getBullets: function(){ 
		return this.gameObjects.filter(function(o) { return o.constructor == Bullet; });
	},
	getInvaders: function() {
		return this.gameObjects.filter(function(o) { return o.constructor == Invader; });
	},
	getBunkers: function() {
		return this.gameObjects.filter(function(o) { return o.constructor == Bunker; });
	},
	getBonusShips: function() {
		return this.gameObjects.filter(function(o) { return o.constructor == BonusShip; });
	},
    render: function (deltaTime) {
        View.clear();

        this.gameObjects.forEach(function (o) { o.draw(deltaTime); });

        World.debug_drawBorder();
		View.drawPoints(this.points);
		View.drawLives(this.lives);
    },
    addGameObject: function (o) {
        this.gameObjects.push(o);
    }

};
