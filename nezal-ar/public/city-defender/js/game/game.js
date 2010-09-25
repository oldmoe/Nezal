var T = {
start : "start",
resume : "resume",
pause : "pause"
}

var Game = Class.create({
	initialize : function(delay){
	},
	
	start : function(){
		Map.init();
		this.prepareConfig()
		this.config = Nezal.clone_obj(Config)
		this.config.waves.reverse()
		this.scene = new CityDefenderScene(this.config,50,this.ctx,this.topCtx);
		var arr = ['Splash','Heal','Hyper','Weak','Nuke']
				arr.each(function(weapon){
					if(Config.superWeapons.indexOf(weapon)==-1){
						game.scene[weapon.toLowerCase()].deactivate()
					}
		})
     $('scores').show()
		GhostTurret = new Turret(0, 0,this.scene, ghostTurretFeatures)
		$$('.startText').first().innerHTML = T.start
//		Intro.userData.newbie = true
//		if(Intro.userData.newbie){
//			$('modalWindow').show()
//			this.tutorial = new Tutorial(this.scene,this.tutorialCtx)
//		}
//		else{
			this.registerHandlers();
//		}
		if(Config.map)Map.bgGrid = Config.map
		if(Config.mapEntry)Map.entry = Config.mapEntry
		this.scene.start();
	},
	prepareConfig : function(){
		var ind = Config.towers.indexOf("Belcher")
		if(ind!=-1)Config.towers[ind] = "Turret"
		var ind = Config.towers.indexOf("Reaper")
		if(ind!=-1)Config.towers[ind] = "DoubleTurret"
		var ind = Config.towers.indexOf("Exploder")
		if(ind!=-1)Config.towers[ind] = "RocketLauncher"
		if(Config.superWeapons.indexOf('Splash')!=-1&&Config.superWeapons[0]!="Splash"){
			var x = Config.superWeapons[0]
			var y = Config.superWeapons.indexOf("Splash")
			Config.superWeapons[0] = "Splash"
			Config.superWeapons[y]=x
		}
	},
	setGameImages : function(){
		Loader.images.background['win.png'].setAttribute("id","winImage")
		$$('#result #winImage')[0].src = Loader.images.background['win.png'].src;
		$$('#result #loseImage')[0].src = Loader.images.background['lose.png'].src;
		$$('#result #youWin')[0].src = Loader.images.background['you_win.png'].src ;
		$$('#result #youLose')[0].src = Loader.images.background['you_lose.png'].src ;
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
				var childDiv = document.createElement("div");
				childDiv.setAttribute('id',weapon);
				div.appendChild(childDiv)	
				var div2 = document.createElement("div");
				div2.setAttribute('class',weapon);
				$$(".superWeaponsOff").first().appendChild(div2)
			
		})		
		$('pauseWindow').style.zIndex = 299;
		$('pauseWindow').style.width =760;
		$('pauseWindow').style.height = 550; 
		$('pauseWindow').style.position = "absolute"
		$('pauseWindow').style.backgroundColor = "black";
		$('pauseWindow').style.opacity =0.5;

		$$('.start').first().appendChild(Loader.images.background['start.png'])

		$('gameElements').appendChild(Loader.images.background['l_shape.png'])
		$('canvasContainer').appendChild(Loader.challenges[Config.campaign]['images/'+Config.missionPath+'/path.png'])
		Config.towers.each(function(turret){ 
			$$('.'+turret).first().appendChild(Loader.images.background[turret.toLowerCase()+'_button.png'])
			
		})
	
		var img8 = Loader.images.background['character.png']
		$('character').appendChild(img8)
		var img9 = document.createElement("IMG");
		$('playAgain').appendChild(Loader.images.background['play_again.png'])
		$('exit').appendChild(Loader.images.background['exit.png'])
		
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

    //Here we make the rank 
    $$('#rank img')[0].src = "images/intro/ranks/" + Config.rank + ".png";
    $$('.rankName')[0].innerHTML = Config.rank;

	},
	
	registerHandlers : function(){
		var self = this	
		$$('.towers div').invoke('observe','click', function(){
			Sounds.play(Sounds.gameSounds.click);GhostTurret.select(this)
		})
		//$('sellTower').observe('click',function(){
		//	self.scene.sellSelectedTower()
		//})		
		$$('#gameElements .start').first().observe('click', function(){self.scene.startAttack()})
		$('playAgain').observe('click', game.reset)
		$('exit').observe('click', game.exit)
			
	},
	reset : function(){
		game.scene.reactor.pause()
		new Effect.Fade('static')
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .start').first().removeClassName('resumed')
		$$('#gameElements .start').first().removeClassName('paused')
		game.unRegisterHandlers()
		$('droppingGround').removeClassName('off')	
		$('result').hide()
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})
		game.start()	
	},
	exit :function(){
          $('scores').hide()
					$('gameStart').hide()
    	    $("gameStart").innerHTML = Intro.templates['game'];
    	    Intro.replay();	
			    onFinish()
	},
	unRegisterHandlers : function(){	
		$$('.towers div').invoke('stopObserving','click')
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})

	},
	
});

var game = new Game()
function city_defender_start(){
		$('popup').hide()	
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		game.setGameImages()
		Upgrades.init(); 
		var fg = $('gameBackground');
		var top = $('gameForeground')
		top.getContext('2d')//.globalAlpha = 0.5
		var tutorialg = $('droppingGround')
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
		Effect.Fade('splashScreen')
		$('gameElements').show();
		$('canvasContainer').show();
		$('static').show();
		$('waitScreen').hide()
		Effect.Fade('static',{duration: 2.0})
	},1000)
}
