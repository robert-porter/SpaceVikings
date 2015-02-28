Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

function Player(x, y) {
	GameObject.call(this);
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.velX = 0;
	this.velY = 0;
	this.bullet = null;
	this.speed = 50;
	this.bounds = 50;
	this.maxRight = World.WIDTH - this.width - this.bounds;

	this.sprite = new Image();
	this.sprite.src = "images/Player.png";
}

Player.prototype.update = function(deltaTime) {
	if(Key.isDown(Key.LEFT) && this.x > this.bounds) {
		this.velX = -this.speed;
	} else if(Key.isDown(Key.RIGHT) && this.x < this.maxRight) {
		this.velX = this.speed;
	} else {
		this.velX = 0;
	}

	//Force back into bounds if the player slips due to speeding past the check
	if(this.x < this.bounds) { this.x = this.bounds; }
	if(this.x > this.maxRight) { this.x = this.maxRight; }

	if(Key.isDown(Key.SHOOT)) {
		if(this.bullet.dead == true) {
			this.bullet.dead = false;
			this.bullet.x = this.x + this.width / 2.0 - this.bullet.width / 2.0;
			this.bullet.y = this.y;
		}
	}

	this.x = this.x + this.velX * deltaTime;
	this.y = this.y + this.velY * deltaTime;
};