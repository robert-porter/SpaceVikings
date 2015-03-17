var Spawner = {
    readyToSpawn: false,
    spawnInterval: 10000,
    spawnIntervalVariation: 2000,
    init: function() {
        this.newSpawn();
    },
    update: function(deltaTime) {
        var now = Date.now();
        
        if(this.readyToSpawn) {
            Game.bonusShipCount++;
            Game.bonusShip = new BonusShip(World.WIDTH, 20);
            this.readyToSpawn = false;
        }
    },

    newSpawn: function() {
        //Randomly +/- up to variation
        var interval = this.spawnInterval + Math.floor(Math.random() * 2 * this.spawnIntervalVariation) - this.spawnIntervalVariation,
            _this = this;

        this.spawning = setTimeout(function() {
            _this.readyToSpawn = true;
        }, interval);
    }
};