var T = {
start : "start",
resume : "resume",
pause : "pause"
}

var Game = Class.create({
	creepsCount : 0,
	initialize : function(delay){
	},
	start : function(){
		$('popup').hide()
		Map.init();
		this.config = Nezal.clone_obj(Config)
		this.scene = new CityDefenderScene(this.config,50,this.ctx,this.topCtx);
		GhostTurret = new Turret(0, 0,this.scene, ghostTurretFeatures)
		$$('.startText').first().innerHTML = T.start
		Intro.userData.newbie = false
		if(Intro.userData.newbie){
			$('modalWindow').show()
			this.tutorial = new Tutorial(this.scene,this.tutorialCtx)
		}
		else{
			this.registerHandlers();
		}
		if(Config.map)Map.bgGrid = Config.map
		if(Config.mapEntry)Map.entry = Config.mapEntry
		Upgrades.init(); 
		this.scene.start();
	},
	setGameImages : function(){
		Loader.images.background['win.png'].setAttribute("id","winImage")
		$('result').appendChild(Loader.images.background['win.png']);
				Loader.images.background['lose.png'].setAttribute("id","loseImage")
		$('result').appendChild(Loader.images.background['lose.png']);
		Config.towers.each(function(tower){
			var div = document.createElement("div");
			div.setAttribute('class',tower);
			$$(".towers").first().appendChild(div)
		})
		Config.superWeapons.each(function(weapon){
			weapon = weapon.toLowerCase();
			var div = document.createElement("div");
			div.setAttribute('class',weapon);
			$$(".superWeapons").first().appendChild(div)
			var childDiv = document.createElement("div");
			childDiv.setAttribute('id',weapon);
			div.appendChild(childDiv)
			var div2 = document.createElement("div");
			div2.setAttribute('class',weapon);
			$$(".superWeaponsOff").first().appendChild(div2)
		})
		Config.upgrades.each(function(upgrade){
			var div = document.createElement("div");
			div.addClassName('upgradeItem')
			div.addClassName(upgrade)
			div.setAttribute('id',upgrade);
			$$(".upgradeItems").first().appendChild(div)
		})

		$$('.start').first().appendChild(Loader.images.background['start.png'])

		$('gameElements').appendChild(Loader.images.background['l_shape.png'])
		$('canvasContainer').appendChild(Loader.images.background['path.png'])
		Config.towers.each(function(turret){ 
			$$('.'+turret).first().appendChild(Loader.images.background[turret+'_button.png'])
		})
	
		var img8 = document.createElement("IMG");
		img8.src='images/tutorial/character.png'
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
	
		
	},
	
	registerHandlers : function(){
		var self = this
		$$('#gameElements .upgrades .upgrade.next').invoke('observe', 'click', Upgrades.upgrade)	
		$$('#gameElements .upgrades .upgradeItem').invoke('observe', 'click', Upgrades.select)			
		$$('.towers div').invoke('observe','click', function(){GhostTurret.select(this)})
		$$('#gameElements .startText').first().observe('click', function(){self.scene.startAttack()})
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.observe('click', function(){self.scene.fire(div.className)})}
		})
		$('playAgain').observe('click', game.reset)
		$('exit').observe('click', game.exit)
			
	},
	reset : function(){
		game.scene.reactor.pause()
		 //$("gameStart").innerHTML = Intro.templates['game'][1].source;
		new Effect.Fade('static')
		$$('#gameElements .startText').first().stopObserving('click')
		$$('#gameElements .start').first().removeClassName('resumed')
		$$('#gameElements .start').first().removeClassName('paused')
		$('droppingGround').removeClassName('off')	
		$('result').hide()
		game.start()	
	},
	exit :function(){
	    game.reset()
	    //REDIRECTING TO EXIT GOES HERE
	},
	unRegisterHandlers : function(){
		$$('#gameElements .upgrades .upgrade.next').invoke('stopObserving', 'click')	
		$$('#gameElements .upgrades .upgradeItem').invoke('stopObserving', 'click')			
		$$('.towers div').invoke('stopObserving','click')
		$$('#gameElements .start').first().stopObserving('click')
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){div.stopObserving('click')}
		})

	},
	
});

var game = new Game()
function city_defender_start(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		window.setTimeout(function(){
			var fg = $('gameBackground');
			var top = $('gameForeground')
			top.getContext('2d')//.globalAlpha = 0.5
			var tutorialg = $('droppingGround')
			var totorialTop = tutorialg.getContext('2d')
			game.tutorialCtx = totorialTop
			game.canvas = fg
			game.ctx = fg.getContext('2d')
			game.topCtx = top.getContext('2d')
			game.setGameImages()
			game.start();
		
		//	game.registerHandlers();
			Upgrades.selectDefault();
		}, 200)
}
function movement(e){
console.log(e.pageX,e.pageY)
}
