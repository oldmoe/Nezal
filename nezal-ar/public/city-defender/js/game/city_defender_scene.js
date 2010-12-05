var CityDefenderScene = Class.create(Scene, {
	fistCreep : false,
	startGame : false,
	firstHit : false,
	nukeCount : 2,
	healCount : 2,
	weakCount : 2,
	splashCount :2,
	hyperCount : 2,
	promoted : true,
	initialize : function($super,config,delay,replay){
		this.creeps = []
		this.turrets = []
		this.objects = []
		this.towerMutators = []
		this.creepMutators = []
		this.animations = []
		this.rockets = []
		this.events= []
		this.selectedTower = null
		this.stats = {
			towersCreated : 0,
			towersDestroyed : 0,
			creepsDestroyed : 0
		}

		this.waveNumber = 1
		$super(delay);
    this.scenario = new Scenario(this)
		this.scenario.start()
		if(!replay){
			this.randomizer = new Randomizer()
			this.replayEvents = []
			this.startTick = 0
			this.replay = false
		}else{
			this.replay = true			
			this.randomizer = new Randomizer(replay.randoms)
			for(var i=0;i<replay.replayEvents.length;i++){
				var event = replay.replayEvents[i]
				this.pushReplayEvent(event[0] - replay.startTick, event[1], event[2])
			}
		}
		this.config = Nezal.clone_obj(config)
		this.usedWeapons = {}
		var self = this;
		this.exp = this.config.exp
		this.wavesCount = this.config.waves.length
		if(!development&&this.config.ranks){
			this.minExp = this.config.ranks[this.config.rank][0]
			this.maxExp = this.config.ranks[this.config.rank][1]
		}else{
			this.minExp = this.maxExp = 0
		}
		this.nuke = new Nuke(this, {count: 2, type:'nuke'})
		this.heal = new Heal(this, {count: 2, type:'heal'})
		this.weak = new Weak(this, {count: 2, type:'weak'})
		this.splash = new Splash(this, {count: 2, type:'splash'})
		this.hyper = new Hyper(this, {count: 2, type:'hyper'})
		this.coins=this.config.coins
		this.rank = Config.rank
	},
	init : function(){
	},
	addTurret : function(klass_name, x, y){
		var klass = eval(klass_name)
		if(!this.replay){
			this.replayEvents.push([this.reactor.ticks, 'addTurret', [klass_name, x, y]])
		}
		var turret = new klass(x, y, this)
		this.towerMutators.each(function(mutator){
				mutator.action(turret)
		})
		this.turrets.push(turret)
		this.stats.towersCreated++
		this.money -= turret.price
		Map.grid[turret.gridX][turret.gridY].tower = turret
		return turret
	},
	addCreep : function(creep){
		creep.range+=1
		creep.maxHp = creep.maxHp/2
		creep.hp = creep.maxHp
		creep.price=creep.price*Math.pow(1.1,this.waveNumber)
		creep.hp = Math.round(creep.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		creep.power = Math.round(creep.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
		creep.maxHp = creep.hp
		this.creeps.push(creep)
		return this
	},
	addPlane : function(plane){
		plane.range+=1
	//	plane.rate+=0.1
		plane.maxHp = plane.maxHp/2
		plane.hp = plane.maxHp
		plane.price=plane.price*Math.pow(1.1,this.waveNumber)
		plane.hp = Math.round(plane.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		plane.power = Math.round(plane.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
		plane.maxHp = plane.hp
		return this
	},
  addRocket : function(rocket){
     this.rockets.push(rocket)
  },
  addPatriotRocket : function(patriotRocket){
     this.rockets.push(patriotRocket)
  },
    
	tick : function(){
		this.objects = this.invokeTick(this.objects);
		this.turrets = this.invokeTick(this.turrets);
		this.creeps = this.invokeTick(this.creeps);
		this.rockets = this.invokeTick(this.rockets);
		return this
	},
	invokeTick : function(arr){
		var newArr = []
		arr.each(function(obj){
			if(!obj.dead){
				obj.tick()
				newArr.push(obj)
			}
		})
		return newArr
	},
	fire : function(name){
		if(!this.replay){
			this.replayEvents.push([this.reactor.ticks, "fire", [name]])
		}
		this[name].fire()
	},
	
	doFire : function(name){
	},
	
	startAttack : function(){
		if(!this.replay){
			this.startTick = this.reactor.ticks
			this.replayEvents.push([this.startTick, 'startAttack'])
		}
		this.sendWaves(this.config)
		this.checkStatus()
	},
	checkStatus: function(){
		var self = this
		if(this.running && this.escaped >= this.maxEscaped){
			this.uploadScore(false,function(){self.end("lose")})
			return
		}else if(this.config && this.playing){
			if(this.config.waves.length == 0 && this.creeps.length == 0 && this.waitingCreeps == 0 ){
				this.uploadScore(true,function(){self.end("win");})                    		                                           
				return
			}else if(this.creeps.length == 0  &&this.waitingCreeps == 0 && this.config.waves.length > 0 && !this.wavePending && this.running){
				this.advanceWave()
			}
		}	
		var self = this
		this.push(2,function(){self.checkStatus()})
	},
  advanceWave : function(){
    	this.waveNumber++
		var score = this.waveNumber*(25-Math.round((this.reactor.ticks-this.startTime)*this.reactor.delay/1000)) 
		if(score>0)
		this.score+=score
		this.startTime = this.reactor.ticks
		this.planeAttack = false
		this.push(40, function(){this.sendWave(this.config.waves.pop())},this)
		this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
    	this.wavePending = true
  },
	uploadScore : function(win,callback){
    callback()
  },
  storeReplay : function(){
    if(!this.replay){
      var self = this
      var replay = {"startTick" : self.startTick, "replayEvents" : self.replayEvents, "randoms" : self.randomizer.randoms}
			new Ajax.Request('replay' ,
	     { method:'post',
        parameters: {'replay' : Object.toJSON(replay),'score':self.score,
'camp_name':Config.campaign,'mission_name':Config.mission.name,'level':Config.level}, 
	            onSuccess : function(t){
	            }
	      });
    }
  },
	end : function(state){
    this.reactor.stop()
    this.running = false
    //this.storeReplay()
    return this.score
	},
  start : function(){
		this.running = true
		this.init()
		this.reactor.run()
		var self = this
		this.push(1, function(){self._tick()})
		//this.renderStart()
		return this.score
	},
	sendWave : function(wave){
		this.wave++
		var slots = []
		for(var i=0;i<Map.height;i++){
			slots[i] = i;
		}
		var delay = 0
		var entry = Map.entry[0]
		var theta = 0
		var x = 0;
		var y = 0;
		if(entry[0] == 0){
			theta = 0
			x = 0
		}else if(entry[0] == Map.width - 1){
			theta = 180
			x = Map.width - 1
		}else if(entry[1] == 0){
			theta = 90
			y = 0	
		}else if(entry[1] == Map.height - 1){
			theta = 270
			y = Map.height - 1
		}
		var self = this
		wave.each(function(creep){
			var creepCat = eval(creep.category)
			for(var i=0; i < creep.count; i++){
				self.creepsCount ++
				var entry = Map.entry[Math.round(self.randomizer.next()*(Map.entry.length - 1))]
				if(creepCat == Plane || creepCat == RedPlane){
					var arr = [0,90,180,270]
					theta = arr[0]
					creep.theta = theta
					self.issueCreep(creep, 
							(theta == 90 || theta == 270) ? Math.round(self.randomizer.next()* (Map.width - 1)) : x,
							(theta == 0 || theta == 180) ? (Math.round(self.randomizer.next()* (Map.height - 2)) + 1) : y, 
							delay/self.reactor.delay, i == (creep.count - 1))
				}else{
					self.issueCreep(creep,  entry[0], entry[1], delay/self.reactor.delay, i == (creep.count - 1))
				}
				delay += 70*(32 / creepCat.prototype.speed) + 10//Math.ceil( 64 / Creep.speed)
				self.waitingCreeps++;
			}
		})
	},
	sendWaves : function(config){
		if(this.playing) return;
		this.playing = true;
		this.wave = 0
		this.startTime = this.reactor.ticks
		var wave = config.waves.pop()	
		if(wave){
			this.sendWave(wave);
			this.wavePending = true
		}
	},
	issueCreep : function(creep, x , y, delay, last){
		var self = this
		var creepCat = eval(creep.category)
		this.push(delay, function()
		{
				var obj = new creepCat(x, y,self,creep.values)
				if(creepCat == Plane || creepCat == RedPlane){
					self.addPlane(obj)
				}
				else{
					self.addCreep(obj)
				}
				self.creepMutators.each(function(mutator){
					mutator.action(obj)
				})
				self.waitingCreeps--
				if(last) self.wavePending = false;
				return obj
		}) 
	},
	sellSelectedTower: function(){
		if(!this.replay){this.replayEvents.push([this.reactor.ticks, "sellSelectedTower"])}
		this.money +=Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)
		Map.grid[this.selectedTower.gridX][this.selectedTower.gridY].tower = null
		this.selectedTower.destroy()
		this.selectedTower = null

	},
	takeSnapShot : function(type){
		try{
			 this.reactor.pause()
			 var tmpCanvas = document.createElement('canvas');
			 tmpCanvas.setAttribute('id','snap')
			 var img = new Image
			 img.src = $('gameForeground').toDataURL("image/png");
			 img.onload = function(){
				 $('snapshotWindow').show()
				 var backgroundImg = Loader.challenges[Config.campaign]['images/'+Config.missionPath+'/path.png']
				 var tmpCanvas = document.createElement('canvas');
				 tmpCanvas.width = backgroundImg.width
				 tmpCanvas.height = backgroundImg.height
				 var ctx= tmpCanvas.getContext('2d')
				 ctx.drawImage(backgroundImg,0,0)
				 ctx.drawImage(img,0,0)
				 var data = tmpCanvas.toDataURL("image/png")
				 $$('#snapshotWindow #snapshot')[0].setAttribute('data' , data);
				 $$('#snapshotWindow #snapshot')[0].src = data
				 $('snapshotWindow').show()
			 }
		 }catch(e){
			console.log(e)
		 }
	},
	shareSnapshot : function(){
		 FBDefender.publishSnapshot($$('#snapshotWindow #snapshot')[0].getAttribute('data'))
		 $('snapshotWindow').hide()
		this.reactor.resume()
	},
	saveSnapshot : function(){
		$('snapshotWindow').hide()
		document.location.href = strData = $$('#snapshotWindow #snapshot')[0].src.replace("image/png","image/octet-stream")
		this.reactor.resume()
	},
	closeSnapshot : function(){
		$('snapshotWindow').hide()
		this.reactor.resume()
	},
	upgradeSelectedTower: function(){
		if(!this.replay){this.replayEvents.push([this.reactor.ticks, "upgradeSelectedTower"])}
		var upgraded = this.selectedTower.upgrade()
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price > this.money){
			tower.statechange = true
			tower.upgradable = false
		}
		return upgraded
	},
	
	replayScene : function(){
		game.reset({startTick : this.startTick, replayEvents : this.replayEvents, randoms : this.randomizer.randoms})
	},
	
	pushReplayEvent : function(ticks, method, params){
		var self = this
		if(ticks < 0) ticks = 0
		self.reactor.push(ticks, function(){
			if(params){
				self[method].apply(self, params)
			}else{
				self[method]()
			}
		})
	},
	resetScene : function(){
		this.creeps.invoke('destroy')
		this.creeps = []
		this.turrets.invoke('destroy')
		this.turrets = []
		this.animations.invoke('finish')
		this.animations=[]
		this.objects.invoke('finish')
		this.objects=[]
	},
	selectTower : function(x, y){
		if(!this.replay) this.replayEvents.push([this.reactor.ticks, 'selectTower', [x, y]])
		this.selectedTower = Map.grid[x][y].tower
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price > this.money){
			tower.statechange = true
			tower.upgradable = false
		}
		this.selectedTowerHp = Map.grid[x][y].tower.hp
	},	
	waitingCreeps : 0,
	wavePending : false,
	escaped: 0,
	ctx : null,
	topCtx : null,
	maxEscaped : 20,
	money : 200,
	delay : 25,
	fps : 0,
	score: 0,
	moneyMultiplier: [1.1,1.1,1.1],
	creepMultiplier: [1.05,1.13,1.17],
	creepPowerMultiplier: [1.05,1.1,1.15],
	wave : 0,
	sound : true,
	wavesCount : 0,
	skipFrames : 0,
	statTextIndex :0
})
