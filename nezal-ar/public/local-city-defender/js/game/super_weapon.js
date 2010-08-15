var SuperWeapon = Class.create({
	initialize : function(scene, options){
		this.scene = scene
		var options = options || {}
		this.active = true
		this.count = options.count || 1
		this.coolDown = options.coolDown || 15 
		this.progressInterval = options.progressInterval || 1
		this.type = options.type
	},
	
	fire : function(){
		if(!this.active) return
		this.deactivate()
		this.count = this.count - 1
		this.action()
		this.render()
		this.progress = 0
		var self = this
		this.scene.reactor.push(this.progressInterval, function(){self.progressTick()})
	},
	
	render : function(){
	},
	
	action : function(){
	},
	
	activate : function(){
		this.active = true
		this.renderActivate()
	},
	
	progressTick : function(){
		this.progress++
		this.notify(this.progress)
		if(this.progress == this.coolDown){
			if(this.count > 0) this.activate()
		}else{
			var self = this
			this.scene.reactor.push(this.progressInterval, function(){self.progressTick()})
		}		
	},
	
	notify : function(progress){
			
	},
	
	deactivate : function(){
		this.active = false
		this.renderDeactivate()
	},
	
	renderActivate : function(){
		var div = $$('#gameElements .superWeapons div.'+this.type)[0]
		div.setOpacity(div.getOpacity() + 0.05)
		if(div.getOpacity() == 0.7){
		div.setOpacity(1)
		}else{
			var self = this
			this.scene.push(this.progressInterval, function(){self.activate()})
		}
	},
	renderDeactivate : function(){
		var div = $$('#gameElements .superWeapons div.'+this.type)[0]
		div.setOpacity(0);
	},
	
})

var Weak = Class.create(SuperWeapon, {
	action : function(){
		var anim = new WeakAnimation()
		this.scene.objects.push(anim)
		this.scene.rocketsLayer.attach(anim)
		var self = this
		this.scene.push(5000, function(){self.unWeak()})
		this.weak(0)
	},
	weak : function(count){
		var self = this
		this.scene.creeps.each(function(creep){creep.takeHit(creep.maxHp * 0.1);})
		count++
		var self = this
		if(count < 10){ this.scene.push(500, function(){self.weak(count);}) }
	},
	unWeak : function(){
		var index = -1
		this.scene.objects.each(function(obj, i){
			if(index == -1 && obj.constructor == WeakAnimation){
				index = i
			}
		})
		var anim = this.scene.objects.splice(index, 1)[0]
		anim.layer = null
	}
	
})
var Splash = Class.create(SuperWeapon, {
	action : function(){
		var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
		var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
		Sounds.play(Sounds.turret.rocketLaunch)
		Sounds.play(Sounds.turret.rocketLaunch)
		var self = this
		this.scene.creeps.sort(function(a,b){
			return b.hp - a.hp
		}).slice(0,10).each(function(creep){
			self.scene.objects.push(new PatriotRocket(0, 0,  {theta: 0, targetUnit : creep, x : x, y : y, power: 2000, speed: 15}))
		})
	}
})
var Nuke = Class.create(SuperWeapon, {
	action : function(){
		this.scene.creeps.each(function(creep){
			creep.takeHit(Math.round(creep.hp * 1));
		})
		var anim = new NukeBoom(320, 240)
		this.scene.objects.push(anim)
		this.scene.rocketsLayer.attach(anim)
	}
})
var Heal = Class.create(SuperWeapon, {
	action : function(){
		var self = this
		this.scene.turrets.each(function(tower){
			tower.hp = tower.maxHp
			var anim = new HealAnimation(tower.x, tower.y - 43)
			self.scene.objects.push(anim)
			self.scene.rocketsLayer.attach(anim)
		})
	}
})
var Hyper = Class.create(SuperWeapon, {
	action : function(){
		var hyper = function(tower){
			tower.rate *= game.scene.superWeapons.hyper.factor;
		}
		this.scene.turrets.each(hyper)
		var self = this
		this.scene.push(30000, function(){self.unHyper();})
	},
	unHyper : function(){
		this.scene.turrets.each(function(tower){
			tower.rate /= game.scene.superWeapons.hyper.factor;
		});
		var index = -1
	}
})