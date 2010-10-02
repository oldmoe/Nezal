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
	initialize : function($super,config,delay,baseCtx,upperCtx){
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
		this.config = Nezal.clone_obj(config)
		this.usedWeapons = {}
		var self = this;
		this.config.superWeapons.each( function(weapon){
			self.usedWeapons[weapon.capitalize()] = 0;
		});
		this.exp = this.config.exp
		this.wavesCount = this.config.waves.length
		if(!development){
			this.minExp = Intro.ranks[this.config.rank][0]
			this.maxExp = Intro.ranks[this.config.rank][1]
		}else{
			this.minExp = this.maxExp = 0
		}
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
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
		IncomingWaves.init("container","wavesTemplate","incomingWaves",this.reactor)
	},
	init : function(){
		this.rank = Config.rank
		this.skipFrames = 0
		this.creepsLayer = new Layer(this.upperCtx);
		this.creepsLayer.clear = true
		this.layers.push(this.creepsLayer);
		this.basesLayer = new Layer(this.baseCtx)
		this.rangesLayer = new Layer(this.baseCtx)
		this.rangesLayer.clear = true
		this.towerCannonLayer = new Layer(this.upperCtx)
		this.rocketsLayer = new Layer(this.upperCtx)
		this.towerHealthLayer = new Layer(this.upperCtx)
		this.rankLayer = new Layer(this.upperCtx)
		this.layers.push(this.rangesLayer)
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
		this.towerMutators.each(function(mutator){
				mutator.action(turret)
		})
		this.turrets.push(turret)
		Map.grid[turret.gridX][turret.gridY].tower = turret
		this.rangesLayer.attach(turret.rangeSprite)
		this.basesLayer.attach(turret.baseSprite)
		this.towerCannonLayer.attach(turret.cannonSprite)
		this.towerHealthLayer.attach(turret.healthSprite)
		if(turret.rocketSprite)this.towerHealthLayer.attach(turret.rocketSprite)
		this.rankLayer.attach(turret.rankSprite)
		return this
	},
	addCreep : function(creep){
		creep.range+=1
		//creep.rate+=0.1
		creep.maxHp = creep.maxHp/2
		creep.hp = creep.maxHp
		creep.price=creep.price+0.25*this.waveNumber
		this.scenario.notify({name:"creepEntered", method: false, unit:creep})
		if(this.turrets[0])this.scenario.notify({name:"creepEnteredTower", method: false, unit:this.turrets[0]})
		creep.hp = Math.round(creep.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		creep.power = Math.round(creep.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
		creep.maxHp = creep.hp
		if(creep){
			if(!this.firstCreep){
				this.firstCreep = true
			}
			this.creepsLayer.attach(creep.sprite)
			this.creeps.push(creep)	
		}
		return this
	},
	addPlane : function(plane){
		plane.range+=1
	//	plane.rate+=0.1
		plane.maxHp = plane.maxHp/2
		plane.hp = plane.maxHp
		plane.price=plane.price+0.25*this.waveNumber
		plane.hp = Math.round(plane.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
		plane.power = Math.round(plane.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
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
		//this.currentExp = Math.round(this.exp+this.score/75)
		this.currentExp = this.exp
		if(this.currentExp>this.maxExp){
			this.minExp = this.maxExp	
			this.maxExp = this.maxExp*2
		}
		$('statusBarFill').style.width = ((this.currentExp-this.minExp)/(this.maxExp-this.minExp))*100+"%"
		$('money').innerHTML = this.money;
		$('lives').innerHTML = window.Text.game.upperBar.lives+" "+Math.max(this.maxEscaped - this.escaped,0);
		$('score').innerHTML = window.Text.game.upperBar.score+" "+this.score;
		var self = this
		$('waves').innerHTML = window.Text.game.upperBar.wave+" "+this.wave +'/'+this.wavesCount;
			$('towerInfo').show()
			$('towerInfo').innerHTML = this.templates['towerInfo'].process({tower: this.selectedTower})
			if(this.selectedTower && this.selectedTower.healthSprite){
				$('upgradeTower').observe('mouseenter',function(){self.updateMeters(self.selectedTower)}).observe('mouseover',function(){self.updateMeters(self.selectedTower)})
			}
		var self = this
		this.push(500, function(){self.renderData()})
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
			this.usedWeapons[name.capitalize()] ++;
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
			if(Config.superWeapons.indexOf(div.className.capitalize())!=-1){
			self[div.className].active = true
			div.observe('click', function(){self.fire(div.className)})
			}
		})
		Sounds.play(Sounds.gameSounds.pause)
		var startDev = $$('#gameElements .start').first()
		startDev.addClassName('resumed')
		$$(".startText").first().innerHTML = window.Text.game.gameState.pause
		startDev.stopObserving('click')
		$$(".start").first().observe('click', function(){self.pause()})
	},
	renderPause: function(){
		soundManager.mute()
		Sounds.gameSounds.game[0].pause()
		$('pauseWindow').show()	
		Sounds.play(Sounds.gameSounds.pause)
		var pauseDev = $$('#gameElements .resumed').first()
		$$(".startText").first().innerHTML =  window.Text.game.gameState.resume
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
		soundManager.unmute()
		Sounds.gameSounds.game[0].resume()
		$('pauseWindow').hide()
		Sounds.play(Sounds.gameSounds.pause)
		var resumeDev = $$('#gameElements .paused').first()
		$$(".startText").first().innerHTML = window.Text.game.gameState.pause
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
		$$('#score #scoreValue').first().innerHTML = this.score
		//console.log(this.statsText)
		if(this.statText){
			if(this.statText.length == this.statTextIndex){
				this.statText = ''
				this.reactor.pause()
				this.statTextIndex = 0
				return
			}else{
				var data = $('stats').innerHTML
				$('stats').innerHTML = data + this.statText[this.statTextIndex]
				this.statTextIndex++
			}
		}else{
			this.statTextIndex = 0
			$('stats').innerHTML = ''
		}
		var self = this
		this.push(50,function(){self.displayStats()})
	},
	checkStatus: function(){
		var self = game.scene
		if(this.running && this.escaped >= this.maxEscaped){
			this.uploadScore(false,function(){self.end("lose")})
			return
		}else if(this.config && this.playing){
			if(this.config.waves.length == 0 && this.creeps.length == 0 && this.waitingCreeps == 0 ){
				this.uploadScore(true,function(){self.end("win");})                    		                                           
				return
			}else if(this.creeps.length == 0  &&this.waitingCreeps == 0 && this.config.waves.length > 0 && !this.wavePending && this.running){
				this.waveNumber++
				IncomingWaves.nextWave()
				var score = 10*(this.waveNumber+5-Math.round((new Date()-this.startTime)/1000)) 
				if(score>0)
				this.score+=score
				this.startTime = new Date()
				this.push(2000, function(){this.sendWave(this.config.waves.pop())},this)
				var oldMoney = this.money
				this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
				if((this.money-oldMoney)>0) this.objects.push(new MoneyAnimation(695,100,this.money-oldMoney))
				this.wavePending = true
			}
		}	
		var self = this
		this.push(50,function(){self.checkStatus()})
	},
	promoteUser : function(win){
		Sounds.play(Sounds.gameSounds.rank_promotion)
		$('pauseWindow').style.zIndex = 302
		$('pauseWindow').show()	
		$('popup').show()
		$$('#popup #congratsContent').first().innerHTML = "Congratulations"
		$$('#popup #promotedContent').first().innerHTML = "You have been promoted, you are now a "+window.Text.game.ranks[Config.rank].name
		game.scene.rank = Config.rank
		var img = document.createElement("IMG");
		img.src = "images/intro/ranks/" + Config.rank + ".png";
		$$('#popup #rankImg').first().appendChild(img)
		$$('#rank img')[0].src = "images/intro/ranks/" + Config.rank + ".png";
		if(win){
			$('popupClose').observe('click',win)
			$('popupOk').observe('click',win)
			FBDefender.publishRankPromotion({name : Config.rank, image : "fb-" + Config.rank + '.png'});
		}
		else{
			
		}
		
	},
	end : function(state){
		var self = game.scene
		self.push(2000,function(){
		game.scene.running = false
		$("result").addClassName(state);
		var resultText = window.Text.game.result
		if(state == "win"){
				function win(){	
						self.statText = resultText.winMission1 +" " +Intro.campaignData.missionsInfo[Config.missionPath]['name']+" "+resultText.winMission2+"\n\n"+resultText.enemies+"\t"+resultText.destroyed+" "
						+self.stats.creepsDestroyed+"\t"+resultText.escaped+" "+self.escaped+"\n"+resultText.towers+"\t"+resultText.built+" "
						+self.stats.towersCreated+"\t"+resultText.destroyed+" "+self.stats.towersDestroyed
						$('pauseWindow').style.zIndex = 299
						$('pauseWindow').hide()	
						$('popup').hide()
						$('popupOk').stopObserving('click')
						$$('#result #lose').first().hide()
						$$('#result #win').first().show()
						new Effect.Appear("static")
						$('droppingGround').addClassName('off')
						new Effect.SwitchOff('static');
						new Effect.Appear("result", {delay : 3.0})
						game.scene.push(3000,function(){
							Sounds.play(Sounds.gameSounds[state])
							Sounds.gameSounds.game[0].togglePause()
						})
						game.scene.push(3000,function(){self.displayStats()})
						game.scene.push(4000,function(){
						  FBDefender.publishMissionCompletion({name : GameConfigs.missionPath,
													 score : self.score});
                                           });
					}
				if(game.scene.rank!=Config.rank){
					self.promoteUser(win)
				}else{
					win()
				}
		}
		else{
			self.statText = Intro.campaignData.missionsInfo[Config.missionPath]['name']+" "+resultText.loseMission +"\n\n"+resultText.enemies+"\t"+resultText.destroyed+" "
			+self.stats.creepsDestroyed+"\t"+resultText.escaped+" "+self.escaped+"\n"+resultText.towers+"\t"+resultText.built+" "
			+self.stats.towersCreated+"\t"+resultText.destroyed+" "+self.stats.towersDestroyed
			$$('#result #win').first().hide()
			$$('#result #lose').first().show()
			new Effect.Appear("static")
			$('droppingGround').addClassName('off')
			new Effect.SwitchOff('static');
			new Effect.Appear("result", {delay : 3.0})
			game.scene.push(3000,function(){
			Sounds.gameSounds.game[0].togglePause()
			Sounds.play(Sounds.gameSounds[state])
			})
			game.scene.push(3000,function(){self.displayStats()})
		}

		})
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
					var arr = [0,90,180,270]
					theta = arr[0]
					creep.theta = theta
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
	uploadScore : function(win,callback){
		// Upload Score code goes here
		  var currRank = Config.rank;
			onSuccess = function() {
			    //Here we make the rank 
		      $$('#rank img')[0].src = "images/intro/ranks/" + Config.rank + ".png";
		      $$('.rankName')[0].innerHTML = window.Text.game.ranks[Config.rank].abbr;
		      callback();
		  }
		  Intro.sendScore(this.score, win, onSuccess);
	},
	sellSelectedTower: function(){
		this.money +=Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)
		Map.grid[this.selectedTower.gridX][this.selectedTower.gridY].tower = null
		this.selectedTower.destroySprites()
		this.selectedTower = null
		Sounds.play(Sounds.gameSounds.click)
	},
	upgradeSelectedTower: function(){
		this.selectedTower.upgrade()
		Sounds.play(Sounds.gameSounds.click)

	},
	updateMeters : function(tower){
		if(tower.upgrades[tower.rank]){
			if(tower.upgrades[tower.rank].power)
			$('powerMeter').style.borderRight = (tower.upgrades[tower.rank].power-tower.power)*65/450+"px solid red"
			if(tower.upgrades[tower.rank].rate)
			$('rateMeter').style.borderRight = (tower.upgrades[tower.rank].rate-tower.rate)*65/1+"px solid red"
			if(tower.upgrades[tower.rank].range)
			$('rangeMeter').style.borderRight = (tower.upgrades[tower.rank].range-tower.range)*65/6+"px solid red"
			if(tower.upgrades[tower.rank].maxHp)
			$('shieldsMeter').style.borderRight = (tower.upgrades[tower.rank].maxHp-tower.maxHp)*65/3100+"px solid red"
		}
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
	moneyMultiplier: [1.2,1.1,1.05],
	creepMultiplier: [1.05,1.1,1.15],
	creepPowerMultiplier: [1.1,1.15,1.2],
	wave : 0,
	sound : true,
	wavesCount : 0,
	skipFrames : 0,
	statTextIndex :0
})
