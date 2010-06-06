var Narrator = Class.create({
	initialize : function(reactor, baloon){
		this.baloon = $(baloon)
		this.textArea = this.baloon.childElements()[0]
		this.reactor = reactor
	},
	
	speak : function(text){
		var self = this
		this.textArea.innerHTML = ''
		new Effect.Appear(this.baloon,{duration:0.5, transition:Effect.Transitions.Bounce});
		this.reactor.push(10, function(){ self._speak(text) })
	},
	
	_speak : function(text){
		text = text.trim()
		var self = this
		if(this.textArea.innerHTML.trim() == text){
			return
		}
		var done = this.textArea.innerHTML
		this.textArea.innerHTML = done + text.substr(done.length, 1)
		this.reactor.push(1, function(){ self._speak(text) })			
	},
	
	unspeak : function(){
		this.textArea.innerHTML = ""
		new Effect.Fade(this.baloon,{duration:0.5, transition:Effect.Transitions.Bounce});
	}	
})