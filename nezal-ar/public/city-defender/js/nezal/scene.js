
//rendering all layers
var _Render = {
	renderInitialize : function(){
		this.layers = []
		this.objects = []
		return this
	},
	renderInit : null,
	render : function(){
		this.layers.invoke('render')
		return this
	},
	renderStart : null,
	renderPause : null,
	renderResume : null,
	renderReset : null,
	renderFinsih : null,
	renderToggleSound : null
}

var Scene = Class.create(_Render, {
	//initializes the delay of the reactor
	initialize : function(delay){
		this.running = false
		this.delay = delay || 50
		this.reactor = new Reactor(this.delay)
		this.renderInitialize()
	},

	init : function(){
	},
	
	//pushes an event to the reactor
	push : function(delay, func, callback){
		this.reactor.push(delay, func, callback)
		return this
	},
	//runs the reactor , starts _tick function and then render the start
	start : function(){
		this.running = true
		this.init()
		this.reactor.run()
		var self = this
		this.push(1, function(){self._tick()})
		//this.renderStart()
		return this
	},
	pause : function(){
		this.running = false
		this.reactor.pause()
		this.renderPause()
		return this
	},
	renderPause : function(){
	
	},
	resume : function(){
		this.running = true
		this.reactor.resume()
		this.renderResume()
		return this
	},
	renderResume : function(){
	
	},
	reset : function(){
		this.running = false
		this.reactor.stop()
		this.renderReset()
		return this
	},
	
	finish : Nezal.notImplemented('Game#finish'),
	
	tick : function(){
		try{
			var remainingObjects = []
			var self = this
			this.objects.each(function(object){
				if(!object.dead){
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
		if(!this.running) return
		this.tick()
		this.render()
		var self = this
		this.push(1, function(){self._tick()})
	},
	render : function(){
		try{
			this.layers.invoke('render');
		}catch(x){
			console.log(x)
		}
	},
	toggleSound : function(){
		Game.sound = !Game.sound
		this.renderToggleSound(Game.sound)
		return this
	}
	
})
