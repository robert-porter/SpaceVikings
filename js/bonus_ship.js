
BonusShip.prototype = Object.create(GameObject.prototype);
BonusShip.prototype.constructor = BonusShip;

function BonusShip(x, y) {
	GameObject.call(this, x, y, 32, 32);
	this.velX = -35;
	this.velY = 0;
}

