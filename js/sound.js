var Sound = {
    context: new (window.AudioContext || window.webkitAudioContext)(),
    init: function() {
        Sound.masterGain = Sound.context.createGain();
        Sound.masterGain.connect(Sound.context.destination);
    },
    load: function(url, data, cb) {
        var request = new XMLHttpRequest();

        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            Sound.context.decodeAudioData(request.response, function(buffer) {
                cb(data, buffer);
            });
        }

        request.send();
    },
    play: function(buffer) {
        var source = Sound.context.createBufferSource();
        
        source.buffer = buffer;
        source.connect(Sound.masterGain);
        source.start(0);
    },
    setVolume: function(vol) {
        Sound.masterGain.gain.value = vol;
    }
}

function SoundBank(files) {
    var received = 0,
        expected = files.length,
        _this = this;

    this.ready = false;
    this.bank = [];
    this.last = -1;
    this.gainNode = Sound.context.createGain();

    function receiveBuffer(data, buffer) {
        _this.bank[data.id] = buffer;

        if(++received === expected) {
            this.ready = true;
        }
    }

    for(var i = 0; i < files.length; i++) {
        Sound.load(files[i], {
            id: i
        }, receiveBuffer);
    }
}

SoundBank.prototype.playNext = function() {
    this.last = (this.last + 1) % this.bank.length;
    Sound.play(this.bank[this.last]);
};