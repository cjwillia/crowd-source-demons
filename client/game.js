addEventListener('load', letsGetThisPartyStarted);

function Game(canvas) {
	this.canvas = canvas;
	this.listenForStuff();
	this.ctx = this.canvas.getContext('2d');
	this.rituals = [];
	this.lastTick = 0;


	this.canvasSize = {
		w: 0,
		h: 0,
		min: 0,
		max: 0
	};

	this.sizeCanvas(canvas);	
	addEventListener('resize', this.sizeCanvas.bind(this));

	this.scheduleTick();
}

Game.prototype.addRitual = function(ritual) {
	this.rituals.push(ritual);
	ritual.game = this;
};

Game.prototype.tick = function(dt, timestamp) {
	var ritual = this.rituals[0];

	if(ritual) {
		ritual.tick(dt);
		if(ritual.isFulfilled())
			this.rituals.shift().destroy();
	}

	this.draw(dt);
};

Game.prototype.listenForStuff = function() {
	['touchstart', 'touchend', 'touchmove', 'touchcancel'].forEach(function(type) {
		this.canvas.addEventListener(type, function(e) {
			if(this.rituals[0])
				this.rituals[0].handleTouchEvent(type, e);
		}.bind(this));
	}, this);
};

Game.prototype.draw = function(dt) {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	if(this.rituals[0])
		this.rituals[0].draw(this.ctx, this.canvasSize);

	this.drawHUD(dt);
};

Game.prototype.drawHUD = function(dt) {
	var fps = Math.floor(1000 / dt);
	this.ctx.save();
	this.ctx.textAlign = 'right';
	this.ctx.textBaseline = 'top';
	this.ctx.fillText(fps, this.canvas.width - 32, 32);
	this.ctx.restore();
};

Game.prototype.scheduleTick = function() {
	var self = this;
	requestAnimationFrame(function(timestamp) {
		if(self.lastTick)
			self.tick(timestamp - self.lastTick, timestamp);
		self.lastTick = timestamp;

		self.scheduleTick();
	});
};

Game.prototype.sizeCanvas = function() {
	var w = this.canvas.width = window.innerWidth;
	var h = this.canvas.height = window.innerHeight;
	var min = Math.min(w, h);
	var max = Math.max(w, h);

	this.canvas.style.position = 'absolute';
	this.canvas.style.left = 0;
	this.canvas.style.right = 0;
	this.canvas.style.top = 0;
	this.canvas.style.bottom = 0;

	this.canvasSize = {
		w: w,
		h:  h,
		min: min,
		max: max
	};
};

function letsGetThisPartyStarted() {
	var canvas = document.querySelector('canvas');

	var game = window.game = new Game(canvas);

	game.addRitual(new TypingRitual('Skullz'));
	game.addRitual(new CandleRitual());

	document.body.addEventListener('touchstart', function() {
		if(document.body.requestFullScreen)
			document.body.requestFullScreen();
	});
}
