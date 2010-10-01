var SuperWeapon = Class.create({
	factor1 : 0,
	factor2 : 0,
	cooldown :15,
	initialize : function(scene, options){
		this.scene = scene
		var options = options || {}
		this.active = true
		this.count = options.count || 0
		this.progressInterval = options.progressInterval || 1
		this.type = options.type
	},
	
	fire : function(){
		if(!this.active) return
		try{
			this.action()
			this.clockEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)
		}catch(e){
		}
	},
	end : function(){
		var canvas = $$('#gameElements .superWeapons .'+this.type+' canvas')
		if (canvas.length>0){
			$$('#gameElements .superWeapons .'+this.type)[0].removeChild(canvas[0])
		}
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
	clockEffect: function(img, delay){
		this.active = false
		var image = img
		var canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		canvas.style.position  = 'absolute'
		canvas.style.left  = '0px'
		var ctx = canvas.getContext('2d')
		var angle = 0
		image.parentNode.appendChild(canvas)
		var self= this
		function tick(){
			ctx.clearRect(0,0,300,300)
			ctx.drawImage(overlay, 0, 0)
			ctx.save()
			ctx.globalCompositeOperation = 'destination-out'
			ctx.fillStyle = "white";
			ctx.translate(image.width/2, image.height/2)
			ctx.rotate(-(Math.PI/180)*90)
			ctx.beginPath();
			ctx.arc(0, 0, (image.width > image.height ? image.width : image.height) + 5 , 0, (Math.PI/180)*angle, false);
			ctx.lineTo(0, 0)
			ctx.closePath ();
			ctx.fill()
			ctx.restore()
			angle = angle + (360 / (delay*1000/50))
			if(angle > 360){
				// we are done
				self.active = true
				image.parentNode.removeChild(canvas)
				return
			}
			self.scene.push(50,tick)
		}
		var overlay = Loader.images.background[this.type+'_button_off.png']
		tick()
		
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
		var self = this
		div.observe('click', function(){self.scene.fire(div.className)})
		div.setOpacity(1)
		}else{
			var self = this
			this.scene.push(this.progressInterval, function(){self.activate()})
		}
	},
	renderDeactivate : function(){
		var div = $$('#gameElements .superWeapons div.'+this.type)[0]
		div.stopObserving('click')
		div.setOpacity(0);
	}
	
})

var Weak = Class.create(SuperWeapon, {
	action : function(){
		Sounds.play(Sounds.superWeapons.weak,true)
		var anim = new WeakAnimation()
		this.scene.scenario.notify({name:"superWeaponsNuke", method: false, unit:this.scene.creeps.random()})
		this.scene.objects.push(anim)
		this.scene.rocketsLayer.attach(anim)
		var self = this
		this.weak(0)
	},
	weak : function(count){
		var self = this
		this.scene.creeps.each(function(creep){creep.takeHit(Math.floor(creep.hp * self.factor1));})
		count++
		var self = this
		if(count < self.factor2){ this.scene.push(1000, function(){self.weak(count);}) }
		else self.unWeak()
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
		this.scene.scenario.notify({name:"superWeaponsSplash", method: false, unit:this.scene.creeps.random()})
		var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
		var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
		Sounds.play(Sounds.turret.rocketLaunch,true)
		Sounds.play(Sounds.turret.rocketLaunch,true)
		var self = this
		this.scene.creeps.sort(function(a,b){
			return b.hp - a.hp
		}).slice(0,self.factor2).each(function(creep){
		self.scene.rockets.push(new PatriotRocket(0, 0, self.scene, {theta: 0, targetUnit : creep, x : x, y : y, power: creep.maxHp*self.factor1, speed: 15}))
		})
	}
})
var Nuke = Class.create(SuperWeapon, {
	action : function(){
		this.scene.scenario.notify({name:"superWeaponsNuke", method: false, unit:this.scene.creeps.random()})
		Sounds.play(Sounds.superWeapons.nuke,true)
		function startNuke(){
			this.scene.creeps.each(function(creep){
				creep.takeHit(Math.round(creep.hp * 1));
			})
			var anim = new NukeBoom(320, 240)
			this.scene.objects.push(anim)
			this.scene.rocketsLayer.attach(anim)
		}
		this.scene.push(1000,startNuke,this)
	}
})
var Heal = Class.create(SuperWeapon, {
	action : function(){
		this.scene.scenario.notify({name:"superWeaponsHeal", method: false, unit:this.scene.turrets.random()})
		Sounds.play(Sounds.superWeapons.heal,true)
		var self = this
		self.scene.turrets.each(function(tower){
			tower.hp = Math.min(tower.maxHp,tower.hp+tower.maxHp*self.factor1)
			var anim = new HealAnimation(tower.x, tower.y - 43)
			self.scene.objects.push(anim)
			self.scene.rocketsLayer.attach(anim)
		})
	}
})
var Hyper = Class.create(SuperWeapon, {
	action : function(){
		var self = this
		this.scene.scenario.notify({name:"superWeaponsHyper", method: false, unit:this.scene.turrets.random()})
		Sounds.play(Sounds.superWeapons.hyper,true)
		var hyper = function(tower){
			tower.rate *= self.factor1;
		}
		this.scene.turrets.each(hyper)
		this.scene.push(self.factor2*1000, function(){self.unHyper();})
		this.scene.towerMutators.push({name : 'hyper', action : hyper})
	},
	unHyper : function(){
		var self = this
		self.scene.turrets.each(function(tower){
			tower.rate /= 2;
		});
		var index = -1
		this.scene.towerMutators.splice(index, 1)
	}
})
