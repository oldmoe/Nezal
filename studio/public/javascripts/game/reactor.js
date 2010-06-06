var Reactor = Class.create({
	
	events : [],
	
	ticks : 0,
	
	running : false,
	
	initialize : function(delay){
		this.delay = delay || 50
	},
	
	run : function(callback){
		this.running = true
		if(callback) callback()
		this.tick()
	},
	
	tick : function(){
		var self = this		
		try{
			var event = this.events.last()
			while(event && event[0] <= this.ticks){
				var length = this.events.length - 1
				this.events.pop()[1]()
				if(this.events.length == length && event[2]){ 
					event[2]()
				}else if(event[2]){
					if(!this.events[0][2]) this.events[0][2] = event[2]
				}
				event = this.events[this.events.length - 1]
			}
		}catch(e){
			alert(e)
		}
		this.ticks++
		setTimeout(function(){self.tick()}, self.delay)
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