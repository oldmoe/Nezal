var Game = Class.create({
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
	scenes : [],
	fps : 0,
	score: 0,
	selectedTurret : null,
	wave : 0,
	sound : true,
	scene : null,
	wavesCount : 0,
	skipFrames : 0,
	superWeapons : {
		weak : {max : 5, used : 0, factor: 2} ,
		hyper : {max : 5, used : 0, factor: 2} ,
		nuke : {max : 1, used : 0},
		heal : {max : 3, used : 0},
		splash : {max : 3, used : 0},
	},
	weakDisabled : false,
	hyperDisabled : false,
	healDisabled : false,
	nukeDisabled : false,
	splashDisabled : false,
	stats : {
		towersCreated : 0,
		towersDestroyed : 0,
		creepsDestroyed : 0
	},
	creepsCount : 0,
	initialize : function(delay){
		Map.init();
	},
	start : function(){
		this.scene = new CityDefenderScene(50,this.ctx,this.topCtx);
		this.scene.start();
		this.config = Nezal.clone_obj(Config)
		//this.sendWaves(this.config)
		//this.renderLoop()
	},
	renderLoop : function(){
	
		if(game.playing && game.escaped >= game.maxEscaped){
			//this.scene.finish;
			return
		}else if(game.config && game.playing){
			if(game.config.waves.length == 0 && game.scene.creeps.length == 0 && game.waitingCreeps == 0 ){
				//Game.win();
				return
			}else if(game.scene.creeps.length == 0  &&game.waitingCreeps == 0 && game.config.waves.length > 0 && !game.wavePending && game.playing){
				game.scene.push(50, function(){game.sendWave(game.config.waves.pop())})
				game.wavePending = true
			}
		}	
		game.scene.push(50,game.renderLoop)
		
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
		var self = game
		game.scene.push(delay, function()
		{
			try{
				var obj = new creep.category(x, y,  creep.values)
				if(creep.category == Plane || creep.category == RedPlane){
					self.scene.addPlane(obj)
				}
				else{
					self.scene.addCreep(obj)
				}
				self.waitingCreeps--		
			}catch(e){
				console.log(e)
			}
			/*
			this.creepMutators.each(function(mutator){
				mutator.action(obj)
			})
			*/
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
				delay += 70*(32 / creep.values.speed) + 10//Math.ceil( 64 / Creep.speed)
				self.waitingCreeps++;
			}
			self.scene.push(delay + (32 / creep.values.speed), function(){
			self.wavePending = false;
			})
		})
	}
});

var game = new Game()
$(document).observe('dom:loaded',function(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		ImageLoader.init();
		window.setTimeout(function(){
			var bg = $('gameBackground');
			var bgctx = bg.getContext('2d') 
			bgctx.fillStyle = "rgb(100,250,100)";
			var fg = $('gameForeground');
			var top = $('droppingGround')
			top.getContext('2d')//.globalAlpha = 0.5
			game.canvas = fg
			game.ctx = fg.getContext('2d')
			game.topCtx = top.getContext('2d')
			
		GhostTurret = new Turret(0, 0, ghostTurretFeatures)
			game.start();
			$$('#gameElements .upgrades .upgrade.next').invoke('observe', 'click', Upgrades.upgrade)	
			$$('#gameElements .upgrades .upgradeItem').invoke('observe', 'click', Upgrades.select)			
			$$('.towers div').invoke('observe','click', GhostTurret.select)
			//$$('.towers div').invoke('observe','mouseover', GhostTurret.showInfo)
			$$('#gameElements .start').first().observe('click', game.play)
			$$('#gameElements .superWeapons div').each(function(div){ 
				if(div.className != ''){div.observe('click', function(){game.scene.fire(div.className)})}
			})
			Upgrades.selectDefault();
		}, 200)
		
})
