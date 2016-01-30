addEventListener('load', letsGetThisPartyStarted);

function letsGetThisPartyStarted() {
	var canvas = document.querySelector('canvas');

	var connection = new WebSocket("ws://"+window.location.host);

	connection.addEventListener('open', function() {
		var game = window.game = new Game(canvas, connection);

		game.addRitual(new TypingRitual(game, {incantation:'Skullz'}));
		game.addRitual(new CandleRitual(game, {count: 5}));
		game.addRitual(new RotationRitual(game, {targetAngle:Math.random() * 100 - 50}));
	});

	connection.addEventListener('error', function(e) {
		alert("uh-oh");
		debugger;
	});

	document.body.addEventListener('touchstart', function() {
		return;
		if(document.body.requestFullScreen)
			document.body.requestFullScreen();
	});
}
