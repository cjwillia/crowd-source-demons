addEventListener('load', letsGetThisPartyStarted);

function Game(canvas) {
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.rituals = [];
	this.lastTick = 0;

	this.sizeCanvas(canvas);	
	addEventListener('resize', this.sizeCanvas.bind(this));

	this.scheduleTick();
}

Game.prototype.tick = function(dt, timestamp) {
	var ritual = this.rituals[0];

	if(ritual) {
		ritual.tick(dt);
		if(ritual.isFulfilled())
			rituals.pop();
	}

	this.draw(this.ctx, dt);
}

Game.prototype.draw = function(ctx, dt) {
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.drawFPS(ctx, dt);
}

Game.prototype.drawFPS = function(ctx, dt) {
	var fps = Math.floor(1000 / dt);
	ctx.save();
	ctx.textAlign = 'right';
	ctx.textBaseline = 'top';
	ctx.fillText(fps, this.canvas.width - 32, 32);
	ctx.restore();
};

Game.prototype.scheduleTick = function() {
	var self = this;
	requestAnimationFrame(function(timestamp) {
		if(self.lastTick)
			self.tick(timestamp - self.lastTick, timestamp);
		self.lastTick = timestamp;

		self.scheduleTick();
	});
}

Game.prototype.sizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.style.position = 'absolute';
	this.canvas.style.left = 0;
	this.canvas.style.right = 0;
	this.canvas.style.top = 0;
	this.canvas.style.bottom = 0;
};

function letsGetThisPartyStarted() {
	var canvas = document.querySelector('canvas');

	window.game = new Game(canvas);
}
