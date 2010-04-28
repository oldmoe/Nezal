var Game = {
	waitingCreeps : 0,
	escaped: 0,
	maxEscaped : 12,
	money : 100,
	turrets : [],
	creeps : [],
	objects : [],
	planes : [],
	templates : {},
	selectedTurret : null,
	add : function(turret){
	},
	start : function(){
		new Ajax.Request('/city-defender/templates/unit_values.tpl', {method:'get', onComplete: function(t){
				Game.templates['unitData'] = TrimPath.parseTemplate(t.responseText) 
				if(!t.responseText){Game.templates['unitData'] = TrimPath.parseTemplate($('tpl').value) }
				window.setTimeout(Game.renderLoop, 20)
			}
		})
	},
	renderLoop : function(){
		Game.render();
		if(Game.escaped >= Game.maxEscaped){
			Game.render();
			alert('game over');
			return;
		}else if(Game.config){
			if(Game.config.waves.length == 0 && Game.creeps.length == 0 && Game.planes.length == 0 && Game.waitingCreeps == 0 ){
				Game.render();
				alert('you win')
				return
			}
		}
		window.setTimeout(Game.renderLoop, 50)
	},
	render : function(){
		$('money').innerHTML = Game.money;
		$('escaped').innerHTML = Game.escaped+' / '+Game.maxEscaped;
		if(Game.selectedTurret){
			$('unitData').innerHTML = Game.templates['unitData'].process({unit: Game.selectedTurret})
		}
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		this.creeps.invoke('render')
		this.turrets.invoke('render')
		this.objects.invoke('render')
		this.planes.invoke('render')
		this.creeps.invoke('move')
		this.objects.invoke('move')
		this.planes.invoke('move')
		GhostTurret.clear()
		if(GhostTurret.select && GhostTurret.isIn){
			GhostTurret.x = Map.transform(GhostTurret.x) + 16;
			GhostTurret.y = Map.transform(GhostTurret.y) + 16;
			GhostTurret.render()
		}
	}
	
}

Game.sendWaves = function(config){
	Game.config = config
	var wave = config.waves.pop()
	if(wave){
		Game.sendWave(wave);
		window.setTimeout(function(){
			Game.sendWaves(config)
		}, config.delay)
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
	wave.creeps.each(function(creep){
		for(var i=0; i < creep.count; i++){
			var index = Math.round(Math.random() * (slots.length - 1))
			var y = slots[index]
			slots.splice(index, 1)
			Game.issueCreep(canvas, creep, y, Math.round(Math.random()*1500))
			Game.waitingCreeps++;
		}
	})
}

Game.issueCreep = function(canvas, creep, y, delay){
	window.setTimeout(function(){
		var store = Game.creeps
		if(creep.klass == Plane) store = Game.planes
		store.push(new creep.klass(canvas, 0, y,  creep.values))
		Game.waitingCreeps--;
	}, delay)

}

var Map = {
	pitch : 32,
	width : 23,
	height: 13,
	grid : [],
	init : function(){
		for(var i = 0; i < this.width; i++){
			this.grid[i] = []
			for(var j = 0; j< this.height; j++){
				this.grid[i][j] = []
				this.grid[i][j].tower = null
			}
		}
	},
	findTile : function(x, y){
		return [Math.floor(x/this.pitch),Math.floor(y/this.pitch)]
	},
	transform : function(x){
		return Math.floor(x/this.pitch)*this.pitch
	},
	empty : function(x, y){
		if(!this.grid[x]) return false;
		if(!this.grid[x][y]) return true;
		return this.grid[x][y].tower == null //&& this.grid[x][y].length == 0
	}
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
			bgctx.fillRect (0, 0, bg.width, bg.height);
			var fg = $('gameForeground');
			var top = $('droppingGround')
			top.getContext('2d').globalAlpha = 0.5
			Game.canvas = fg
			Game.ctx = fg.getContext('2d')
			Game.start();
			GhostTurret = new Turret($('droppingGround'), 0, 0, ghostTurretFeatures)
			//Object.extend(GhostTurret, ghostTurretFeatures)
			new Ajax.Request('/city-defender/templates/towers.tpl', {method:'get', onComplete: function(t){
					Game.templates['towers'] = TrimPath.parseTemplate(t.responseText) 
					if(!t.responseText){Game.templates['towers'] = TrimPath.parseTemplate($('towers_tpl').value) }
					$('towers').innerHTML = Game.templates['towers'].process(Config);
					$$('.tower').each(function(tower){
						tower.observe('click', GhostTurret.select)
					})
				}
			})				
			//$('towers').observe('click', GhostTurret.select)
			$('creeps').observe('click', function(){Game.sendWaves(Config)})
			Map.init();
			//Game.creeps.push(proto(Creep,fg, 12, 0))
		}, 100)
})
