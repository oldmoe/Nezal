var GameStart = {
	waitingCreeps : 0,
	wavePending : false,
	escaped: 0,
	maxEscaped : 20,
	money : 100,
	delay : 50,
	turrets : [],
	creeps : [],
	objects : [],
	animations : [],
	planes : [],
	events : [],
	creepMutators : [],
	towerMutators : [],
	fps : 0,
	score: 0,
	ticks : 0,
	renderTicks : 0,
	selectedTurret : null,
	playing : false,
	paused : false,
	sound : true,
	wave : 0,
	wavesCount : 0,
	skipFrames : 0,
	superWeapons : {
		weak : {max : 5, used : 0, factor: 2} ,
		hyper : {max : 5, used : 0, factor: 2} ,
		nuke : {max : 3, used : 0},
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
	}
}

var Game = {
	templates : {},
	init : function(){
		this.waves = [],
		this.turrets = []
		this.creeps = []
		this.objects = []
		this.animations = []
		this.planes = []
		this.events = []
		this.creepMutators = []
		this.towerMutators = []
	},

	add : function(turret){
	},
	start : function(){
		Game.reset()
		Game.templates['towerInfo'] = TrimPath.parseTemplate($('towerInfoTemplate').value) 
		Game.templates['stats'] = TrimPath.parseTemplate($('statsTemplate').value) 
		this.renderLoop();
		this.renderData();
	},
	
	play : function(){
		Game.sendWaves(Game.config)
		this.addClassName('resumed')
		this.stopObserving('click')
		this.observe('click', Game.pause)
	},
	
	pause : function(){
		Game.paused = true
		Game.playing = false
		this.removeClassName('resumed')
		this.addClassName('paused')
		this.stopObserving('click')
		this.observe('click', Game.resume)		
	},
	
	resume : function(){
		Game.paused = false
		Game.playing = true
		this.removeClassName('paused')
		this.addClassName('resumed')
		this.stopObserving('click')
		this.observe('click', Game.pause)
	},
	
	reset : function(){
		Object.extend(this, clone_obj(GameStart))
		$$('#gameElements .start').first().removeClassName('resumed')
		$$('#gameElements .start').first().removeClassName('paused')
		Game.config = clone_obj(Config)
		Map.init();
		$$('#gameElements .superWeapons div').invoke('setOpacity', 1)
		Upgrades.init();
		Upgrades.render();
		this.render();
		this.renderData();
	},
	
	displayStats : function(){
		if(Game.statText){
			if(Game.statText.length == Game.statTextIndex){
				Game.statText = ''
				return
			}else{
				var data = $('stats').innerHTML
				$('stats').innerHTML = data + Game.statText[Game.statTextIndex]
				Game.statTextIndex++
			}
		}else{
			Game.statText = Game.templates['stats'].process({})
			Game.statTextIndex = 0
			$('stats').innerHTML = ''
		}
		window.setTimeout(Game.displayStats, 50)
	},
	
	win : function(){
		this.render();
		this.renderData();
		Game.playing = false;
		$("result").addClassName('win');
		$('static').show();
		$('droppingGround').addClassName('off')
		new Effect.SwitchOff('static');
		new Effect.Appear("result", {delay : 1.0})
		window.setTimeout(Game.displayStats, 1000)
	},
	
	lose : function(){
		this.render();
		this.renderData();
		Game.playing = false;
		$("result").addClassName('lose');
		$('static').show();
		$('droppingGround').addClassName('off')
		new Effect.SwitchOff('static');
		new Effect.Appear("result", {delay : 1.0})
		window.setTimeout(Game.displayStats, 1000)
	},
	
	renderLoop : function(){
		Game.tick();
		if(Game.playing && Game.escaped >= Game.maxEscaped){
			Game.lose();
			return
		}else if(Game.config && Game.playing){
			if(Game.config.waves.length == 0 && Game.creeps.length == 0 && Game.planes.length == 0 && Game.waitingCreeps == 0 ){
				Game.win();
				return
			}else if(Game.creeps.length == 0 && Game.planes.length == 0 && Game.waitingCreeps == 0 && Game.config.waves.length > 0 && !Game.wavePending && Game.playing){
				Game.push(50, function(){Game.sendWave(Game.config.waves.pop())})
				Game.wavePending = true
			}
		}	
		window.setTimeout(Game.renderLoop, Game.delay)
	},

	eventIndex : function(ticks, insert){
		var h = this.events.length, l = -1, m;
		while(h - l > 1)
			if(this.events[m = (h + l) >> 1][0] > ticks) l = m;
			else h = m;
		return this.events[h] && this.events[h][0] != ticks ? insert ? h : -1 : h;
	},
	
	push : function(ticks, func){
		var delay = this.ticks + ticks
		this.events.splice(this.eventIndex(delay, true), 0, [delay, func])
	},
	
	tick : function(){
		if(this.paused) return
		if(this.events.length == 0) this.ticks = 0
		this.ticks++;
		this.renderTicks++;
		var event = this.events[this.events.length - 1]
		while(event && event[0] <= this.ticks){
			this.events.pop()[1]()
			event = this.events[this.events.length - 1]
		}
		this.creeps.invoke('move')
		this.objects.invoke('move')
		this.planes.invoke('move')	
		this.animations.invoke('tick')
		if(GhostTurret && GhostTurret.selected && GhostTurret.isIn){
			GhostTurret.x = Map.transform(GhostTurret.x) + 16;
			GhostTurret.y = Map.transform(GhostTurret.y) + 16;
		}
		if(this.skipFrames == 0){
			this.render();
		}else{
			this.skipFrames--;
		}		
		if(this.renderTicks == 10){
			this.renderTicks = 0
			this.renderData()
		}
	},
	
	renderData : function(){
		$('money').innerHTML = Game.money;
		$('lives').innerHTML = Game.maxEscaped - Game.escaped;
		$('score').innerHTML = Game.score;
		//$$('#gameElements .fps').first().innerHTML = "FPS: "+this.fps;
		$('splash').innerHTML = Game.superWeapons.splash.max - Game.superWeapons.splash.used
		$('heal').innerHTML = Game.superWeapons.heal.max - Game.superWeapons.heal.used
		$('nuke').innerHTML = Game.superWeapons.nuke.max - Game.superWeapons.nuke.used
		$('weak').innerHTML = Game.superWeapons.weak.max - Game.superWeapons.weak.used
		$('hyper').innerHTML = Game.superWeapons.hyper.max - Game.superWeapons.hyper.used
		$('waves').innerHTML = Game.wave +'/'+Game.wavesCount;
		if(Game.selectedTurret){
			$('towerInfo').innerHTML = Game.templates['towerInfo'].process({unit: Game.selectedTurret})
		}
		Upgrades.render();
	},
	
	render : function(){
		var startTime = new Date;
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.creeps.invoke('render')
		this.turrets.invoke('render')
		this.objects.invoke('render')
		this.planes.invoke('render')
		this.animations.invoke('render')
		if(GhostTurret && GhostTurret.selected && GhostTurret.isIn){
			GhostTurret.clear()
			GhostTurret.render()
		}
		var delay = new Date - startTime
		this.fps = Math.round(1000/(delay))
		if(delay > this.delay){
			this.skipFrames = Math.ceil(delay / this.delay)
			if(this.skipFrames > 3) this.skipFrames = 3
		}
	}
	
}

Game.sendWaves = function(config){
	if(Game.playing) return;
	Game.playing = true;
	Game.wavesCount = Game.config.waves.length
	Game.wavesCount = Game.config.waves.length
	Game.wave = 0
	var wave = Game.config.waves.pop()
	if(wave){
		Game.sendWave(wave);
		Game.wavePending = true
	}else{
		// game finished
	}
}

Game.sendWave = function(wave){
	Game.wave++
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
	wave.creeps.each(function(creep){
		for(var i=0; i < creep.count; i++){
			var entry = Map.entry[Math.round(Math.random()*(Map.entry.length - 1))]
			if(creep.category == Plane || creep.category == RedPlane){
				creep.theta = theta;
				Game.issueCreep(canvas, creep, 
						(theta == 90 || theta == 270) ? Math.round(Math.random()* (Map.width - 1)) : x,
						(theta == 0 || theta == 180) ? (Math.round(Math.random()* (Map.height - 2)) + 1) : y, 
						delay)
			}else{
				Game.issueCreep(canvas, creep,  entry[0], entry[1], delay)
			}
			delay += (32 / creep.values.speed) + 10//Math.ceil( 64 / Creep.speed)
			Game.waitingCreeps++;
		}
		Game.push(delay + (32 / creep.values.speed), function(){
			Game.wavePending = false;
		})
	})
}

Game.issueCreep = function(canvas, creep, x , y, delay){
	Game.push(delay, function(){
		var store = Game.creeps
		if(creep.category == Plane || creep.category == RedPlane) store = Game.planes
		var obj = new creep.category(canvas, x, y,  creep.values)
		Game.creepMutators.each(function(mutator){
			mutator.action(obj)
		})
		store.push(obj)
		Game.waitingCreeps--;
	})

}

Game.allCreeps = function(){
	var creeps = Game.creeps.collect(function(creep){return creep})
	return creeps.concat(Game.planes.collect(function(creep){return creep}))
}

Game.initTimeout = function(div, variable, time){
	div.setOpacity(0);
	Game.push(time/14, function(){
		Game.timeout(div, variable, time/14)
	})
}

Game.timeout = function(div, variable, time){
	div.setOpacity(div.getOpacity() + 0.05)
	if(div.getOpacity() == 0.7){
		Game[variable] = false
		div.setOpacity(1)
	}else{
		Game.push(time, function(){Game.timeout(div,variable, time)})
	}
}


Game.toggleSound = function(){
	Game.sound = !Game.sound
	if(this.hasClassName('on')){
		this.removeClassName('on')
		this.addClassName('off')
	}else{
		this.removeClassName('off')
		this.addClassName('on')
	}
}

var GhostTurret = null
// Application entry point

/*
Game.assignMedia = function(){
	if(Game.loadedImages != Game.totalImages){
		Turret.prototype.images = {}
		DoubleTurret.prototype.images = {}
		RocketLauncher.prototype.images = {}
		Rocket.prototype.images = {}
		Patriot.prototype.images = {}
		Tank.prototype.images = {}
		TankI.prototype.images = {}		
		TankII.prototype.images = {}		
		BlackTank.prototype.images = {}		
		Humvee.prototype.images = {}
	}else{
		window.setTimeout(Game.assignMedia)
	}
}*/

$(document).observe('dom:loaded',function(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		window.setTimeout(function(){
			var bg = $('gameBackground');
			var bgctx = bg.getContext('2d') 
			bgctx.fillStyle = "rgb(100,250,100)";
			var fg = $('gameForeground');
			var top = $('droppingGround')
			top.getContext('2d').globalAlpha = 0.5
			Game.canvas = fg
			Game.ctx = fg.getContext('2d')
			GhostTurret = new Turret(top, 0, 0, ghostTurretFeatures)
			Game.start();
			//Object.extend(GhostTurret, ghostTurretFeatures)
			new Ajax.Request('/city-defender/templates/towers.tpl', {method:'get', onComplete: function(t){
					Game.templates['towers'] = TrimPath.parseTemplate(t.responseText) 
					if(!t.responseText){Game.templates['towers'] = TrimPath.parseTemplate($('towers_tpl').value) }
					$('towers').innerHTML = Game.templates['towers'].process(Game.config);
					$$('.tower').each(function(tower){
						tower.observe('click', GhostTurret.select)
					})
				}
			})
			$$('#gameElements .upgrades .upgrade.next').invoke('observe', 'click', Upgrades.upgrade)	
			$$('#gameElements .upgrades .upgradeItem').invoke('observe', 'click', Upgrades.select)			
			$$('#gameElements .controls .sound')[0].observe('click', Game.toggleSound)
			$$('.towers div').invoke('observe','click', GhostTurret.select)
			//$$('.towers div').invoke('observe','mouseover', GhostTurret.showInfo)
			$$('#gameElements .start').first().observe('click', Game.play)
			$$('#gameElements .superWeapons div').each(function(div){ 
				if(div.className != ''){div.observe('click', function(){Game.fireSuperWeapon(div.className)})}
			})
			$('playAgain').observe('click', function(){
				$('static').show();
				$('droppingGround').removeClassName('off');
				new Effect.Fade('static')
				$$('#gameElements .start').first().stopObserving('click')
				$$('#gameElements .start').first().observe('click', Game.play)
				Game.start();
				$('result').hide();
			})
			Map.init(bgctx);
			Upgrades.selectDefault();
		}, 200)
})
