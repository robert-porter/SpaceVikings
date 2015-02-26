var Spawner = {

	init: function () {
		this.bonusShipInterval = 5000;
		this.lastBonusShipTime = Date.now();
	},
	update: function (deltaTime) {
		
		var now = Date.now();
		if (now - this.lastBonusShipTime > this.bonusShipInterval && Game.bonusShip.dead) {
			this.lastBonusShipTime = now;
			Game.bonusShip = new BonusShip(World.WIDTH, 20);
		}
		
	}
};