var IncomingWaves = {
	init : function(container, template, divId, reactor){
		this.reactor = reactor
		this.wave = 0
		this.step = 5
		this.waveWidth = 154
		container.innerHTML = TrimPath.parseTemplate(template.value).process()
		this.div = $(divId)
		this.div.setStyle({
			width : Config.waves.length*this.waveWidth+'px',
			left : -154*(Config.waves.length-3)+'px'
		})
		this.div.children[this.wave].addClassName('active')//.style.border="1px solid gold";	
	},

	nextWave : function(){
		this.div.children[this.wave].removeClassName('active')
		this.div.children[this.wave].addClassName('passed')//.style.border="1px solid red";	
		this.wave++
		this.div.children[this.wave].addClassName('active')//'.style.border="1px solid gold";	
		this.moved = 0;
		this.reactor.push(0, this.advance, this)				
	},

	advance : function(){
		this.div.setStyle({
			left : Number(this.div.style.left.gsub('px','')) +this.step+ 'px'
		})
		this.moved+=this.step
		if(this.moved>=this.waveWidth){
			this.div.setStyle({
				left : Number(this.div.style.left.gsub('px','')) -this.moved+this.waveWidth+ 'px'
			})
			return
		}
		this.reactor.push(1, this.advance, this)				
	}
} 
