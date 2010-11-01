var CityDefenderScene = Class.create(Scene, {
	fistCreep : false,
	startGame : false,
	firstHit : false,
	upgraded : false,
	nukeCount : 2,
	healCount : 2,
	weakCount : 2,
	splashCount :2,
	hyperCount : 2,
	promoted : true,
	initialize : function($super,config,delay,baseCtx,upperCtx,replay){
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
		$$('.status').first().title = "XP: "+this.exp+"/"+(this.maxExp+1)
		$$('#gameElements #exp').first().innerHTML = "XP "+this.exp+"/"+(this.maxExp+1)
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
		this.coins=Intro.userData.coins
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
		IncomingWaves.init($("container"),$("wavesTemplate"),"incomingWaves",this.reactor)
	},
	init : function(){
		this.rank = Config.rank
		this.skipFrames = 0
		this.creepsLayer = new Layer(this.upperCtx);
		this.creepsLayer.clear = true
		this.layers.push(this.creepsLayer);
		this.basesLayer = new Layer(this.upperCtx)
		this.rangesLayer = new Layer(this.upperCtx)
		//this.rangesLayer.clear = true
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
	addTurret : function(klass, x, y){
		if(!this.replay){
			this.replayEvents.push([this.reactor.ticks, 'addTurret', [klass, x, y]])
		}
		Sounds.play(Sounds.gameSounds.correct_tower)
		var turret = new klass(x, y, this)
		this.towerMutators.each(function(mutator){
				mutator.action(turret)
		})
		this.turrets.push(turret)
		this.stats.towersCreated++
		this.money -= turret.price
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
		creep.price=creep.price*Math.pow(1.1,this.waveNumber)
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
		plane.price=plane.price*Math.pow(1.1,this.waveNumber)
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
			GhostTurret.render(this.upperCtx)
			if (typeof FlashCanvas != "undefined") {
				if(game.ctx.ready)game.ctx._myPostCommands();
				if(game.topCtx.ready)game.topCtx._myPostCommands();
				if(game.tutorialCtx.ready)game.tutorialCtx._myPostCommands();
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
		$('statusBarFill').style.width = Math.max(((this.currentExp-this.minExp)/(this.maxExp-this.minExp))*100-4,0)+"%"
		$('money').innerHTML = this.money;
		$('lives').innerHTML = window.Text.game.upperBar.lives+" "+Math.max(this.maxEscaped - this.escaped,0);
		$('score').innerHTML = window.Text.game.upperBar.score+" "+this.score;
		var self = this
		$('waves').innerHTML = window.Text.game.upperBar.wave+" "+this.wave +'/'+this.wavesCount;
		$('towerInfo').show()
		if(this.selectedTower && this.selectedTower.healthSprite){
			//$('upgradeTower').observe('mouseenter',function(){self.updateMeters(self.selectedTower)}).observe('mouseover',function(){self.updateMeters(self.selectedTower)})
			if(this.selectedTowerHp !=this.selectedTower.hp){
				$$('#towerInfo #sellValue').first().innerHTML = "$"+Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)+""
			}
		}
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price <= this.money){
			tower.statechange = true
			tower.upgradable = true
		}
		if(this.selectedTower && this.selectedTower.statechange){
			this.selectedTower.statechange = false
			this.processTowerInfoTemplate()
		}
		var self = this
		this.push(15, function(){self.renderData()})
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
			if(!this.replay){
				this.replayEvents.push([this.reactor.ticks, "fire", [name]])
			}
			this[name].fire()
		}catch(e){
		}	
	},
	
	doFire : function(name){
	},
	
	startAttack : function(){
		if(!this.replay){
			this.startTick = this.reactor.ticks
			this.replayEvents.push([this.startTick, 'startAttack'])
		}
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
		//startDev.addClassName('resumed')
		$$(".startText").first().innerHTML = window.Text.game.gameState.pause
		startDev.stopObserving('click')
		$$(".start").first().observe('click', function(){self.pause()})
	},
	renderPause: function(){
		Sounds.pauseTrack()
		$$('#gameElements #gameMenu').first().show()
		$('pauseWindow').show()	
		Sounds.play(Sounds.gameSounds.pause)
	},
	renderResume: function(){
		Sounds.togglePauseTrack()
		$$('#gameElements #gameMenu').first().hide()
		$('pauseWindow').hide()
		Sounds.play(Sounds.gameSounds.pause)
	},
	displayStats : function(){
		$$('#score #scoreValue').first().innerHTML = this.score
		$$('#coins #coinsValue').first().innerHTML = Intro.userData.coins - this.coins
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
		this.push(2,function(){self.displayStats()})
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
				var score = this.waveNumber*(25-Math.round((new Date()-this.startTime)/1000)) 
				if(score>0)
				this.score+=score
				this.startTime = new Date()
				this.planeAttack = false
				this.push(40, function(){this.sendWave(this.config.waves.pop())},this)
				var oldMoney = this.money
				this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
				var anim = new MoneyAnimation(341,462,this.money-oldMoney)
				anim.totalMovement = 90
				var msg = "+"+(this.money-oldMoney) +"  Money"
				if(score>0)msg+="<br/>Time bonus: +"+score+"   Score"
				anim.enlarge(msg)
				this.objects.push(anim)
				if(this.waveNumber == 3&&!this.upgraded){
					this.showHintMsg("Be careful, you should upgrade your towers because enemies will grow stronger")
				}
				if(this.waveNumber == 2&&this.turrets.length==0){
					this.showHintMsg("Be careful, you ")
				}
				this.wavePending = true
			}
		}	
		var self = this
		this.push(2,function(){self.checkStatus()})
	},
	showHintMsg : function(msg){
		$('modalWindow').show()
		$$('#modalWindow .content .innerContent')[0].innerHTML = msg
		$$('#modalWindow #ok #rogerText')[0].innerHTML = "Roger"
		this.reactor.pause()
		var self = this
		$$('#modalWindow #ok')[0].observe('click',function(){
			$('modalWindow').hide()
			self.reactor.resume()
		})
	},
	promoteUser : function(win){
		Sounds.play(Sounds.gameSounds.rank_promotion)
		$('pauseWindow').style.zIndex = 302
		$('pauseWindow').show()	
		$('popup').show()
		$$('#popup #congratsContent').first().innerHTML = Text.game.promotion.msg1
		$$('#popup #promotedContent').first().innerHTML = Text.game.promotion.msg2+" "+window.Text.game.ranks[Config.rank].name
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
		self.push(40,function(){
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
						game.scene.push(60,function(){
							Sounds.play(Sounds.gameSounds[state])
							Sounds.stopTrack()
							$('pauseWindow').show()
						})
						game.scene.push(60,function(){self.displayStats()})
						game.scene.push(80,function(){
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
			game.scene.push(60,function(){
			$('pauseWindow').show()
			Sounds.stopTrack()
			Sounds.play(Sounds.gameSounds[state])
			})
			game.scene.push(60,function(){self.displayStats()})
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
			/*
			self.push((delay + (32 / creepCat.prototype.speed))/self.reactor.delay, function(){
				self.wavePending = false;
			})
			*/
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
	issueCreep : function(creep, x , y, delay, last){
		var self = this
		var creepCat = eval(creep.category)
		this.push(delay, function()
		{
			try{
				var obj = new creepCat(x, y,self,creep.values)
				if(creepCat == Plane || creepCat == RedPlane){
					self.addPlane(obj)
					if(!self.planeAttack&&(creepCat == Plane || creepCat == RedPlane)){
						Sounds.play(Sounds.gameSounds.plane)
						self.planeAttack=true
					}
				}
				else{
					self.addCreep(obj)
				}
				self.creepMutators.each(function(mutator){
					mutator.action(obj)
				})
				self.waitingCreeps--
				if(last) self.wavePending = false;
			}catch(e){
				console.log(e)
			}
		})
	},
	uploadScore : function(win,callback){
			if(this.replay) game.exit()
			else{
				// Upload Score code goes here
				  var currRank = Config.rank;
					onSuccess = function() {
						//Here we make the rank 
					  $$('#rank img')[0].src = "images/intro/ranks/" + Config.rank + ".png";
					  $$('.rankName')[0].innerHTML = window.Text.game.ranks[Config.rank].abbr;
					  callback();
				  }
				  Intro.sendScore(this.score, win, onSuccess);
			 }
	},
	
	selectTower : function(x, y){
		if(!this.replay) this.replayEvents.push([this.reactor.ticks, 'selectTower', [x, y]])
		if(this.selectedTower){
			if(this.selectedTower.rangeSprite){
				this.selectedTower.rangeSprite.visible = false
			}
		}
		this.selectedTower = Map.grid[x][y].tower
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price > this.money){
			tower.statechange = true
			tower.upgradable = false
		}
		this.selectedTowerHp = Map.grid[x][y].tower.hp
		this.selectedTower.rangeSprite.visible = true
		this.processTowerInfoTemplate()
	},
	processTowerInfoTemplate : function(){
		$('towerInfo').innerHTML = this.templates['towerInfo'].process({tower: this.selectedTower})
		this.updateMeters()
	},
	sellSelectedTower: function(){
		if(!this.replay){this.replayEvents.push([this.reactor.ticks, "sellSelectedTower"])}
		this.money +=Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)
		Map.grid[this.selectedTower.gridX][this.selectedTower.gridY].tower = null
		this.selectedTower.destroySprites()
		this.selectedTower = null
		Sounds.play(Sounds.gameSounds.click)
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
			     //console.log(img)
				 var data = tmpCanvas.toDataURL("image/png")
				 $$('#snapshotWindow #snapshot')[0].setAttribute('data' , data);
				 $$('#snapshotWindow #snapshot')[0].src = data
				 $('snapshotWindow').show()
				 //$('canvasContainer').appendChild(tmpCanvas)
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
		this.upgraded = true
		if(!this.replay){this.replayEvents.push([this.reactor.ticks, "upgradeSelectedTower"])}
		this.selectedTower.upgrade()
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price > this.money){
			tower.statechange = true
			tower.upgradable = false
		}
		this.processTowerInfoTemplate()
	},
	updateMeters : function(){
		var tower = this.selectedTower
		if(tower && tower.upgrades[tower.rank]){
			if(tower.upgrades[tower.rank].power)
			$('powerMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].power-tower.power)*60/450)+"px solid #FAC200"
			if(tower.upgrades[tower.rank].rate)
			$('rateMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].rate-tower.rate)*60/1)+"px solid #FAC200"
			if(tower.upgrades[tower.rank].range)
			$('rangeMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].range-tower.range)*60/6)+"px solid #FAC200"
			if(tower.upgrades[tower.rank].maxHp){
				$('shieldsMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].maxHp-tower.maxHp)*60/10000)+"px solid #FAC200"
			}
		}
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
		this.creeps.invoke('destroySprites')
		this.creeps = []
		this.turrets.invoke('destroySprites')
		this.turrets = []
		this.animations.invoke('finish')
		this.animations=[]
		this.objects.invoke('finish')
		this.objects=[]
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
