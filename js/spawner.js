

var Spawner = {

    init: function () {
        this.bonusShipInterval = 5000;
        this.lastBonusShipTime = Date.now();
		this.spawn();
    },
    update: function (deltaTime) {
		
        var now = Date.now();
        if (now - this.lastBonusShipTime > this.bonusShipInterval) {
            this.lastBonusShipTime = now;
			Game.addGameObject(new BonusShip(World.WIDTH, 20));
        }
		
    },
    spawn: function () {
		for(var y = 0; y < 5; y++) {
			for (var x = 0; x < 11; x++) {
				Game.addGameObject(new Invader(World.WIDTH * 0.5 - 250 + x * 50, y * 50));
			}
		}
    }
};