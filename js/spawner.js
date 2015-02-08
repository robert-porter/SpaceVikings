

var Spawner = {

    init: function () {
        this.waveInterval = 3000;
        this.lastWaveTime = Date.now();
    },
    update: function (deltaTime) {
        var now = Date.now();
        if (now - this.lastWaveTime > this.waveInterval) {
            this.lastWaveTime = now;
            this.spawn();
        }
    },
    spawn: function () {
        for (var i = 0; i < 10; i++) {
            Game.addGameObject(new Invader(World.WIDTH * 0.5 - 250 + i * 50, 30));
        }
    }
};