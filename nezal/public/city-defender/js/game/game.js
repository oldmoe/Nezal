var Game = {
	waitingCreeps : 0,
	escaped: 0,
	maxEscaped : 50,
	money : 100,
	delay : 33,
	turrets : [],
	creeps : [],
	objects : [],
	animations : [],
	planes : [],
	templates : {},
	slowed : false,
	slowFactor : 2,
	fps : 0,
	score: 0,
	selectedTurret : null,
	add : function(turret){
	},
	start : function(){
		new Ajax.Request('templates/unit_values.tpl', {method:'get', onComplete: function(t){
				Game.templates['unitData'] = TrimPath.parseTemplate(t.responseText) 
				if(!t.responseText){Game.templates['unitData'] = TrimPath.parseTemplate($('tpl').value) }
				window.setTimeout(Game.renderLoop, Game.delay)
			}
		})
	},
	renderLoop : function(){
		Game.render();
		if(Game.escaped >= Game.maxEscaped){
			Game.render();
			$("result").innerHTML = '<br/>Game Over!'
			new Effect.Appear("result", {delay : 1.0})
			return
		}else if(Game.config){
			if(Game.config.waves.length == 0 && Game.creeps.length == 0 && Game.planes.length == 0 && Game.waitingCreeps == 0 ){
				Game.render();
				$("result").innerHTML = '<br/>You Win!'
				new Effect.Appear("result", {delay : 1.0})
				return
			}
		}	
		window.setTimeout(Game.renderLoop, Game.delay)
	},
	render : function(){
		var startTime = new Date;
		//$('money').innerHTML = Game.money;
		$('lives').innerHTML = Game.maxEscaped - Game.escaped;
		$('score').innerHTML = Game.score;
		//if(Game.selectedTurret){
			//$('unitData').innerHTML = Game.templates['unitData'].process({unit: Game.selectedTurret})
		//}
		$$('#gameElements .fps').first().innerHTML = "FPS: "+this.fps;
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.creeps.invoke('render')
		this.turrets.invoke('render')
		this.objects.invoke('render')
		this.planes.invoke('render')
		this.animations.invoke('render')
		this.creeps.invoke('move')
		this.objects.invoke('move')
		this.planes.invoke('move')
		GhostTurret.clear()
		if(GhostTurret.selected && GhostTurret.isIn){
			GhostTurret.x = Map.transform(GhostTurret.x) + 16;
			GhostTurret.y = Map.transform(GhostTurret.y) + 16;
			GhostTurret.render()
		}
		this.fps = Math.round(1000/(new Date - startTime))
	}
	
}

Game.sendWaves = function(config){
	Game.config = config
	var wave = config.waves.pop()
	if(wave){
		Game.sendWave(wave);
		//window.setTimeout(function(){
			//Game.sendWaves(config)
		//}, config.delay)
	}else{
		// game finished
	}
}

Game.sendWave = function(wave){
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
		//delay = 0;
		for(var i=0; i < creep.count; i++){
			var entry = Map.entry[Math.round(Math.random()*(Map.entry.length - 1))]
			if(creep.klass == Plane){
				creep.theta = theta;
				Game.issueCreep(canvas, creep, 
						(theta == 90 || theta == 270) ? Math.round(Math.random()* (Map.width - 1)) : x,
						(theta == 0 || theta == 180) ? (Math.round(Math.random()* (Map.height - 2)) + 1) : y, 
						delay)
			}else{
				Game.issueCreep(canvas, creep,  entry[0], entry[1], delay)
			}
			delay += 500 + (Math.random() * 40)//(Map.pitch * 4 * Game.delay)
			Game.waitingCreeps++;
		}
		window.setTimeout(function(){
			Game.sendWaves(Config)
		}, Config.delay + delay)
		
	})
}

Game.issueCreep = function(canvas, creep, x , y, delay){
	window.setTimeout(function(){
		var store = Game.creeps
		if(creep.klass == Plane) store = Game.planes
		var obj = new creep.klass(canvas, x, y,  creep.values)
		if(Game.slowed){
			obj.speed = obj.speed / Game.slowFactor;
		}
		store.push(obj)
		Game.waitingCreeps--;
	}, delay)

}

Game.allCreeps = function(){
	var creeps = Game.creeps.collect(function(creep){return creep})
	return creeps.concat(Game.planes.collect(function(creep){return creep}))
}

Game.slow = function(){
	Game.slowed = true;
	wave.creeps.each(function(creep){
		creep.speed = creep.speed / Game.slowFactor;
	})	
}

Game.nuke = function(){
	if(Game.nukeDisabled) return
	Game.nukeDisabled = true
	Game.allCreeps().each(function(creep){
		creep.takeHit(Math.round(creep.hp * 1));
		Game.animations.push(new NukeBoom($('gameForeground').getContext('2d'), 320, 240))
	})
	var nukeDiv = $$('#gameElements .superWeapons div.nuke')[0]
	Game.initTimeout(nukeDiv, "nukeDisabled", 1000)
}

Game.initTimeout = function(div, variable, time){
	div.setOpacity(0);
	window.setTimeout(function(){
		Game.timeout(div, variable, time/14)
	}, time/14)
}

Game.timeout = function(div, variable, time){
	div.setOpacity(div.getOpacity() + 0.05)
	if(div.getOpacity() == 0.7){
		Game[variable] = false
		div.setOpacity(1)
	}else{
		window.setTimeout(function(){Game.timeout(div,variable, time)}, time)
	}
}


Game.splash = function(){
	if(Game.splashDisabled) return
	Game.splashDisabled = true	
	var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
	var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
	Game.allCreeps().each(function(creep){
		Game.objects.push(new PatriotRocket(creep.canvas, 0, 0,  {theta: 0, targetUnit : creep, x : x, y : y, power: 900, speed: 15}))
		//creep.takeHit(100);
	})
	var div = $$('#gameElements .superWeapons div.splash')[0]
	Game.initTimeout(div, "splashDisabled", 1000)
}

Game.heal = function(){
	if(Game.healDisabled) return
	Game.healDisabled = true	
	Game.turrets.each(function(tower){
		tower.hp += Math.round(tower.maxHp / 2)
		if(tower.hp > tower.maxHp){
			tower.hp = tower.maxHp
		}
		Game.animations.push(new HealAnimation(tower.ctx, tower.x, tower.y - 43))
	})
	var div = $$('#gameElements .superWeapons div.heal')[0]
	Game.initTimeout(div, "healDisabled", 1000)
}

Game.hyper = function(){
	if(Game.hyperDisabled) return
	Game.hyperDisabled = true	
	Game.turrets.each(function(tower){
		tower.rate *= 8;
	});
	window.setTimeout(Game.unhyper, 10000)
	var div = $$('#gameElements .superWeapons div.hyper')[0]
	Game.initTimeout(div, "hyperDisabled", 1000)
}
Game.unhyper = function(){
	Game.turrets.each(function(tower){
		tower.rate /= 8;
	});
}

var GhostTurret = null
// Application entry point
$(document).observe('dom:loaded',function(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		window.setTimeout(function(){
			var bg = $('gameBackground');
			var bgctx = bg.getContext('2d') 
			bgctx.fillStyle = "rgb(100,250,100)";
			//bgctx.fillRect (0, 0, bg.width, bg.height);
			var fg = $('gameForeground');
			var top = $('droppingGround')
			top.getContext('2d').globalAlpha = 0.5
			Game.canvas = fg
			Game.ctx = fg.getContext('2d')
			Game.start();
			GhostTurret = new Turret($('droppingGround'), 0, 0, ghostTurretFeatures)
			//Object.extend(GhostTurret, ghostTurretFeatures)
			new Ajax.Request('templates/towers.tpl', {method:'get', onComplete: function(t){
					Game.templates['towers'] = TrimPath.parseTemplate(t.responseText) 
					if(!t.responseText){Game.templates['towers'] = TrimPath.parseTemplate($('towers_tpl').value) }
					$('towers').innerHTML = Game.templates['towers'].process(Config);
					$$('.tower').each(function(tower){
						tower.observe('click', GhostTurret.select)
					})
				}
			})				
			$$('.towers div').invoke('observe','click', GhostTurret.select)
			$$('#gameElements .start').first().observe('click', function(){Game.sendWaves(Config)})
			Map.init(bgctx);
			//Game.creeps.push(proto(Creep,fg, 12, 0))
		}, 200)
})