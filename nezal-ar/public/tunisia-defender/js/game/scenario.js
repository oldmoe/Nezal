var Scenario = Class.create({
	events : [],
	currentEvent : null,
	scenario : {},
	eventNames: {},
	eventRunning : false,
	firstTick : 0,
	initialize : function(scene){
		this.scene = scene
	},
	notify : function(event){
	  if(event.unit && (!event.unit.display||event.unit.constructor==Plane||event.unit.constructor==RedPlane))return
	  var x = this.scene.randomizer.next()
	  if((x<0.1&&event.unit)||(event.name!="creepEnteredTower"&&event.name!="creepEntered"&&event.name!="towerDestroyedCreep")){
		  event['tick']=0
		  event['created'] = false
		  event['finished'] = false
		  this.events.push(event)
		  this.eventNames[event.name] = true
	  }
	},
	start : function(){
		this._speak()
	},
	_speak : function(){
		for(var i = 0; i<this.events.size();i++){
			var event = this.events[i]
			if(event.tick < 4){
				if(event.created)
					event.tick++
				else{
					if(event.unit&&event.unit.baloon){
						event.finished = true
					}
					else if(event.unit && event.unit.display&&!event.unit.dead){
						var baloonNum = 2
						if(event.unit.parent == "creep") baloonNum = 1
						event.unit.display.createBaloon(baloonNum)
						event.created = true
						event.unit.display.baloon.text.innerHTML = window.Text.game[event.name][Math.round(this.scene.randomizer.next()*(Text.game[event.name].length-1))]
						if(event.method)this[event.name]()
					}
				}					
			}else{
				if(event.unit&&!event.unit.dead&&event.unit.display.baloon)event.unit.display.destroyBaloon()
				event.finished = true
			}
		}
		var arr = []
		for(var i = 0; i<this.events.size();i++){
			if(!this.events[i].finished){
				arr.push(this.events[i])
			}
		}
		this.events = arr
		var self = this
		this.scene.reactor.push(10, function(){ self._speak() })
	},

	formScenario : function(){
		this.scenario['creepDestroyed'] = ["ARRGGHH!","NOOO!!!","SEE YOU IN HELLLL!", "I AM DYING!!", "OUCH!!", "#3aaaa!", "TEEET!", "#^$?!"]
		this.scenario['towerDestroyedCreep'] = ["Who's next?!","BRING IT ON!!!", "Die, Die, Die", "Did it hurt?", "Take that!"]
		this.scenario['towerDestroyed'] = ["ARRGGHH!","NOOO!!!","I DIE IN HONOR!", "I AM DYING!!", "OUCH!!", "#3aaaa!", "TEEET!", "#^$?!"]
		this.scenario['creepDestroyedTower'] = ["Oops, was that a tower?","WE WILL CRUSH'em!!!", "Die, Die, Die", "Hurray!", "Take that!", "FATALITY!"]
		this.scenario['superWeaponsHeal'] = ["Just in time!","Thanks Man!", "Feels Better!"]
		this.scenario['superWeaponsWeak'] = ["I AM BLIND!","Cough, cough!", "I feel s l e e p y!"]
		this.scenario['superWeaponsSplash'] = ["What is this?!","Run!!", "Rockets, Run!"]
		this.scenario['superWeaponsNuke'] = ["Wha..","Ru...", "I see a ...", "Lights ...", "#3aaaa.."]
		this.scenario['superWeaponsHyper'] = ["COFFEE!!","GOOD STUFF!!", "I AM HYPER!!", "WEEHAAAA!"]
		this.scenario['creepEntered'] = ["Born to destroy!!","ATTAAACK!!", "RUN THEM OVER!!", "CRUSH THEM!"]
		this.scenario['creepEnteredTower'] = ["BRING IT ON!!","HOLD!!", "STAND YOUR GROUND!!", "That's all you got?"]

	}

	
})
