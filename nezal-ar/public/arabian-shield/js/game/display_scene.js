var DisplayScene = Class.create(CityDefenderScene, {
	initialize : function($super,config,delay,baseCtx,upperCtx,replay){
		$super(config,delay,replay)
		this.templates = {}
		this.baseCtx = baseCtx;
		this.upperCtx = upperCtx;
		this.upgraded = false
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		this.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
		IncomingWaves.init($("container"),$("wavesTemplate"),"incomingWaves",this.reactor)
		this.resultTemplate = TrimPath.parseTemplate($('resultTemplate').value) 
		this.displays = []
	},
	init : function($super){
		$super()
		this.skipFrames = 0
		this.creepsLayer = new Layer(this.upperCtx);
		this.creepsLayer.clear = true
		this.layers.push(this.creepsLayer);
		this.basesLayer = new Layer(this.upperCtx)
		this.rangesLayer = new Layer(this.upperCtx)
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
		$('InGamecityName').innerHTML = TunisiaCities[game.scene.config.mission.path]
		return this
	},
	addTurret : function($super,klass, x, y){
		var owner = $super(klass, x, y)
    Sounds.play(Sounds.gameSounds.correct_tower)
		var displayklass = eval(klass+"Display")
		var towerDisplay = new displayklass(owner)
		owner.display = towerDisplay
		this.displays.push(towerDisplay)
		this.rangesLayer.attach(towerDisplay.rangeSprite)
		this.basesLayer.attach(towerDisplay.baseSprite)
		this.towerCannonLayer.attach(towerDisplay.cannonSprite)
		this.towerHealthLayer.attach(towerDisplay.healthSprite)
		if(towerDisplay.rocketSprite){this.towerHealthLayer.attach(towerDisplay.rocketSprite)}
		this.rankLayer.attach(towerDisplay.rankSprite)
		return this
	},
  addRocket : function($super,rocket){
    $super(rocket)
    var rocketDisplay = new RocketDisplay(rocket)
    rocket.display = rocketDisplay
    this.displays.push(rocketDisplay)
    this.towerHealthLayer.attach(rocketDisplay.rocketSprite)
    return this
  },
  addPatriotRocket : function($super,rocket){
    $super(rocket)
    var rocketDisplay = new PatriotRocketDisplay(rocket)
    rocket.display = rocketDisplay
    this.displays.push(rocketDisplay)
    this.towerHealthLayer.attach(rocketDisplay.rocketSprite)
    return this
  },
	addCreep : function($super,creep){
		$super(creep)
		var displayKlass = eval(creep.name+"Display")
		var creepDisplay = new displayKlass(creep)
		creep.display = creepDisplay
		this.displays.push(creepDisplay)
    this.scenario.notify({name:"creepEntered", method: false, unit:creep})
		if(this.turrets[0])this.scenario.notify({name:"creepEnteredTower", method: false, unit:this.turrets[0]})
		this.creepsLayer.attach(creepDisplay.sprite)
	},
	addPlane : function($super,plane){
		$super(plane)
		if(!this.planeAttack){
  	  		Sounds.play(Sounds.gameSounds.plane)
    			this.planeAttack=true
		}
    var planeDisplay =  null
    if(plane.constructor == Plane) planeDisplay = new PlaneDisplay(plane)
    else if(plane.constructor == RedPlane) planeDisplay = new RedPlaneDisplay(plane)
		this.rocketsLayer.attach(planeDisplay.shadowSprite);
		this.rocketsLayer.attach(planeDisplay.cannonSprite);
		this.rocketsLayer.attach(planeDisplay.healthSprite);
    this.displays.push(planeDisplay)
		this.creeps.push(plane)
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
		this.displays.invoke('update')
		this.removeFinishedDisplays()
	},

	removeFinishedDisplays : function(){
		var remainedDisplays = []
		this.displays.each(function(display){
			if(!display.owner.dead) remainedDisplays.push(display)
		})
		this.displays = remainedDisplays
	},

	renderData : function(){
		$('money').innerHTML = this.money;
		$('lives').innerHTML = window.Text.game.upperBar.lives+" "+Math.max(this.maxEscaped - this.escaped,0);
		$('score').innerHTML = window.Text.game.upperBar.score+" "+this.score;
		var self = this
		$('waves').innerHTML = window.Text.game.upperBar.wave+" "+this.wave +'/'+this.wavesCount;
		$('towerInfo').show()
		if(this.selectedTower && this.selectedTower.display){
			if(this.selectedTowerHp !=this.selectedTower.hp){
				$$('#towerInfo #sellValue').first().innerHTML = "$"+Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)+""
			}
		}
		if(this.selectedTower && this.selectedTower.display&& this.selectedTower.dead){
			this.selectedTower = null
			$('towerInfo').innerHTML = ""
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
	startAttack : function($super){
		$super()
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
//		if(this.statText){
//			if(this.statText.length == this.statTextIndex){
//				this.statText = ''
//				this.reactor.pause()
//				this.statTextIndex = 0
//				return
//			}else{
//				var data = $('stats').innerHTML
//				$('stats').innerHTML = data + this.statText[this.statTextIndex]
//				this.statTextIndex++
//			}
//		}else{
//			this.statTextIndex = 0
//			$('stats').innerHTML = ''
//		}
//		var self = this
//		this.push(2,function(){self.displayStats()})
	},
	promoteUser : function(win){
//		Sounds.play(Sounds.gameSounds.rank_promotion)
//		$('pauseWindow').style.zIndex = 302
//		$('pauseWindow').show()	
//		$('popup').show()
//		$$('#popup #congratsContent').first().innerHTML = Text.game.promotion.msg1
//		$$('#popup #promotedContent').first().innerHTML = Text.game.promotion.msg2+" "+window.Text.game.ranks[Config.rank].name
//		game.scene.rank = Config.rank
//		$$('#popup #rankImg').first().appendChild(img)
//		if(win){
//			$('popupClose').observe('click',win)
//			$('popupOk').observe('click',win)
//			FBDefender.publishRankPromotion({name : Config.rank, image : "fb-" + Config.rank + '.png'});
//		}
//		else{
//			
//		}
	},
	end : function($super,state){
		if(game.scene.config.mission.order==24)$('nextCity').hide()
		$('result').innerHTML = this.resultTemplate.process()
		game.registerResultHandlers()
		var self = game.scene
		self.push(40,function(){
			game.scene.running = false
			$("result").addClassName(state);
			if(state == "win"){
					function win(){	
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
//							game.scene.push(80,function(){
//							  FBDefender.publishMissionCompletion({name : GameConfigs.missionPath,
//														 score : self.score});
//											   });
						}
						win()
			}
			else{
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
	updateMeters : function(){
		var tower = this.selectedTower
		if(tower && tower.upgrades[tower.rank]){
			if(tower.upgrades[tower.rank].power)
			$('powerMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].power-tower.power)*60/450)+"px solid #B30000"
			if(tower.upgrades[tower.rank].rate)
			$('rateMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].rate-tower.rate)*60/1)+"px solid #B30000"
			if(tower.upgrades[tower.rank].range)
			$('rangeMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].range-tower.range)*60/6)+"px solid #B30000"
			if(tower.upgrades[tower.rank].maxHp){
				$('shieldsMeter').style.borderRight = Math.ceil((tower.upgrades[tower.rank].maxHp-tower.maxHp)*60/10000)+"px solid #B30000"
			}
		}
	},
	uploadScore : function(win,callback){
			if(this.replay) game.exit()
			else{
				// Upload Score code goes here
				  var currRank = Config.rank;
					onSuccess = function() {
						//Here we make the rank 
					  callback();
				  }
					var stars = 0;
					if(win){
						if(this.escaped == 0)stars = 3;
						else if(this.escaped < 10)stars = 2;
						else stars = 1;	
					}
					this.stars = stars
				  Intro.sendScore(this.score, win, stars, onSuccess);
			 }
	},
	selectTower : function(x, y){
		if(!this.replay) this.replayEvents.push([this.reactor.ticks, 'selectTower', [x, y]])
		if(this.selectedTower){
			if(this.selectedTower.display&&this.selectedTower.display.rangeSprite){
				this.selectedTower.display.rangeSprite.visible = false
			}
		}
		this.selectedTower = Map.grid[x][y].tower
		var tower = this.selectedTower
		if(tower && !tower.statechange && tower.upgrades[tower.rank] && tower.upgrades[tower.rank].price > this.money){
			tower.statechange = true
			tower.upgradable = false
		}
		this.selectedTowerHp = Map.grid[x][y].tower.hp
		this.selectedTower.display.rangeSprite.visible = true
		this.processTowerInfoTemplate()
	},
	advanceWave : function($super){
		var oldMoney=this.money
		var oldScore=this.score
		$super()
		var score = this.score-oldScore
		var anim = new MoneyAnimation(341,462,this.money-oldMoney)
		anim.totalMovement = 90
		var msg = "+"+(this.money-oldMoney) +"  مال"
		if(score>0)msg+="<br/>+"+score+"   نقاط"
		//if(this.waveNumber == 3&&!this.upgraded){
			//this.showHintMsg("Be careful, you should upgrade your towers because enemies will grow stronger")
		//}
		anim.enlarge(msg)
		this.objects.push(anim)
		IncomingWaves.nextWave()
	 },
	 showHintMsg : function(msg){
		$('modalWindow').show()
		$$('#modalWindow .content .innerContent')[0].innerHTML = msg
		$$('#modalWindow #ok')[0].show()
		$$('#modalWindow #ok #rogerText')[0].innerHTML = "Roger"
		this.reactor.pause()
		var self = this
		$$('#modalWindow #ok')[0].observe('click',function(){
			$('modalWindow').hide()
			self.reactor.resume()
		})
	},

	upgradeSelectedTower : function($super){
		if(!this.upgraded) _gaq.push(['_trackEvent', 'GamePlay', 'upgraded', navigator.userAgent]);
		this.upgraded = true
		if(this.selectedTower.upgradable)Sounds.play(Sounds.gameSounds.click)
		$super()
		this.selectedTower.display.upgrade()
		this.processTowerInfoTemplate()
	},
	processTowerInfoTemplate : function(){
		$('towerInfo').innerHTML = this.templates['towerInfo'].process({tower: this.selectedTower})
		game.registerTowerStatus("upgradeTower");
		game.registerTowerStatus("sellTower");
		this.updateMeters()
	},
  sellSelectedTower : function($super){
    $super()
		Sounds.play(Sounds.gameSounds.click)
  },
  resetScene : function($super){
	$super()
	this.render()
  }
})
