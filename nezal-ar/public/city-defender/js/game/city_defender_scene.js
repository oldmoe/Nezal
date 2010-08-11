var CityDefenderScene = Class.create(Scene, {
	creeps : [],
	turrets : [],
	objects : [],
	initialize : function($super,delay,baseCtx,upperCtx){
		$super(delay);
		this.baseCtx = baseCtx;
		this.upperCtx = upperCtx;
		this.nuke = new Nuke(this, {count: 2, type:'nuke'})
		this.heal = new Heal(this, {count: 2, type:'heal'})
		this.weak = new Weak(this, {count: 2, type:'weak'})
		this.splash = new Splash(this, {count: 2, type:'splash'})
		this.hyper = new Hyper(this, {count: 2, type:'hyper'})
		this.renderData()
	},
	init : function(){
		this.skipFrames = 0
		this.creepsLayer = new Layer(this.upperCtx);
		this.creepsLayer.clear = true
		this.layers.push(this.creepsLayer);
		this.basesLayer = new Layer(this.baseCtx)
		this.basesLayer.clear = true
		this.towerCannonLayer = new Layer(this.upperCtx)
		this.rocketsLayer = new Layer(this.upperCtx)
		this.towerHealthLayer = new Layer(this.upperCtx)
		this.rankLayer = new Layer(this.upperCtx)
		this.layers.push(this.basesLayer)
		this.layers.push(this.rocketsLayer)
		this.layers.push(this.towerCannonLayer)
		this.layers.push(this.towerHealthLayer)
		this.layers.push(this.rankLayer)
//		this.addTurret()
//		this.addPlane()
		return this
	},
	addTurret : function(turret){
		if(!turret)var turret = new Turret(10, 4)	
		this.turrets.push(turret)
		Map.grid[turret.gridX][turret.gridY].tower = turret
		this.basesLayer.attach(turret.baseSprite)
		this.towerCannonLayer.attach(turret.cannonSprite)
		this.towerHealthLayer.attach(turret.healthSprite)
		if(turret.rocketSprite)this.towerHealthLayer.attach(turret.rocketSprite)
		this.rankLayer.attach(turret.rankSprite)
		return this
	},
	addCreep : function(creep){
		if(creep){
			this.creepsLayer.attach(creep.sprite);
			this.creeps.push(creep)	
		}
		return this
	},
	addPlane : function(plane){
		if(plane){
			this.rocketsLayer.attach(plane.shadowSprite);
			this.rocketsLayer.attach(plane.cannonSprite);
			this.rocketsLayer.attach(plane.healthSprite);
		//	this.indeces[plane] = true
			this.creeps.push(plane)
		}
		return this
	},
	render : function($super){
		if(this.skipFrames == 0){
			var startTime = new Date
			$super()
			if(GhostTurret && GhostTurret.selected && GhostTurret.isIn){
				GhostTurret.render(game.scene.upperCtx)
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
		$('money').innerHTML = game.money;
		$('lives').innerHTML = game.maxEscaped - game.escaped;
		$('score').innerHTML = game.score;
		//$$('#gameElements .fps').first().innerHTML = "FPS: "+this.fps;
		$('splash').innerHTML = this.splash.count
		$('heal').innerHTML = this.heal.count
		$('nuke').innerHTML = this.nuke.count
		$('weak').innerHTML = this.weak.count
		$('hyper').innerHTML = this.hyper.count
		$('waves').innerHTML = game.wave +'/'+game.wavesCount;
		if(game.selectedTurret){
			$('towerInfo').innerHTML = game.templates['towerInfo'].process({unit: game.selectedTurret})
		}
		Upgrades.render();
		var self = this
		this.push(500,function(){self.renderData()})
		
		
	},
	tick : function(){
		this.objects = this.invokeTick(this.objects);
		this.turrets = this.invokeTick(this.turrets);
		this.creeps = this.invokeTick(this.creeps);
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
			this[name].fire()
		}catch(e){
		}	
	}

})