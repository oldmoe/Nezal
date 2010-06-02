var Timeline = Class.create({
	initialize : function(reactor, events){
		this.events = events
		this.reactor = reactor
		this.index = 0
	},
	
	run : function(){
		if(this.index == this.events.length) return
		var self = this
		if(this.events[this.index].constructor == Array){
			var event = this.events[this.index]
			reactor.push(event[1], event[0], function(){self.run()})			
		}else{
			var event = this.events[this.index]
			reactor.push(0, event, function(){self.run()})
		}
		this.index++
	}
	
	
})

