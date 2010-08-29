var CityDefenderScene = Class.create(Scene, {
	creeps : [],
	turrets : [],
	objects : [],
	towerMutators : [],
	creepMutators : [],
	fistCreep : false,
	startGame : false,
	firstHit : false,
	initialize : function($super,config,delay,baseCtx,upperCtx){
		$super(delay);
		this.config = config
		this.baseCtx = baseCtx;
		this.upperCtx = upperCtx;
		this.scenario = new Scenario(this)
		this.scenario.start()
		this.nuke = new Nuke(this, {count: 2, type:'nuke'})
		this.heal = new Heal(this, {count: 2, type:'heal'})
		this.weak = new Weak(this, {count: 2, type:'weak'})
		this.splash = new Splash(this, {count: 2, type:'splash'})
		this.hyper = new Hyper(this, {count: 2, type:'hyper'})
		this.templates = {}
		this.selectedTurret = null
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
		this.renderData()
		this.checkStatus()
	},
	init : function(){
		this.skipFrames = 0
		this.creepsLayer = new Layer(this.upperCtx);
		this.creepsLayer.clear = true
		this.layers.push(this.creepsLayer);
		this.basesLayer = new Layer(this.baseCtx)
		this.basesLayer.clear = true
		this.towerCannonLayer = new Layer(this.upperCtx)
		this.rocketsLayer = new Layer(this.upperCtx)
		this.towerHealthLayer = new Layer(this.upperCtx)
		this.rankLayer = new Layer(this.upperCtx)
		this.layers.push(this.basesLayer)
		this.layers.push(this.rocketsLayer)
		this.layers.push(this.towerCannonLayer)
		this.layers.push(this.towerHealthLayer)
		this.layers.push(this.rankLayer)
		return this
	},
	addTurret : function(turret){
		if(!turret)var turret = new Turret(10, 4,this)	
		this.turrets.push(turret)
		Map.grid[turret.gridX][turret.gridY].tower = turret
		this.basesLayer.attach(turret.baseSprite)
		this.towerCannonLayer.attach(turret.cannonSprite)
		this.towerHealthLayer.attach(turret.healthSprite)
		if(turret.rocketSprite)this.towerHealthLayer.attach(turret.rocketSprite)
		this.rankLayer.attach(turret.rankSprite)
		return this
	},
	addCreep : function(creep){
		if(creep){
			if(!this.firstCreep){
				//if(this.turrets[0])this.scenario.notify({name:"startGame", method: true, unit:this.turrets[0]})
				this.firstCreep = true
				//this.scenario.notify({name:"firstTank", unit:creep})
			}
			this.creepsLayer.attach(creep.sprite)
			this.creeps.push(creep)	
		}
		return this
	},
	addPlane : function(plane){
		if(plane){
			this.rocketsLayer.attach(plane.shadowSprite);
			this.rocketsLayer.attach(plane.cannonSprite);
			this.rocketsLayer.attach(plane.healthSprite);
			this.creeps.push(plane)
		}
		return this
	},
	render : function($super){
		if(this.skipFrames == 0){
			var startTime = new Date
			$super()
			if(GhostTurret && GhostTurret.selected && GhostTurret.isIn){
				GhostTurret.render(this.upperCtx)
			}
			var delay = new Date - startTime
			this.fps = Math.round(1000/(delay))
			if(delay > this.delay){
				this.skipFrames = Math.ceil(delay / this.delay)
			}
		}else{
			this.skipFrames--;
		}	
	},
	renderData : function(){
		$('money').innerHTML = this.money;
		$('lives').innerHTML = this.maxEscaped - this.escaped;
		$('score').innerHTML = this.score;
		//$$('#gameElements .fps').first().innerHTML = "FPS: "+this.fps;
		$('splash').innerHTML = this.splash.count
		$('heal').innerHTML = this.heal.count
		$('nuke').innerHTML = this.nuke.count
		$('weak').innerHTML = this.weak.count
		$('hyper').innerHTML = this.hyper.count
		$('waves').innerHTML = this.wave +'/'+this.wavesCount;
		if(this.selectedTurret){
			$('towerInfo').innerHTML = this.templates['towerInfo'].process({unit: this.selectedTurret})
		}
		Upgrades.render();
		var self = this
		this.push(500,function(){self.renderData()})
	},
	tick : function(){
		this.objects = this.invokeTick(this.objects);
		this.turrets = this.invokeTick(this.turrets);
		this.creeps = this.invokeTick(this.creeps);
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
		try{
			this[name].fire()
		}catch(e){
		}	
	},
	startAttack : function(){
		this.sendWaves(this.config)
		this.renderStartAttack()
	},
	renderStartAttack: function(){
		var startDev = $$('#gameElements .start').first()
		startDev.addClassName('resumed')
		startDev.stopObserving('click')
		var self = this
		startDev.observe('click', function(){self.pause()})
	},
	renderPause: function(){
		var pauseDev = $$('#gameElements .resumed').first()
		pauseDev.removeClassName('resumed')
		pauseDev.addClassName('paused')
		pauseDev.stopObserving('click')
		var self = this
		pauseDev.observe('click', function(){self.resume()})	
	},
	renderResume: function(){
		var resumeDev = $$('#gameElements .paused').first()
		resumeDev.removeClassName('paused')
		resumeDev.addClassName('resumed')
		resumeDev.stopObserving('click')
		var self = this
		resumeDev.observe('click', function(){self.pause()})
	},
	displayStats : function(){
		if(this.statText){
			if(this.statText.length == this.statTextIndex){
				this.statText = ''
				this.reactor.pause()
				return
			}else{
				var data = $('stats').innerHTML
				$('stats').innerHTML = data + this.statText[this.statTextIndex]
				this.statTextIndex++
			}
		}else{
			this.statText = this.templates['stats'].process({})
			this.statTextIndex = 0
			$('stats').innerHTML = ''
		}
		var self = this
		this.push(50,function(){self.displayStats()})
	},
	checkStatus: function(){
		if(this.running && this.escaped >= this.maxEscaped){
			this.lose();
			return
		}else if(this.config && this.playing){
			if(this.config.waves.length == 0 && this.creeps.length == 0 && this.waitingCreeps == 0 ){
				this.win();
				return
			}else if(this.creeps.length == 0  &&this.waitingCreeps == 0 && this.config.waves.length > 0 && !this.wavePending && this.running){
				this.push(50, function(){this.sendWave(this.config.waves.pop())},this)
				this.wavePending = true
			}
		}	
		var self = this
		this.push(50,function(){self.checkStatus()})
	},
	win: function(){
		this.running = false
		$("result").addClassName('win');
		var img = document.createElement("IMG");
		img.src = "images/background/win.png";
		$('result').appendChild(img);
		$('static').show();
		$('droppingGround').addClassName('off')
		new Effect.SwitchOff('static');
		new Effect.Appear("result", {delay : 1.0})
		var self = this
		this.push(1000,function(){self.displayStats()})
	},
	lose : function(){
		this.running = false
		$("result").addClassName('lose');
		var img = document.createElement("IMG");
		img.src = "images/background/lose.png";
		$('result').appendChild(img);
		$('static').show();
		$('droppingGround').addClassName('off')
		new Effect.SwitchOff('static');
		new Effect.Appear("result", {delay : 1.0})
		var self = this
		this.push(1000,function(){self.displayStats()})
	},
	sendWave : function(wave){
		this.wave++
		var slots = []
		for(var i=0;i<Map.height;i++){
			slots[i] = i;
		}
		var canvas = $('gameForeground')
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
			x = map.width - 1
		}else if(entry[1] == 0){
			theta = 90
			y = 0	
		}else if(entry[1] == Map.height - 1){
			theta = 270
			y = Map.height - 1
		}
		var self = this
		wave.creeps.each(function(creep){
			for(var i=0; i < creep.count; i++){
				self.creepsCount ++
				var entry = Map.entry[Math.round(Math.random()*(Map.entry.length - 1))]
				if(creep.category == Plane || creep.category == RedPlane){
					creep.theta = theta;
					self.issueCreep(creep, 
							(theta == 90 || theta == 270) ? Math.round(Math.random()* (Map.width - 1)) : x,
							(theta == 0 || theta == 180) ? (Math.round(Math.random()* (Map.height - 2)) + 1) : y, 
							delay)
				}else{
					self.issueCreep(creep,  entry[0], entry[1], delay)
				}
				delay += 70*(32 / creep.category.prototype.speed) + 10//Math.ceil( 64 / Creep.speed)
				self.waitingCreeps++;
			}
			self.push(delay + (32 / creep.category.prototype.speed), function(){
			self.wavePending = false;
			})
		})
	},
	sendWaves : function(config){
		if(this.playing) return;
		this.playing = true;
		this.wavesCount = this.config.waves.length
		this.wavesCount = this.config.waves.length
		this.wave = 0
		var wave = config.waves.pop()
		if(wave){
			this.sendWave(wave);
			this.wavePending = true
		}else{
			// game finished
		}
	},
	issueCreep : function(creep, x , y, delay){
		var self = this
		this.push(delay, function()
		{
			try{
				var obj = new creep.category(x, y,self,creep.values)
				if(creep.category == Plane || creep.category == RedPlane){
					self.addPlane(obj)
				}
				else{
					self.addCreep(obj)
				}
				self.creepMutators.each(function(mutator){
					mutator.action(obj)
				})
				self.waitingCreeps--		
			}catch(e){
				console.log(e)
			}
		})
	},
	waitingCreeps : 0,
	wavePending : false,
	escaped: 0,
	ctx : null,
	topCtx : null,
	maxEscaped : 20,
	money : 100,
	delay : 25,
	animations : [],
	events : [],
	creepMutators : [],
	towerMutators : [],
	fps : 0,
	score: 0,
	selectedTurret : null,
	wave : 0,
	sound : true,
	wavesCount : 0,
	skipFrames : 0,
	superWeapons : {
		weak : {max : 5, used : 0, factor: 2} ,
		hyper : {max : 5, used : 0, factor: 2} ,
		nuke : {max : 1, used : 0},
		heal : {max : 3, used : 0},
		splash : {max : 3, used : 0},
	},
	stats : {
		towersCreated : 0,
		towersDestroyed : 0,
		creepsDestroyed : 0
	}
})