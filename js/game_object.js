function GameObject(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.velX = 0;
	this.velY = 0;
	this.dead = false;
}

GameObject.prototype.draw = function(deltaTime) {
	if(this.dead) {
		return;
	}

	// View.ctx.fillStyle = "#FF0000";
	// View.ctx.fillRect(this.x, this.y, this.width, this.height);

	this.sprite.draw(View.ctx, this.x, this.y);
};

GameObject.prototype.update = function(deltaTime) {
	this.x = this.x + this.velX * deltaTime;
	this.y = this.y + this.velY * deltaTime;
};

function intersect(o1, o2) {
	return !(o1.x > o2.x + o2.width || o1.x + o1.width < o2.x || o1.y > o2.y + o2.height || o1.y + o1.height < o2.y);
}