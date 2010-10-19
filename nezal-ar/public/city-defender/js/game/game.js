var T = {
start : "start",
resume : "resume",
pause : "pause"
}

var Game = Class.create({
	started : false,
	initialize : function(delay){
	},
	
	start : function(replay){
		if(!game.started){
			game.started = true
			Map.init();
			if(Intro.userData.newbie)Config = tutorialConfig
			else Config = GameConfigs
			this.prepareConfig()
			this.config = Nezal.clone_obj(Config)
			this.config.waves.reverse()
			$$('#game #scores').first().show()
			if(Intro.userData.newbie){
				$('modalWindow').show()
				this.scene = new TutorialScene(this.config,40,this.ctx,this.topCtx);
				this.tutorial = new Tutorial(this.scene,this.tutorialCtx)
				$('gameExit').hide()
				$('gameReset').hide()
				$$('#modalWindow #ok #rogerText').first().innerHTML = Text.game.controls.roger
				$$('.sound').first().observe('click',Sounds.mute)
				$$('.bookmark').first().observe('click', FBDefender.bookmark)	
				$$('.snapshot').first().hide()
			}
			else{
				this.scene = new CityDefenderScene(this.config,33,this.ctx,this.topCtx, replay);
				if(!replay)this.registerHandlers();
			}
			if(Config.map)Map.bgGrid = Config.map
			if(Config.mapEntry)Map.entry = Config.mapEntry
			GhostTurret = new Turret(0, 0,this.scene, ghostTurretFeatures)
			$$('.startText').first().innerHTML = window.Text.game.gameState.start
			$('pauseWindow').hide()	
			$$('#gameReset #resetText').first().innerHTML = window.Text.game.controls.reset
			$$('#gameExit #exitText').first().innerHTML = window.Text.game.controls.exit
			$$('#gameResume #resumeText').first().innerHTML = window.Text.game.gameState.resume
			var arr = ['Splash','Heal','Hyper','Weak','Nuke']
					arr.each(function(weapon){
						if(Config.superWeapons.indexOf(weapon)==-1){
							game.scene[weapon.toLowerCase()].deactivate()
						}
						else{
							game.scene[weapon.toLowerCase()].end()
						}
			})
			this.scene.start();
		}	
	},
	flip : function(map){
		var mapFlipped = [];
        for(var i=0; i< map[0].length; i++)
        {
            mapFlipped[i] = [];
        }
        for( var i=0; i< map.length; i++)
        {
            for(var j = 0 ; j < map[i].length; j++)
            {
                mapFlipped[j][i] = map[i][j];
            }
        }
		return mapFlipped
	},
	prepareConfig : function(){
		var inputNames = ["Belcher","Reaper","Exploder","Patriot"]
		var replacement = ["Turret","DoubleTurret","RocketLauncher","Patriot"]
		var upgradeValues = ["maxHp","power","range","rate","price"]
		for(var i=0;i<inputNames.length;i++){
			var ind = Config.towers.indexOf(inputNames[i])
			if(ind!=-1){
				Config.towers[ind] = replacement[i]
				var values = Intro.gameData.towers[inputNames[i]].upgrades
				var upgrades = []
				upgradeValues.each(function(upgradeValue){
						eval(replacement[i]).prototype[upgradeValue] = values[0][upgradeValue]
				})
				eval(replacement[i]).prototype.maxRank = Config.towerUpgrades[inputNames[i]]-1
				for(var j=1;j<values.length;j++){
					var value = values[j]
					var upgrade = {}
					upgradeValues.each(function(upgradeValue){
						upgrade[upgradeValue] = value[upgradeValue]
					})
					upgrades.push(upgrade)
				}
				eval(replacement[i]).prototype.upgrades = upgrades
			}
		}
		var weaponValues = Intro.gameData.weapons
		Config.superWeapons.each(function(weapon){
			eval(weapon).prototype.factor1 = weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor1
			eval(weapon).prototype.factor2 = weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor2
			eval(weapon).prototype.cooldown = weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].cooldown
		})
		if(Config.superWeapons.indexOf('Splash')!=-1&&Config.superWeapons[0]!="Splash"){
			var x = Config.superWeapons[0]
			var y = Config.superWeapons.indexOf("Splash")
			Config.superWeapons[0] = "Splash"
			Config.superWeapons[y]=x
		}
		
	},
	setGameImages : function(){
		if(Intro.userData.newbie)Config = tutorialConfig
		else Config = GameConfigs
		game.prepareConfig()
		Config.towers.each(function(tower){
			var div = document.createElement("div");
			div.style.cursor = "pointer"
			div.setAttribute('class',tower);
			$$(".towers").first().appendChild(div)
		})

		for(var i = 0;i<10-Config.towers.length;i++){
			var div = document.createElement("div");
			$$(".towers").first().appendChild(div)
		}		
		
		var arr = ['Splash','Heal','Hyper','Weak','Nuke']
		arr.each(function(weapon){
				var wCapital = weapon
				weapon = weapon.toLowerCase()
				var div = document.createElement("div");
				div.style.cursor = "pointer"
				div.setAttribute('class',weapon);
				$$(".superWeapons").first().appendChild(div)
				var div2 = document.createElement("div");
				div2.setAttribute('class',weapon);
				$$(".superWeaponsOff").first().appendChild(div2)
			
		})		
		$$('.start').first().appendChild(Loader.images.background['start.png'])
		$('gameElements').appendChild(Loader.images.background['l_shape.png'])
		if(Intro.userData.newbie)$('canvasContainer').appendChild(Loader.images.background['path.png'])
		else $('canvasContainer').appendChild(Loader.challenges[Config.campaign]['images/'+Config.missionPath+'/path.png'])
		Config.towers.each(function(turret){ 
			$$('.'+turret).first().appendChild(Loader.images.background[turret.toLowerCase()+'_button.png'])
			
		})
		
		var template = TrimPath.parseTemplate($('resultTemplate').value) 
		$('result').innerHTML = template.process()
		var img8 = Loader.images.intro['character.png']
		$$('#modalWindow #character').first().appendChild(img8)
		var img9 = document.createElement("IMG");
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){
			div.appendChild(Loader.images.background[div.className+'_button.png'])
			}
		})
		
		$$('#gameElements .superWeaponsOff div').each(function(div){ 
			if(div.className != ''){
			div.appendChild(Loader.images.background[div.className+'_button_off.png'])
			}
		})
		var image1 = new Image()
		var image2 = new Image()
		var image3 = new Image()
		image1.src = Loader.images.background['exit_restart_button.png'].getAttribute('data')
		image2.src = Loader.images.background['exit_restart_button.png'].getAttribute('data')
		image3.src = Loader.images.background['exit_restart_button.png'].getAttribute('data')
		$('gameReset').appendChild(image1)
		$('gameExit').appendChild(image2)
		$('gameResume').appendChild(image3)
		//Here we make the rank 
		$$('#rank img')[0].src = "images/intro/ranks/" + Config.rank + ".png";
		$$('.rankName')[0].innerHTML = window.Text.game.ranks[Config.rank].abbr;
		$$('#snapshotWindow #background')[0].src=Loader.images.background['pop_up.png'].getAttribute('data')
		$('popup').appendChild(Loader.images.background['pop_up.png'])
		$$('#popup #popupOk').first().appendChild(Loader.images.intro['mission/accept.png'])
		if(Intro.userData.bookmarked)$$('.bookmark').first().hide()	
		if(Intro.userData.like)$$('.like').first().hide()
		if(Sounds.muted)Sounds.mute()
	},
	
	registerHandlers : function(){
		var self = this	
		$$('.towers div').each(function(div){ 
			if(div.className != ''){
				div.observe('click', function(){
					Sounds.play(Sounds.gameSounds.click);
					GhostTurret.select(div)
				})
			}
		})
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){
				div.observe('click', function(){self.scene.fire(div.className)})
				self.scene[div.className].active = false
			}
		})
				
		$$('#gameElements .start').first().observe('click', function(){self.scene.startAttack()})
		$('playAgain').observe('click',function(){
			Sounds.stopTrack()
			game.reset()})
		$('exit').observe('click', game.exit)
		$('gameExit').observe('click', function(){
			game.exit()})
		$('gameReset').observe('click',function(){game.reset()})	
		$('gameResume').observe('click', function(){game.scene.resume()})	
		$$('.sound').first().observe('click',Sounds.mute)
		$$('.bookmark').first().observe('click', FBDefender.bookmark)
		$$('.snapshot').first().observe('click',function(){game.scene.takeSnapShot()})
		$$('.snapshot').first().hide()
		$$('#snapshotWindow #save').first().observe('click',function(){game.scene.saveSnapshot()})
		$$('#snapshotWindow #share').first().observe('click',function(){game.scene.shareSnapshot()})
		$$('#snapshotWindow #close').first().observe('click',function(){game.scene.closeSnapshot()})
	},
	reset : function(replay){
		game.started = false
		game.scene.reactor.stop()
		game.scene.resetScene()
		$$('#gameElements #gameMenu').first().hide()
		$('pauseWindow').hide()
		new Effect.Fade('static')
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .start').first().removeClassName('resumed')
		$$('#gameElements .start').first().removeClassName('paused')
		$('stats').innerHTML = ''
		game.unRegisterHandlers()
		Sounds.togglePauseTrack()
		$('droppingGround').removeClassName('off')	
		$('result').hide()
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})
		game.start(replay)
	},
	
	
	exit :function(){
		game.started = false
		$$('#gameElements #gameMenu').first().hide()
		Sounds.stopTrack()
		Intro.enablePauseScreen();
		$("gameStart").innerHTML = Intro.templates['game'];
		game.scene.reactor.stop()
		$('gameStart').hide()
		Intro.replay();	
		//onFinish()
	},
	unRegisterHandlers : function(){	
		$$('.towers div').invoke('stopObserving','click')
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})
		$('playAgain').stopObserving('click')
		$('exit').stopObserving('click')
		$('gameExit').stopObserving('click')	
		$('gameReset').stopObserving('click')	
		$('gameResume').stopObserving('click')	
		$$('.bookmark').first().stopObserving('click')	
		$$('.sound').first().stopObserving('click')
	}
});

var game = new Game()
function city_defender_start(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		game.setGameImages()
		Upgrades.init(); 
		var fg = $('gameBackground');
		var top = $('gameForeground')
		var tutorialg = $('droppingGround')
		if (typeof FlashCanvas != "undefined") {
				FlashCanvas.initElement(fg)
				FlashCanvas.initElement(top)
				FlashCanvas.initElement(tutorialg)
		}
		var totorialTop = tutorialg.getContext('2d')
		game.tutorialCtx = totorialTop
		game.canvas = fg
		game.ctx = fg.getContext('2d')
		game.topCtx = top.getContext('2d')
		game.start();
		Upgrades.selectDefault();
		
}
function onFinish(){
	$('gameElements').style.visibility = 'visible'
	$('canvasContainer').style.visibility = 'visible'
	window.setTimeout(function(){
		$('gameElements').show();
		$('canvasContainer').show();
		Sounds.resumeTrack()
		$('static').show();
		Effect.Fade('static',{duration: 1.0})
	},100)
}
