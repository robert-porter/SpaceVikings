BonusShip.prototype = Object.create(GameObject.prototype);
BonusShip.prototype.constructor = BonusShip;

function BonusShip(x, y) {
	GameObject.call(this, x, y, 48, 32);
	this.velX = -35;
	this.velY = 0;

    this.sprite = new Sprite({
        path: "images/Sleipnir.png",
        type: "static",
        width: 48,
        height: 32
    });
}