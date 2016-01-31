function Setup(game) {
	this.game = game;

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
	this.button.textContent = 'Join';
	this.button.className = 'save';

	document.body.appendChild(this.label);
	document.body.appendChild(this.button);

	this.button.addEventListener('click', function() {
		game.join();
	}.bind(this));
}

Setup.prototype.destroy = function() {
	document.body.removeChild(this.label);
	document.body.removeChild(this.button);
};
