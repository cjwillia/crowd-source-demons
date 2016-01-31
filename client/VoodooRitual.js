var voodooImage = document.createElement('img');
voodooImage.src = "images/voodoo-doll.png";

function VoodooRitual() {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new PinRitual(game, {angle: Math.random() * 360}));
}

VoodooRitual.prototype = Object.create(MetaRitual.prototype);

VoodooRitual.prototype.imageSize = 0.8;

VoodooRitual.prototype.draw = function(ctx, canvasSize) {
	if(voodooImage.width) {
		var imageMin = Math.min(voodooImage.width, voodooImage.height);
		var targetMin = this.imageSize * canvasSize.min;
		var scaleFactor = targetMin / imageMin;
		var x = (canvasSize.w - voodooImage.width * scaleFactor)/2;
		var y = (canvasSize.h - voodooImage.height * scaleFactor)/2;
		ctx.drawImage(voodooImage, x, y, voodooImage.width * scaleFactor, voodooImage.height * scaleFactor);
	}

	MetaRitual.prototype.draw.apply(this, arguments);
}
