var notes = [];
for(var i = 0; i < 5; i++) {
	var note = document.createElement('audio');
	note.src = ['sounds/note',i + 1,'.ogg'].join('');
	note.loop = true;
	notes[i] = note;
	this.showing = false;
}

function HoldRitual(game, config) {
	Ritual.apply(this, arguments);
	this.held = false;
	this.x = Math.random();
	this.y = Math.random();

	this.sound = notes[config.soundIndex];

	this.touchBound = this.touch.bind(this);

	['touchstart', 'touchend', 'touchmove'].forEach(function(e) {
		this.game.canvas.addEventListener(e, this.touchBound);
	}, this);
}

HoldRitual.prototype = Object.create(Ritual.prototype);

HoldRitual.prototype.reset = function() {
	Ritual.prototype.reset.apply(this, arguments);
	this.held = false;
	this.x = Math.random();
	this.y = Math.random();
};

HoldRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	['touchstart', 'touchend', 'touchmove'].forEach(function(e) {
		this.game.canvas.removeEventListener(e, this.touchBound);
	}, this);
	this.sound.pause();
};

HoldRitual.prototype.touch = function(e) {
	var wasHeld = this.held;
	if(!this.showing)
		return;
	this.held = false;
	var px = this.x * this.game.canvasSize.w;
	var py = this.y * this.game.canvasSize.h;

	for(var i = 0; i < e.touches.length; i++) {
		var dist = distance(e.touches[i].clientX, e.touches[i].clientY, px, py);
		if(dist < this.circleRadius * this.game.canvasSize.min)
			this.held = true;
	}

	if(this.held && !wasHeld)
		this.sound.play();
	if(wasHeld && !this.held)
		this.sound.pause();
};

HoldRitual.prototype.circleRadius = 0.075;

HoldRitual.prototype.isFulfilled = function() {
	return this.held;
};

HoldRitual.prototype.draw = function(ctx, canvasSize) {
	if(!this.showing)
		return;

	var radPix = this.circleRadius * canvasSize.min;

	var self = this;

	ctx.sr(function() {	
		ctx.beginPath();
		ctx.fillStyle = self.held ? 'white' : 'black';
		ctx.arc(self.x * canvasSize.w, self.y * canvasSize.h, radPix, 0, 2 * Math.PI, false);
		ctx.fill();
	});
};
