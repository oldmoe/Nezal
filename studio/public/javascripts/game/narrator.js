var Narrator = Class.create({
	initialize : function(reactor, baloon){
		this.baloon = $(baloon)
		this.textArea = this.baloon.childElements()[1]
		this.reactor = reactor
	},
	
	speak : function(text){
		var self = this
		this.textArea.innerHTML = ''
		new Effect.Appear(this.baloon,{duration:0.5, transition:Effect.Transitions.Bounce});
		this.reactor.push(10, function(){ self._speak(text) })
	},
	
	_speak : function(text){
		try{
			text = text.strip()
			var self = this
			var done = new String(this.textArea.innerHTML)
			if(done.strip() == text){
				myAudio.stop('type_writer')
				return
			}
			if(!myAudio.playing('type_writer'))myAudio.play('type_writer')
			this.textArea.innerHTML = done + text.substr(done.length, 1)
			this.reactor.push(1, function(){ self._speak(text) })			
		}catch(e){
			//alert("inside _speak : " + e)
		}
	},
	
	unspeak : function(){
		this.textArea.innerHTML = ""
		new Effect.Fade(this.baloon,{duration:0.5, transition:Effect.Transitions.Bounce});
	}	
})