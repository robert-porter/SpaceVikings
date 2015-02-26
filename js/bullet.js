Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

function Bullet(x, y) {
	GameObject.call(this, x, y, 12, 12);
	this.velY = -700;

	this.sprite = new Image();
	this.sprite.src = "images/Bullet.png";
}

Bullet.prototype.update = function(deltaTime) { 
	GameObject.prototype.update.call(this, deltaTime);
	
	if(this.x + this.width < 0 || this.x > World.WIDTH ||
		this.y + this.height < 0 ||	this.y > World.HEIGHT) {
			this.dead = true;
	}
}
