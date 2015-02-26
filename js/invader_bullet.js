InvaderBullet.prototype = Object.create(Bullet.prototype);
InvaderBullet.prototype.constructor = InvaderBullet;

function InvaderBullet(x, y) {
	Bullet.call(this, x, y);
	this.velY = 100;
}