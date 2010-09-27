var IncomingWaves = {
	init : function(container, template, divId, reactor){
		this.reactor = reactor
		this.divId = divId
		this.wave = 0
		this.step = 5
		this.waveWidth = 154
		$(container).innerHTML = TrimPath.parseTemplate($(template).value).process()
		this.div = $(this.divId)
		this.div.style.width = Config.waves.length*this.waveWidth
		this.div.style.left = -154*(Config.waves.length-3)
		this.div.children[this.wave].style.border="1px solid gold";	
	},

	nextWave : function(){
	this.div.children[this.wave].style.border="1px solid red";	
	this.wave++
    this.div.children[this.wave].style.border="1px solid gold";	
		this.div = $(this.divId)
		this.moved = 0;
		this.reactor.push(0, this.advance, this)				
	},

	advance : function(){
		this.div.style.left = Number(this.div.style.left.gsub('px','')) +this.step+ 'px'
		this.moved+=this.step
		if(this.moved>=this.waveWidth){
			this.div.style.left = Number(this.div.style.left.gsub('px','')) -this.moved+this.waveWidth+ 'px'
			return
		}
		this.reactor.push(1, this.advance, this)				
	}
} 
