var InvadersGroup = {
	LEFT: 0,
	RIGHT: 1,
	DOWN_TO_LEFT: 2,
	DOWN_TO_RIGHT: 3,
	
	NUM_ROWS: 5,
	NUM_COLS: 11,
	INVADER_WIDTH: 32,
	INVADER_HEIGHT: 32,
	CELL_WIDTH: 40, 
	CELL_HEIGHT: 40,
	
	HORIZONTAL_MOVEMENT: 20, // should be a multiple the of size of an invader cell 
	VERTICAL_MOVEMENT: 20, // does not need to be a multiple the of size of an invader cell 
	
	dir: 0,
	moveStart: Date.now(),
	numMoves: 0,
	posX: 40,
	posY: 0,
	
	audio: new SoundBank([
		"audio/move_1.mp3",
		"audio/move_2.mp3",
		"audio/move_3.mp3",
		"audio/move_4.mp3"
	]),
	invaders: [],

	init: function() {
		this.moveInterval = (13 - Game.difficulty) * 170;
		this.moveStart = Date.now();
		this.numMoves = 0;
		this.dir = 0;
		
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for(var x = 0; x < this.NUM_COLS; x++) {
				this.invaders[x + y * this.NUM_COLS] = true;
			}
		}
		
		this.posX = 0;
		this.posY = 0;
		
		this.sprite = new Sprite({
			path: "images/Invader.png",
			type: "spritesheet",
			width: 32,
			height: 32,
			sheet_width: 4,
			sheet_height: 1
		});
	},
	createInvaders: function() {
		this.invaders = [];
		
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for(var x = 0; x < this.NUM_COLS; x++) {
				this.invaders[x + y * this.NUM_COLS] = true;
			}
		}
	},
	bulletCollision: function(bullet) {
		if(bullet.dead) {
			return;
		}
		
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for(var x = 0; x < this.NUM_COLS; x++) {
				if(this.invaders[x + y * this.NUM_COLS]) {
					var invaderX = this.posX + x * this.CELL_WIDTH + (this.INVADER_WIDTH - this.CELL_WIDTH) / 2;
					var invaderY = this.posY + y * this.CELL_HEIGHT + (this.INVADER_HEIGHT - this.CELL_HEIGHT) / 2;
					var gameObject = new GameObject(invaderX, invaderY, this.INVADER_WIDTH, this.INVADER_HEIGHT);
					
					if(intersect(gameObject, bullet)) {
						this.invaders[x + y * this.NUM_COLS] = false;
						bullet.dead = true;

						//More points for back rows; matches original Space Invaders scoring on difficulty 5
						switch(y) {
							case 4:
							case 3:
								Game.points = 2 * Game.difficulty;
							break;

							case 2:
							case 1:
								Game.points = 4 * Game.difficulty;
							break;

							case 0:
								Game.points = 8 * Game.difficulty;
							break;
						}
					}
				}
				
			}
		}
	},
	invadersInFront: function(col, row) {
		for(var y = this.NUM_ROWS-1; y > row; y--) {
			if(!this.invaders[col + y * this.NUM_COLS]) {
				return true;
			}
		}

		return false;
	},
	tryShoot: function(deltaTime) {
		var shotchance = 0.05;

		//Avoid putting the player to sleep on difficulty 1-2
		if(Game.difficulty < 3) {
			shotchance = 0.1;
		}

		// first one in each row get a chance to shoot.  
		for(var x = 0; x < this.NUM_COLS; x++) {
			for(var y = this.NUM_ROWS-1; y >= 0; y--) {
				var index = x + y * this.NUM_COLS;

				if(this.invaders[index]) {
					if(Math.random() < shotchance) {
						var bulletX = this.posX + x * this.CELL_WIDTH + (this.INVADER_WIDTH - this.CELL_WIDTH) / 2 + this.INVADER_WIDTH / 2;
						var bulletY = this.posY + y * this.CELL_HEIGHT + (this.INVADER_HEIGHT - this.CELL_HEIGHT) / 2 + this.INVADER_HEIGHT / 2;
						var invaderBullet = new InvaderBullet(bulletX, bulletY);
						Game.invaderBullets.push(invaderBullet);
					}

					break;
				}
			}
		}		
	},
	getLeftBoundaryXIndex: function() { 
		for(var x = 0; x < this.NUM_COLS; x++) {
			for(var y = this.NUM_ROWS-1; y >= 0; y--) {
				var index = x + y * this.NUM_COLS;

				if(this.invaders[index]) {
					return x;
				}
			}
		}

		return -1;
	},
	getRightBoundaryXIndex: function() {
		for(var x = this.NUM_COLS-1; x >= 0; x--) {
			for(var y = this.NUM_ROWS-1; y >= 0; y--) {
				var index = x + y * this.NUM_COLS;

				if(this.invaders[index]) {
					return x;
				}
			}
		}

		return -1;
	},
	getBottomBoundaryYIndex: function() {
		for(var y = this.NUM_ROWS-1; y >= 0; y--) {
			for(var x = 0; x < this.NUM_COLS; x++) {
				var index = x + y * this.NUM_COLS;

				if(this.invaders[index]) {
					return y;
				}
			}
		}

		return -1;
	},
	allDead: function() {
		for(var i = 0; i < this.invaders.length; i++) {
			if(this.invaders[i]) {
				return false;
			}
		}

		return true;
	},
	move: function(deltaTime) {
		var leftIndex = this.getLeftBoundaryXIndex();
		var rightIndex = this.getRightBoundaryXIndex();

		this.audio.playNext();
		
		if(this.posX + leftIndex * this.CELL_WIDTH <= this.HORIZONTAL_MOVEMENT && this.dir != this.RIGHT) {
			this.dir = this.DOWN_TO_RIGHT;
		}
		
		if(this.posX + rightIndex * this.CELL_WIDTH + this.CELL_WIDTH >= World.WIDTH && this.dir != this.LEFT) {
			this.dir = this.DOWN_TO_LEFT;
		}
		
		
		if(this.dir == this.RIGHT) {
			this.posX += this.HORIZONTAL_MOVEMENT; 
		} else if(this.dir == this.LEFT) {
			this.posX -= this.HORIZONTAL_MOVEMENT;
		} else if(this.dir == this.DOWN_TO_LEFT)  {
			this.posY += this.VERTICAL_MOVEMENT; 
			this.dir = this.LEFT;
			this.moveInterval = this.moveInterval * 0.85;
		} else if(this.dir == this.DOWN_TO_RIGHT) {
			this.posY += this.VERTICAL_MOVEMENT;
			this.dir = this.RIGHT;
			this.moveInterval = this.moveInterval * 0.85;
		}
		
		this.tryShoot();
		this.sprite.step();
	},
	update: function(deltaTime) {
		var now = Date.now();
		var moveTime = now - this.moveStart;
		
		if(moveTime > this.moveInterval) {
			this.move();
			this.moveStart = now;
		}
	}, 
	draw: function() {
		for(var y = 0; y < this.NUM_ROWS; y++) {
			for(var x = 0; x < this.NUM_COLS; x++) {
				if(this.invaders[x + y * this.NUM_COLS]) {
					var invaderX = this.posX + x * this.CELL_WIDTH + (this.INVADER_WIDTH - this.CELL_WIDTH) / 2;
					var invaderY = this.posY + y * this.CELL_HEIGHT + (this.INVADER_HEIGHT - this.CELL_HEIGHT) / 2;
					
					this.sprite.draw(View.ctx, invaderX, invaderY);
				}
			}
		}
	}
};