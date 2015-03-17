var Spawner = {
    readyToSpawn: false,
    waitingOnSpawn: false,
    spawnInterval: 12000,
    spawnIntervalVariation: 2000,
    init: function() {
        this.newSpawn();
    },
    update: function(deltaTime) {
        var now = Date.now();

        if(this.readyToSpawn) {
            Game.bonusShip = new BonusShip(World.WIDTH, 20);
            this.readyToSpawn = false;
            this.waitingOnSpawn = false;
        }

        if(Game.bonusShip.dead && !this.waitingOnSpawn) {
            Spawner.newSpawn();
        }
    },

    newSpawn: function() {
        //Randomly +/- up to variation
        var interval = this.spawnInterval + Math.floor(Math.random() * 2 * this.spawnIntervalVariation) - this.spawnIntervalVariation,
            _this = this;

        this.waitingOnSpawn = true;
        this.spawning = setTimeout(function() {
            _this.readyToSpawn = true;
        }, interval);
    }
};