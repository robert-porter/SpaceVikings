
Invader.prototype = Object.create(GameObject.prototype);
Invader.prototype.constructor = Invader;

function Invader(x, y) {
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

var InvadersUpdater = {
	moveInterval: 1000,
	moveStart: Date.now(),
	numMoves: 0,
	LEFT: 0,
    RIGHT: 1,
    DOWN_TO_LEFT: 2,
    DOWN_TO_RIGHT: 3,
    dir:0,
	audio: [new AudioBank("audio/snd1.mp3", 4),
			new AudioBank("audio/snd2.mp3", 4),
			new AudioBank("audio/snd3.mp3", 4),
			new AudioBank("audio/snd4.mp3", 4)	],
	currentAudio: 0,
	invadersGrid: [],

	init: function() {
		this.moveInterval = 1000;
		this.moveStart = Date.now();
		this.numMoves = 0;
		this.dir = 0;
	},
	createInvaders: function(){
		var invader = null;
		for(var y = 0; y < 5; y++) {
			for (var x = 0; x < 11; x++) {
				invader = new Invader(World.WIDTH * 0.5 - 250 + x * 50, y * 50);
				invader.gridX = x;
				invader.gridY = y;
				Game.addGameObject(invader);
				this.invadersGrid[x + y * 11] = true;
			}
		}
	},
	killInvader: function(invader) {
		this.invadersGrid[invader.gridX + invader.gridY * 11] = false;
	},
	invadersInFront: function(invader) {
		for(var y = 4; y > invader.gridY; y--) {
			if(this.invadersGrid[invader.gridX + y * 11])
				return true;
		}
		return false;
	},
	update: function(deltaTime, invaders) {
		

		var now = Date.now();
		var moveTime = now - this.moveStart;
		
		if(moveTime > this.moveInterval) {
			this.currentAudio = (this.currentAudio + 1) % this.audio.length;
			this.audio[this.currentAudio].play();
			
			if (this.dir == this.RIGHT) {
				invaders.forEach(function(o) { o.x = o.x + 10; });
			}
			else if (this.dir == this.LEFT) {
				invaders.forEach(function(o) { o.x = o.x - 10; });
			}
			else if (this.dir == this.DOWN_TO_LEFT || this.dir == this.DOWN_TO_RIGHT) {
				invaders.forEach(function(o) { o.y = o.y + 30; });
			}							
			
			this.moveStart = now;
			this.numMoves++;
			
			for(var i = 0; i < invaders.length; i++) {
				if(!this.invadersInFront(invaders[i])) {
					if(Math.random() < 0.05) {
						Game.addGameObject(new InvaderBullet(invaders[i].x, invaders[i].y));
					}
				}
			}
		}
		
		if(this.numMoves == 10) {
			if (this.dir == this.RIGHT) {
				this.dir = this.DOWN_TO_LEFT;
			}
			else if (this.dir == this.LEFT) {
				this.dir = this.DOWN_TO_RIGHT;
			}
		}
		if(this.numMoves == 11) {
			if (this.dir == this.DOWN_TO_LEFT) {
				this.dir = this.LEFT;
			}
			else if (this.dir == this.DOWN_TO_RIGHT) {
				this.dir = this.RIGHT;
			}
			this.numMoves = 0;
			this.moveInterval = this.moveInterval * 0.7;
		}
	}
	
};

Invader.prototype.update = function (deltaTime) { }
