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
	PAUSE: 80, //P

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
		document.getElementById("game-wrapper").appendChild(this.canvas);

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
	isRunning: false,
	then: 0,
	player: null,
	bullet: null,
	invaderBullets: [],
	bunkers: [],
	bunusShip: null,
	points: 0,
	lives: 0,

	init: function () {
		requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

		View.init(window.innerWidth, window.innerHeight);

		window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
		window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
		
		this.startLevel();

		Menu.DisplayMenu();
	},
	startLevel: function() {
		
		this.isRunning = true;
		
		this.bunkers = [];
		
		this.player = new Player(50, 500);
		this.bullet = new Bullet();
		this.player.bullet = this.bullet;
		this.bullet.dead = true;
				
		var bunker = null;
		for(var x = 0; x < 4; x++) {
			bunker = new Bunker(100 + x * 100, 350, 50, 50);
			this.bunkers.push(bunker);
		}
		
		this.bonusShip = new BonusShip(0,0);
		this.bonusShip.dead = true;
		
		InvadersGroup.createInvaders(); // TODO: this is confusing
		InvadersGroup.init(); 
		
		Spawner.init();
	},

	frame: function () {
		var now = Date.now();
		var delta = now - this.then;

		if(this.isRunning)
		{
			this.update(delta / 1000);
			this.render(delta / 1000);
		}

		Menu.update();

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
		var i = 0;
		
		Spawner.update(deltaTime);
		this.player.update(deltaTime);
		this.bullet.update(deltaTime);
		this.invaderBullets.forEach(function (o) { o.update(deltaTime); });
		this.bonusShip.update(deltaTime);
		InvadersGroup.update(deltaTime);
		
		this.collisions();

		// get rid of dead objects 
		this.invaderBullets = this.invaderBullets.filter(function (o) { return !o.dead; });
		

		if(InvadersGroup.posY + InvadersGroup.getBottomBoundaryYIndex() * InvadersGroup.CELL_HEIGHT + InvadersGroup.CELL_HEIGHT > 500) {
			this.lives--;
			this.startLevel();
			return;
		}	
		
		if(InvadersGroup.allDead()) {
			this.lives++;
			this.startLevel();
			return;
		}
		
	},

	collisions: function () {
		
		InvadersGroup.bulletCollision(this.bullet);
		
		for(i = 0; i < this.bunkers.length; i++) {
			if(!this.bullet.dead)
				this.bunkers[i].bulletCollision(this.bullet);
			
			for(j = 0; j < this.invaderBullets.length; j++){ 
				this.bunkers[i].bulletCollision(this.invaderBullets[j]);
			}
		}
		
		if(!this.bullet.dead) {
			if(intersect(this.bonusShip, this.bullet)) {
				this.bonusShip.dead = true;
				this.bullet.dead = true;
				this.points += 100;
			}
		}
			

		for(i = 0; i < this.invaderBullets.length; i++) {
			if(intersect(this.player, this.invaderBullets[i])) {
				this.invaderBullets[i].dead = true;
			}
		}
	},
	render: function (deltaTime) {
		View.clear();

		this.player.draw(deltaTime);
		this.bullet.draw(deltaTime);
		InvadersGroup.draw(deltaTime);
		this.invaderBullets.forEach(function (o) { o.draw(deltaTime); });
		this.bunkers.forEach(function (o) { o.draw(deltaTime); });
		this.bonusShip.draw(deltaTime);
		
		//World.debug_drawBorder();
		View.drawPoints(this.points);
		View.drawLives(this.lives);
	}

};

var Menu = {

	update: function(){
		if(Key.isDown(Key.PAUSE)){
			this.DisplayMenu();
			document.getElementById("options").style.display = "none";
		}
	},

	DisplayMenu: function(){
		Game.isRunning = false;
		document.getElementById("menu").style.display = "block";
	},

	Play: function(){
		Game.isRunning = true;
		document.getElementById("menu").style.display = "none";

	},

	Options: function(){
		document.getElementById("options").style.display = "block";
	},

	Credits: function(){

	},

	Exit: function(){
		window.close();
	},
};
