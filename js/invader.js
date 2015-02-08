
Invader.prototype = Object.create(GameObject.prototype);
Invader.prototype.constructor = Invader;

function Invader(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velX = 0;
    this.velY = 0;
    this.LEFT = 0;
    this.RIGHT = 1;
    this.DOWN_TO_LEFT = 2;
    this.DOWN_TO_RIGHT = 3;
    this.dir = this.DOWN_TO_LEFT;
    this.moveStart = Date.now();
    this.moveDownTime = 1000;
	this.moveLeftRightTime = 6000;
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

	init: function() {
		this.moveInterval = 1000;
		this.moveStart = Date.now();
		this.numMoves = 0;
		this.dir = 0;
	},
	update: function(deltaTime, invaders) {

		var now = Date.now();
		var moveTime = now - this.moveStart;
		
		if(moveTime > this.moveInterval) {
			if (this.dir == this.RIGHT) {
				invaders.forEach(function(o) { o.x = o.x + 10; });
			}
			else if (this.dir == this.LEFT) {
				invaders.forEach(function(o) { o.x = o.x - 10; });
			}
			else if (this.dir == this.DOWN_TO_LEFT || this.dir == this.DOWN_TO_RIGHT) {
				invaders.forEach(function(o) { o.y = o.y + 10; });
			}							
			
			this.moveStart = now;
			this.numMoves++;
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

Invader.prototype.update = function (deltaTime) {
	/*
    var now = Date.now();
    var moveTime = now - this.moveStart;

    if (this.dir == this.RIGHT && moveTime > this.moveLeftRightTime) { // right boundary
        this.dir = this.DOWN_TO_LEFT;
        this.moveStart = now;
    }
    else if (this.dir == this.LEFT && moveTime > this.moveLeftRightTime) {
        this.dir = this.DOWN_TO_RIGHT;
        this.moveStart = now;
    }
    else if (this.dir == this.DOWN_TO_LEFT && moveTime > this.moveDownTime) {
        this.dir = this.LEFT;
        this.moveStart = now;
    }
    else if (this.dir == this.DOWN_TO_RIGHT && moveTime > this.moveDownTime) {
        this.dir = this.RIGHT;
        this.moveStart = now;
    }

    if (this.dir == this.RIGHT) {
        this.velX = 40;
        this.velY = 0;
    }
    else if (this.dir == this.LEFT) {
        this.velX = -40;
        this.velY = 0;
    }
    else if (this.dir == this.DOWN_TO_LEFT || this.dir == this.DOWN_TO_RIGHT) {
        this.velX = 0;
        this.velY = 40;
    }

    this.x = this.x + this.velX * deltaTime;
    this.y = this.y + this.velY * deltaTime;
	*/
}
