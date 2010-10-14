var Randomizer = Class.create({
	initialize : function(randoms){
		this.index = 0
		if(randoms){ 
			this.randoms = randoms
		}else{
			this.randoms = []
			for(var i =0; i < 100; i++){
				this.randoms.push(Math.random())
			}
		}
	},
	
	next : function(){
		var result = this.randoms[this.index]
		this.index = (this.index + 1) % (this.randoms.length)
		return result
	},
	
	reset : function(){
		this.index = 0
	}
	
})