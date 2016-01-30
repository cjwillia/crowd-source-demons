addEventListener('load', letsGetThisPartyStarted);

function letsGetThisPartyStarted() {
	var canvas = document.querySelector('canvas');

	var connection = new WebSocket("ws://"+window.location.host);

	connection.addEventListener('open', function() {
		var game = window.game = new Game(canvas, connection);

		game.addRitual(new DemonChordRitual(game, {count: 5}));
		game.addRitual(new TypingRitual(game, {incantation:'Skullz'}));
		game.addRitual(new CandlesRitual(game, {count: 5}));
		game.addRitual(new RotationRitual(game, {targetAngle:Math.random() * 100 - 50}));
	});

	connection.addEventListener('error', function(e) {
		alert("uh-oh");
		debugger;
	});

	document.body.addEventListener('touchstart', function() {
		//return;
		if(document.body.requestFullScreen)
			document.body.requestFullScreen();
	});
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
