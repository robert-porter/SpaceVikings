Bunker.prototype = Object.create(GameObject.prototype);
Bunker.prototype.constructor = Bunker;

function Bunker(x, y, w, h) {
	GameObject.call(this, x, y, w, h);
	this.parts = [];
	
	for(var x = 0; x < 4; x++) {
		for(var y = 0; y < 4; y++) {
			if((x === 1 || x === 2) && (y === 2 || y === 3)) {
				this.parts[x + y * 4] = 0;
			} else {
				this.parts[x + y * 4] = 4; //Hitpoints  
			}
		}
	}
	
	this.cellWidth = this.width / 4;
	this.cellHeight = this.height / 4;
}

Bunker.prototype.draw = function(deltaTime) {
	for(var x = 0; x < 4; x++) {
		for(var y = 0; y < 4; y++) {
			if(this.parts[x + y * 4] > 0) {
				var hp = this.parts[x + y * 4];

				View.ctx.fillStyle = "rgba(" + Math.trunc((255 / hp)) + ", 0, 0, 1)";
				View.ctx.fillRect(
					this.x + (this.cellWidth * x),
					this.y + (this.cellHeight * y),
					this.cellWidth, this.cellHeight
				);
			}
		}
	}
};

Bunker.prototype.bulletCollision = function(bullet) {
	var part = null;

	for(var x = 0; x < 4; x++) {
		for(var y = 0; y < 4; y++) {
			if(this.parts[x + y * 4] > 0) {
				part = new GameObject(
					this.x + (this.cellWidth * x),
					this.y + (this.cellHeight * y),
					this.cellWidth, this.cellHeight
				);
				
				if(intersect(part, bullet)) {
					this.parts[x + y * 4] = this.parts[x + y * 4] - 1;
					bullet.dead = true;
				}
			}
		}
	}
};