
Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

function Bullet(x, y) {
    GameObject.call(this, x, y, 12, 12);
    this.velY = -100;
}
