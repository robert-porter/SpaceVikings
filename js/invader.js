
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
}

Invader.prototype.update = function (deltaTime) {
    var now = Date.now();
    var moveTime = now - this.moveStart;

    if (this.dir == this.RIGHT && this.x > World.WIDTH - this.width) { // right boundary
        this.dir = this.DOWN_TO_LEFT;
        this.moveStart = now;
    }
    else if (this.dir == this.LEFT && this.x < 0 && this.x < 0) {
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
        this.velX = 100;
        this.velY = 0;
    }
    else if (this.dir == this.LEFT) {
        this.velX = -100;
        this.velY = 0;
    }
    else if (this.dir == this.DOWN_TO_LEFT || this.dir == this.DOWN_TO_RIGHT) {
        this.velX = 0;
        this.velY = 100;
    }

    this.x = this.x + this.velX * deltaTime;
    this.y = this.y + this.velY * deltaTime;
}
