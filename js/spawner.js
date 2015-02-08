

var Spawner = {

    init: function () {
        this.waveInterval = 5000;
        this.lastWaveTime = Date.now();
		this.spawn();
    },
    update: function (deltaTime) {
		/*
        var now = Date.now();
        if (now - this.lastWaveTime > this.waveInterval) {
            this.lastWaveTime = now;
            this.spawn();
        }
		*/
    },
    spawn: function () {
		for(var y = 0; y < 5; y++) {
			for (var x = 0; x < 11; x++) {
				Game.addGameObject(new Invader(World.WIDTH * 0.5 - 250 + x * 50, y * 50));
			}
		}
    }
};