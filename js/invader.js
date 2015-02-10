
Invader.prototype = Object.create(GameObject.prototype);
Invader.prototype.constructor = Invader;

function Invader(x, y) {
	GameObject.call(this);
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.velX = 0;
	this.velY = 0;
}

function AudioBank(file, count) {
	this.bank = [];
	for(var i = 0; i < count; i++) {
		this.bank[i] = new Audio(file);
	}
	this.last = 0;
}

AudioBank.prototype.play = function() {
	this.last = (this.last + 1) % this.bank.length;
	this.bank[this.last].play();
}

var InvadersGroup = {

	LEFT: 0,
    RIGHT: 1,
    DOWN_TO_LEFT: 2,
    DOWN_TO_RIGHT: 3,
	
	NUM_ROWS: 5,
	NUM_COLS: 11,
	
	HORIZONTAL_MOVEMENT: 12, // should be a multiple the of size of an invader cell 
	VERTICAL_MOVEMENT: 12, // does not need to be a multiple the of size of an invader cell 
	
	dir:0,
	moveInterval: 1000,
	moveStart: Date.now(),
	numMoves: 0,
	
	audio: [new AudioBank("audio/snd1.mp3", 4),
			new AudioBank("audio/snd2.mp3", 4),
			new AudioBank("audio/snd3.mp3", 4),
			new AudioBank("audio/snd4.mp3", 4)	],
	currentAudio: 0,
	invaders: [],

	init: function() {
		this.moveInterval = 1000;
		this.moveStart = Date.now();
		this.numMoves = 0;
		this.dir = 0;
	},
	createInvaders: function(){
		Game.invaders = [];
		
		var invader = null;
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for (var x = 0; x < this.NUM_COLS; x++) {
				invader = new Invader(World.WIDTH * 0.5 - 250 + x * 50, y * 50);
				this.invaders.push(invader);
				Game.invaders.push(invader);
			}
		}
	},
	bulletCollision: function(bullet) {
		for (var i = 0; i < this.invaders.length; i++) {
			if(!bullet.dead && !this.invaders[i].dead) {
				if (intersect(this.invaders[i], bullet)) {
					this.invaders[i].dead = true;
					bullet.dead = true;
					Game.points += 20;
				}
			}
            
		}
	},
	invadersInFront: function(col, row) {
		for(var y = this.NUM_ROWS-1; y > row; y--) {
			if(!this.invaders[col + y * this.NUM_COLS].dead)
				return true;
		}
		return false;
	},
	tryShoot: function(deltaTime) {
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for (var x = 0; x < this.NUM_COLS; x++) {
				if(!this.invadersInFront(x, y)) {
					if(Math.random() < 0.05) {
						var index = x + y * this.NUM_COLS;
						var invaderBullet = new InvaderBullet(this.invaders[index].x, this.invaders[index].y);
						Game.invaderBullets.push(invaderBullet);
					}
				}
			}
		}		
	},
	move: function(deltaTime) {
		this.currentAudio = (this.currentAudio + 1) % this.audio.length;
		this.audio[this.currentAudio].play();
		
		var HORIZONTAL_MOVEMENT = this.HORIZONTAL_MOVEMENT;
		var VERTICAL_MOVEMENT = this.VERTICAL_MOVEMENT;
		
		if (this.dir == this.RIGHT) {
			this.invaders.forEach(function(o) { o.x = o.x + HORIZONTAL_MOVEMENT; });
		}
		else if (this.dir == this.LEFT) {
			this.invaders.forEach(function(o) { o.x = o.x - HORIZONTAL_MOVEMENT; });
		}
		else if (this.dir == this.DOWN_TO_LEFT || this.dir == this.DOWN_TO_RIGHT) {
			this.invaders.forEach(function(o) { o.y = o.y + VERTICAL_MOVEMENT; });
		}							
		
		this.numMoves++;
	
		this.tryShoot();
	},
	down: function(dir) {
		if (dir == this.RIGHT) {
			return this.DOWN_TO_LEFT;
		}
		else if (dir == this.LEFT) {
			return this.DOWN_TO_RIGHT;
		}
		
	}, 
	turn: function(dir) {
		if (dir == this.DOWN_TO_LEFT) {
			return this.LEFT;
		}
		if (dir == this.DOWN_TO_RIGHT) {
			return this.RIGHT;
		}	
	},
	update: function(deltaTime) {

		var now = Date.now();
		var moveTime = now - this.moveStart;
		
		if(moveTime > this.moveInterval) {
			this.move();
			this.moveStart = now;
		}
		
		// not correct, need to check for edge of map collision...
		if(this.numMoves == 10) {
			this.dir = this.down(this.dir);
		}
		if(this.numMoves == 11) {
			this.dir = this.turn(this.dir);
			this.moveInterval = this.moveInterval * 0.7;
			this.numMoves = 0;
		}
	}
	
};

Invader.prototype.update = function (deltaTime) { }
