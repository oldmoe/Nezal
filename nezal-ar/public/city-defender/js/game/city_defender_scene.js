var CityDefenderScene = Class.create(Scene, {
	fistCreep : false,
	startGame : false,
	firstHit : false,
	nukeCount : 2,
	healCount : 2,
	weakCount : 2,
	splashCount :2,
	hyperCount : 2,
	initialize : function($super,config,delay,baseCtx,upperCtx){
		this.creeps = []
		this.turrets = []
		this.objects = []
		this.towerMutators = []
		this.creepMutators = []
		this.animations = []
		this.rockets = []
		this.events= []
		this.creepMutators = []
		this.towerMutators = []
		this.stats = {
			towersCreated : 0,
			towersDestroyed : 0,
			creepsDestroyed : 0
		}
		this.waveNumber = 1
		$super(delay);
		//this.startTime = null
		this.config = Nezal.clone_obj(config)
		this.baseCtx = baseCtx;
		this.upperCtx = upperCtx;
		this.scenario = new Scenario(this)
		this.scenario.start()
		this.nuke = new Nuke(this, {count: this.nukeCount, type:'nuke'})
		this.heal = new Heal(this, {count: this.healCount, type:'heal'})
		this.weak = new Weak(this, {count: this.weakCount, type:'weak'})
		this.splash = new Splash(this, {count: this.splashCount, type:'splash'})
		this.hyper = new Hyper(this, {count: this.hyperCount, type:'hyper'})
		this.templates = {}
		this.selectedTurret = null
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
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
		this.layers.push(this.towerCannonLayer)
		this.layers.push(this.towerHealthLayer)
		this.layers.push(this.rocketsLayer)
		this.layers.push(this.rankLayer)
		var self = this
		this.config.superWeapons.each(function(weapon){
			weapon = weapon.toLowerCase()
			var div = $$('#gameElements .superWeapons div.'+weapon)[0].setOpacity(1)
		})
		this.renderData()
		this.checkStatus()

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
		creep.hp = Math.round(creep.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		creep.maxHp = creep.hp
		if(creep){
			if(!this.firstCreep){
				if(this.turrets[0])this.scenario.notify({name:"startGame", method: true, unit:this.turrets[0]})
				this.firstCreep = true
				this.scenario.notify({name:"firstTank", unit:creep})
			}
			this.creepsLayer.attach(creep.sprite)
			this.creeps.push(creep)	
		}
		return this
	},
	addPlane : function(plane){
		plane.hp = Math.round(plane.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		plane.maxHp = plane.hp
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
		var self = this
		this.config.superWeapons.each(function(weapon){
			weapon = weapon.toLowerCase()
			$(weapon).innerHTML = self[weapon].count
		})
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
		var self = this
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.observe('click', function(){self.fire(div.className)})}
		})
		var startDev = $$('#gameElements .start').first()
		startDev.addClassName('resumed')
		$$(".startText").first().innerHTML = T.pause
		startDev.stopObserving('click')
		$$(".start").first().observe('click', function(){self.pause()})
	},
	renderPause: function(){
		var pauseDev = $$('#gameElements .resumed').first()
		$$(".startText").first().innerHTML = T.resume
		pauseDev.removeClassName('resumed')
		pauseDev.addClassName('paused')
		$$(".start").first().stopObserving('click')
		var self = this
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})
		$$(".start").first().observe('click', function(){self.resume()})	
	},
	renderResume: function(){
		var resumeDev = $$('#gameElements .paused').first()
		$$(".startText").first().innerHTML = T.pause
		resumeDev.removeClassName('paused')
		resumeDev.addClassName('resumed')
		$$(".start").first().stopObserving('click')
		var self = this
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.observe('click', function(){self.fire(div.className)})}
		})
		$$(".start").first().observe('click', function(){self.pause()})
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
			this.lose();this.uploadScore(false)
			return
		}else if(this.config && this.playing){
			if(this.config.waves.length == 0 && this.creeps.length == 0 && this.waitingCreeps == 0 ){
				this.win();this.uploadScore(true)
				return
			}else if(this.creeps.length == 0  &&this.waitingCreeps == 0 && this.config.waves.length > 0 && !this.wavePending && this.running){
				this.waveNumber++
				var score = 10*(this.waveNumber+5-Math.round((new Date()-this.startTime)/1000)) 
				if(score>0)
				this.score+=score
				this.startTime = new Date()
				this.push(50, function(){this.sendWave(this.config.waves.pop())},this)
				this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
				this.wavePending = true
			}
		}	
		var self = this
		this.push(50,function(){self.checkStatus()})
	},
	win: function(){
		this.running = false
		$("result").addClassName('win');
		$('loseImage').hide()
		$('winImage').show()
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
		$('winImage').hide()
		$('loseImage').show()
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
		wave.each(function(creep){
			var creepCat = eval(creep.category)
			for(var i=0; i < creep.count; i++){
				self.creepsCount ++
				var entry = Map.entry[Math.round(Math.random()*(Map.entry.length - 1))]
				if(creepCat == Plane || creepCat == RedPlane){
					creep.theta = theta;
					self.issueCreep(creep, 
							(theta == 90 || theta == 270) ? Math.round(Math.random()* (Map.width - 1)) : x,
							(theta == 0 || theta == 180) ? (Math.round(Math.random()* (Map.height - 2)) + 1) : y, 
							delay)
				}else{
					self.issueCreep(creep,  entry[0], entry[1], delay)
				}
				delay += 70*(32 / creepCat.prototype.speed) + 10//Math.ceil( 64 / Creep.speed)
				self.waitingCreeps++;
			}
			self.push(delay + (32 / creepCat.prototype.speed), function(){
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
		this.startTime = new Date()
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
		var creepCat = eval(creep.category)
		this.push(delay, function()
		{
			try{
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
			}catch(e){
				console.log(e)
			}
		})
	},
	uploadScore : function(win){
		this.score*=this.config.level
		// Upload Score code goes here
		var callback = function(){}
    Intro.sendScore(this.score, win, callback);
	},
	waitingCreeps : 0,
	wavePending : false,
	escaped: 0,
	ctx : null,
	topCtx : null,
	maxEscaped : 20,
	money : 100,
	delay : 25,
	fps : 0,
	score: 0,
	moneyMultiplier: [1.2,1.1,1.05],
	creepMultiplier: [1.05,1.075,1.1],
	selectedTurret : null,
	wave : 0,
	sound : true,
	wavesCount : 0,
	skipFrames : 0
})
