addEventListener('load', letsGetThisPartyStarted);

function letsGetThisPartyStarted() {
	var canvas = document.querySelector('canvas');

	var game = window.game = new Game(canvas);

	game.addRitual(new TypingRitual(game, 'Skullz'));
	game.addRitual(new CandleRitual(game));
	game.addRitual(new RotationRitual(game, Math.random() * 100 - 50));

	document.body.addEventListener('touchstart', function() {
		if(document.body.requestFullScreen)
			document.body.requestFullScreen();
	});
}
