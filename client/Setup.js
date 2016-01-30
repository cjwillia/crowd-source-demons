function Setup(game) {
	this.game = game;

	this.orientedBound = this.oriented.bind(this);

	addEventListener('deviceorientation', this.orientedBound);

	this.image = document.createElement('img');
	this.image.src = 'images/this-side-up.png';

	this.lastEvent = null;

	this.touchBound = this.touch.bind(this);
	document.body.addEventListener('touchstart', this.touchBound);

	this.axis = localStorage.getItem('axis');
	this.name = localStorage.getItem('name');

	this.label = document.createElement('label');
	this.label.textContent = 'Name';
	input = document.createElement('input');
	input.value = localStorage.getItem('name') || '';
	this.label.appendChild(input);

	['change', 'input'].forEach(function(type) {
		input.addEventListener(type, function(e) {
			localStorage.setItem('name', input.value);
		});
	});

	this.button = document.createElement('button');
	this.button.textContent = 'Save';
	this.button.className = 'save';

	document.body.appendChild(this.label);
	document.body.appendChild(this.button);

	this.button.addEventListener('click', function() {
		this.destroy();
		game.setup = null;
	}.bind(this));
}

Setup.prototype.oriented = function(e) {
	this.lastEvent = e;
};

Setup.prototype.destroy = function() {
	document.body.removeEventListener('touchstart', this.touchBound);
	document.body.removeChild(this.label);
	document.body.removeChild(this.button);
};

Setup.prototype.touch = function(e) {
	var h = this.game.canvasSize.h;

	var touch = e.touches[0] || null;

	if(Math.abs(touch.clientY - h/2) > h/2)
		return;

	var i = Math.floor((touch.clientX / this.game.canvasSize.w) * 3);
	this.axis = ['alpha', 'beta', 'gamma'][i];
	localStorage.setItem('axis', this.axis);
};

Setup.prototype.draw = function(ctx, canvasSize) {
	if(!this.lastEvent)
		return;

	var e = this.lastEvent;

	var image = this.image;

	var chosenAxis = this.axis;

	['alpha', 'beta', 'gamma'].forEach(function(axis, i) {
		ctx.sr(function() {
			var x = ((i + 0.5)/3) * canvasSize.w;
			var y = canvasSize.h / 2;
			var w = canvasSize.w / 4;
			var h = canvasSize.h / 4;

			if(axis == chosenAxis)
				ctx.fillStyle = '#700';
			else
				ctx.fillStyle = 'black';

			ctx.translate(x, y);
			ctx.rotate(-Math.PI * e[axis] / 180);
			ctx.fillRect(-w/2, -h/2, w, h);
			ctx.fill();

			if(image)
				ctx.drawImage(image, -w/2, -h/2, w, h);
		});
	});
};
