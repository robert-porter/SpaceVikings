

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

    this.sprite = new Image();
    this.sprite.src = "images/Player.png";
}

Player.prototype.update = function (deltaTime) {
    this.test = 50;
    if (Key.isDown(Key.LEFT)) {
        this.velX = -50;
    }
    else if (Key.isDown(Key.RIGHT)) {
        this.velX = 50;
    }
    else {
        this.velX = 0;
    }

    if (Key.isDown(Key.SHOOT)) {
		if(this.bullet.dead == true) {
			this.bullet.dead = false;
			this.bullet.x = this.x + this.width / 2.0 - this.bullet.width / 2.0;
			this.bullet.y = this.y;
		}
    }

    this.x = this.x + this.velX * deltaTime;
    this.y = this.y + this.velY * deltaTime;
}
