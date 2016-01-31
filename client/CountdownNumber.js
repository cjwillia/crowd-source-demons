function CountdownNumber(n) {
	this.node = document.createElement('div');
	this.node.textContent = n;
	this.node.className = 'countdown';
	setTimeout(this.destroy.bind(this), 1000);
	document.body.appendChild(this.node);
}

CountdownNumber.prototype.destroy = function() {
	document.body.removeChild(this.node);
}
