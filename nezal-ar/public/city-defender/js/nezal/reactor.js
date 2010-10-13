var Reactor = Class.create({
	
	initialize : function(delay){
		this.delay = delay || 50
		this.events = []
		this.ticks = 0
		this.running = false
	},
	
	pause : function(){
		this.running = false
	},
	
	resume : function(){
		if(this.running)return
		this.running = true
		this.tick()
	},
	
	stop : function(){
		this.running = false;
		this.events = []
	},
	
	run : function(callback){
		this.running = true
		if(callback) callback()
		this.tick()
	},
	
	tick : function(){
		if(!this.running) return
		var self = this	
		var toFire = []
		try{
			var event = this.events.last()
			while(event && event[0] <= this.ticks){
				var length = this.events.length - 1
				toFire.push(this.events.pop())
				event = this.events[this.events.length - 1]
			}
			toFire.each(function(event){
				if(event[2]){
					event[1].apply(event[2])
				}else{
					event[1]()
				}
			})
		}catch(e){
			//console.log(e)
			//alert('inside reactor : '+ e)
		}
		this.ticks++
		setTimeout(function(){self.tick()}, this.delay)
	},

	_eventIndex : function(ticks, insert){
		var h = this.events.length, l = -1, m;
		while(h - l > 1)
			if(this.events[m = (h + l) >> 1][0] > ticks) l = m;
			else h = m;
		return this.events[h] && this.events[h][0] != ticks ? insert ? h : -1 : h;
	},
	
	push : function(ticks, func, callback){
		var delay = this.ticks + ticks
		this.events.splice(this._eventIndex(delay, true), 0, [delay, func, callback])
	}
	
})