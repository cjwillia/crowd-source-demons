function Game(canvas, connection) {
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.ritualConfig = {};
	this.lastTick = 0;

	this.ritualConfig = null;

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

	this.dataBound = this.gotData.bind(this);
	connection.addEventListener('message', this.dataBound);

	this.join();
}

Game.prototype.join = function() {
	this.sendEvent('joingame', {name: localStorage.getItem('name')});
};

Game.prototype.setRitualConfig = function(config) {
	if(this.ritual)
		this.ritual.destroy();
	if(config)
		this.ritual = new window[config.type](this, config);
	this.ritualConfig = config;
}

Game.prototype.tick = function(dt, timestamp) {
	if(!this.setup && this.ritual) {
		this.ritual.tick(dt);
		if(this.ritual.isFulfilled()) {
			this.sendRitualFulfilled(this.ritual);
			this.ritual.reset();
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
		if(this.ritual)
			this.ritual.draw(this.ctx, this.canvasSize);
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

Game.prototype.gotData = function(e) {
	var re = /(\w+):(.*)/;
	var matches = e.data.match(re);
	if(matches) {
		var type = matches[1];
		try { 
			var body = JSON.parse(matches[2]);
			switch(type) {
				case "newritual":
					this.setRitualConfig(body);
					break;
				default:
					console.error("%s? %s?! What do I do with this?", type, type);
			}
		}
		catch (e) {
			console.error(e.message);
		}
	}
	else
		console.error("What is this I don't even: %s", e.data);
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
