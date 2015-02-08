
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
    }
};

var Game = {
    then: 0,
    gameObjects: [],
    player: null,

    init: function () {
        requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

        View.init(window.innerWidth, window.innerHeight);

		
        this.player = new Player(50, 500);
        this.gameObjects.push(this.player);
		Spawner.init();

        window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
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
        this.collisions();

        // get rid of dead objects 
        this.gameObjects = this.gameObjects.filter(function (o) { return !o.dead; });
    },

    collisions: function () {
	
        for (var i = 0; i < this.getInvaders().length; i++) {
            for (var j = 0; j < this.getBullets().length; j++) {
                if (intersect(this.getInvaders()[i], this.getBullets()[j])) {
                    this.getInvaders()[i].dead = true;
                    this.getBullets()[j].dead = true;
                }
            }
        }
    },
	getBullets: function(){ 
		return this.gameObjects.filter(function(o) { return o.constructor == Bullet; });
	},
	getInvaders: function() {
		return this.gameObjects.filter(function(o) { return o.constructor == Invader; });
	},
    render: function (deltaTime) {
        View.clear();

        this.gameObjects.forEach(function (o) { o.draw(deltaTime); });

        World.debug_drawBorder();
    },
    addGameObject: function (o) {
        this.gameObjects.push(o);
    }

};
