var Scenario = Class.create({
	events : [],
	currentEvent : null,
	scenario : {},
	eventNames: {},
	eventRunning : false,
	firstTick : 0,
	initialize : function(scene){
		this.scene = scene
		this.formScenario()
	},
	notify : function(event){
	/*
		if(event.name == "firstHit")event.unit = this.currentEvent.unit
		this.events.push(event)
		console.log(this.events[0])
		this.eventNames[event.name] = true
		*/
	},
	start : function(){
		this._speak()
	},
	_speak : function(){
		try{
		if(this.currentEvent&&!this.currentEvent.method){
			if(this.firstTick == 0)this.firstTick++
			else{
				this.firstTick = 0
				this.currentEvent.unit.destroyBaloon()
				this.eventRunning = false
			}
		}
		if(!this.eventRunning&&this.events.length>0){
			this.eventRunning = true
			this.currentEvent = this.events.pop()
			this.currentEvent.unit.createBaloon()
			console.log('created',this.currentEvent.unit.baloon)
			if(this.currentEvent.unit)this.currentEvent.unit.baloon.text.innerHTML = this.scenario[this.currentEvent.name]
			if(this.currentEvent.method)this[this.currentEvent.name]()
		}
		var self = this
		this.scene.push(500, function(){ self._speak() })
		}catch(e){
		}
	},

	formScenario : function(){
		this.scenario['startGame'] = "Hold!"
		this.scenario['firstTank'] = "we will crush u niahahah."
		this.scenario['firstHit'] = "FIRRREE!!"
	},
	startGame : function(){
		var baloon = this.currentEvent.unit.baloon
		if(baloon.visible)baloon.visible = false 
		else baloon.visible = true
		if(!this.eventNames['firstHit'])this.scene.push(500, this.startGame,this)
		else{ baloon.destroy();this.eventRunning = false}
	},
	
})