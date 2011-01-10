var Scene = Class.create({
	//initializes the delay of the reactor
	initialize : function(game){
		this.game = game;
		this.reactor = game.reactor;
		this.objects = [];
		this.renderStores = {};
		this.start();
	},

	init : function(){
	},
	
	//runs the reactor , starts _tick function and then render the start
	start : function(){
		this.init()
		var self = this
		this.reactor.push(0, function(){self._tick()})
		return this
	},
	
	push : function(object){
		var self = this
		this.reactor.push(0, function(){self.objects.push(object)})
	},
	
	remove : function(object){
		var self = this
		this.reactor.push(0, function(){self.objects.remove(object)})
	},
	
	tick : function(){
		try{
			var remainingObjects = []
			var self = this
			this.objects.each(function(object){
				if(!object.finished){
					object.tick()
					remainingObjects.push(object)
				}
			})
			this.objects = remainingObjects
		}catch(x){console.log(x)}
		return this
	},
	//moves objects in the scene 
	_tick : function(){
		this.tick()
		this.render()
		var self = this
		this.reactor.push(0, function(){self._tick()})
	},

	createRenderLoop : function(name, delay){
		this.renderStores[name] = {delay : delay, tick: this.reactor.ticks, objects : []}
	},
	
	pushPeriodicalRenderLoop : function(tickDelay,runningTicks,everySeconds,func){
		this.reactor.pushPeriodical(tickDelay,runningTicks,this.reactor.everySeconds(everySeconds),func)
	},

	pushToRenderLoop : function(name, object){
		var self = this
		this.reactor.push(0, function(){self.renderStores[name].objects.push(object)})
	},
	
	removeFromRenderLoop : function(name, object){
		var self = this
		this.reactor.push(0, function(){self.renderStores[name].objects.remove(object)})
	},

	render : function(){
		try{
			for(var storeIndex in this.renderStores){
				var store = this.renderStores[storeIndex]
				if(this.reactor.ticks >= store.tick + store.delay ){
					store.tick = this.reactor.ticks
					store.objects.invoke('render')
				}
			}
		}catch(x){
			console.log(x)
		}
	}
	
})
