var Studio = {}
Studio.reactor = new Reactor()
Studio.right = new Narrator(Studio.reactor, 'right_baloon')
Studio.left = new Narrator(Studio.reactor, 'left_baloon')
Studio.narrators = [Studio.right, Studio.left]
Studio.events = [
	[function(){
		$('waitScreen').hide()
		$('game').show();
	}, 10],
	[function(){/* do nothing */}, 20]
]
Studio.timeline = new Timeline(Studio.reactor, Studio.events)