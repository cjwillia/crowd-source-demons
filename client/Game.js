function Game(canvas, connection) {
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.rituals = [];
	this.lastTick = 0;

	if(!localStorage.getItem('axis'))
		this.setup = new Setup(this);

	this.canvasSize = {
		w: 0,
		h: 0,
		min: 0,
		max: 0
	};

	this.sizeCanvas(canvas);

	addEventListener('resize', this.sizeCanvas.bind(this));

	this.scheduleTick();

	this.connection = connection;
}

Game.prototype.addRitual = function(ritual) {
	this.rituals.push(ritual);
	ritual.game = this;
};

Game.prototype.tick = function(dt, timestamp) {
	var ritual = this.rituals[0];

	if(!this.setup && ritual) {
		if(!ritual.active)
			ritual.activate();
		if(!ritual.active)
			throw new Error("Activating ritual didn't activate it?");

		ritual.tick(dt);
		if(ritual.isFulfilled()) {
			var completed = this.rituals.shift();
			this.sendRitualFulfilled(completed);
			completed.destroy();
		}
	}

	this.draw(dt);
};

Game.prototype.sendRitualFulfilled = function(ritual) {
	this.sendEvent("ritualfulfilled", ritual.config);
};

Game.prototype.sendEvent = function(type, body) {
	if(body) 
		this.connection.send([type, JSON.stringify(body)].join(':'));
	else
		this.connection.send(type);
};

Game.prototype.draw = function(dt) {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = '#F44';
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.fillStyle = 'black';

	if(this.setup)
		this.setup.draw(this.ctx, this.canvasSize);
	else {
		if(this.rituals[0])
			this.rituals[0].draw(this.ctx, this.canvasSize);
	}

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
