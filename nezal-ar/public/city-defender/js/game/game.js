var T = {
start : "start",
resume : "resume",
pause : "pause"
}

var Game = Class.create({
	creepsCount : 0,
	initialize : function(delay){
		Map.init();
	},
	start : function(){
		$('popup').hide()
		this.config = Nezal.clone_obj(Config)
		this.scene = new CityDefenderScene(this.config,50,this.ctx,this.topCtx);
		GhostTurret = new Turret(0, 0,this.scene, ghostTurretFeatures)
		$$('.startText').first().innerHTML = T.start
		this.setGameImages()
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
		Config.towers.each(function(tower){
			var div = document.createElement("div");
			div.setAttribute('class',tower);
			$$(".towers").first().appendChild(div)
		})
		Config.superWeapons.each(function(weapon){
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
		var img = document.createElement("IMG");
		img.src = "images/background/start.png";
		$$('.start').first().appendChild(img)
		var img2 = document.createElement("IMG");
		img2.src = "images/background/l_shape.png"
		$('gameElements').appendChild(img2)
		var img3 = document.createElement("IMG");
		img3.src='images/background/path.png'
		$('canvasContainer').appendChild(img3)
		Config.towers.each(function(turret){ 
			var img4 = document.createElement("IMG");
			img4.src='images/background/'+turret+'_button.png'
			$$('.'+turret).first().appendChild(img4)
		})
	
		var img8 = document.createElement("IMG");
		img8.src='images/tutorial/character.png'
		$('character').appendChild(img8)
		var img9 = document.createElement("IMG");
		img9.src='images/background/play_again.png'
		$('playAgain').appendChild(img9)
		var img10 = document.createElement("IMG");
		img10.src='images/background/exit.png'
		$('exit').appendChild(img10)
		
		$$('#gameElements .superWeapons div').each(function(div){ 
			if(div.className != ''){
			var img = document.createElement("IMG");
			img.src = 'images/background/'+div.className+'_button.png'
			div.appendChild(img)
			}
		})
		
		$$('#gameElements .superWeaponsOff div').each(function(div){ 
			if(div.className != ''){
			var img = document.createElement("IMG");
			img.src = 'images/background/'+div.className+'_button_off.png'
			div.appendChild(img)
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
			game.start();
		//	game.registerHandlers();
			Upgrades.selectDefault();
		}, 200)
}
function movement(e){
console.log(e.pageX,e.pageY)
}
