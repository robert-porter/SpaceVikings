function Sprite(options) {
    this.path = options.path;
    this.type = options.type;
    this.width = options.width;
    this.height = options.height;

    this.image = new Image();
    this.image.src = this.path;

    switch(options.type) {
        case "static":
            this.frameX = 0;
            this.frameY = 0;
        break;

        case "spritesheet":
            this.sheet = {};
            this.sheet.width = options.sheet_width;
            this.sheet.height = options.sheet_height;
            this.sheet.px_width = this.sheet.width * this.width;
            this.sheet.px_height = this.sheet.height * this.height;

            this.max_frames = (this.sheet.width * this.sheet.height) - 1;
            this.frame = 0;
            this.frameX = 0;
            this.frameY = 0;
        break;

        default:
            throw new Error("Invalid sprite type specified");
        break;
    }
}

Sprite.prototype.draw = function(ctx, x, y, w, h) {
    w = w || this.width;
    h = h || this.height;

    ctx.drawImage(this.image, this.frameX, this.frameY, this.width, this.height, x, y, w, h);
};

Sprite.prototype.step = function(frames) {
    if(this.type !== "spritesheet") {
        console.log("Warning: Sprite.prototype.step() called on non-spritesheet sprite");
        return false;
    }

    var newframe = this.frame + (frames || 1);

    if(newframe > this.max_frames) {
        newframe = newframe - this.max_frames - 1;
    }

    //TODO: Spritesheets with multiple rows
    this.frameX = newframe * this.width;

    this.frame = newframe;
};