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
      if(window.document){
			  if (typeof FlashCanvas != "undefined") {
				  this.normalEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)
			  }else{
				  this.clockEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)
			  }
      }
		}catch(e){
		}
	},
	end : function(){
    if(window.document){
		  var canvas = $$('#gameElements .superWeapons .'+this.type+' canvas')
		  if (canvas.length>0){
			  $$('#gameElements .superWeapons .'+this.type)[0].removeChild(canvas[0])
		  }
		  if (typeof FlashCanvas != "undefined") {
			  $$('#gameElements .superWeapons .'+this.type+' img').first().setOpacity(1)
		  }
    }
	},
	render : function(){
	},
	
	action : function(){
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
	
	normalEffect : function(img, delay){
		this.active = false
		var image = img
		var opacity = 0
		image.setOpacity(opacity)
		var self = this
		function tick(){
			opacity += (0.7 / (delay*1000/self.scene.reactor.delay))
			image.setOpacity(opacity)
			if(opacity >= 0.7){
				image.setOpacity(1)	
				self.active = true
				return				
			}
			self.scene.push(1,tick)
		}
		tick()
	},
	
	clockEffect: function(img, delay){
		this.active = false
		var image = img
		var canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.id = "can1"
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
			ctx.strokeStyle = "black"
			ctx.translate(image.width/2, image.height/2)
			ctx.rotate(-(Math.PI/180)*90)
			ctx.beginPath();
			ctx.arc(0, 0, (image.width > image.height ? image.width : image.height) + 5 , 0, (Math.PI/180)*angle, false);
			ctx.lineTo(0, 0)
			ctx.closePath();
			ctx.fill()
			ctx.stroke();
			ctx.restore()
			angle = angle + (360 / (delay*1000/self.scene.reactor.delay))
			if(angle > 360){
				// we are done
				self.active = true
				image.parentNode.removeChild(canvas)
				return
			}
			self.scene.push(1,tick)
		}
		var overlay = Loader.images.background[this.type+'_button_off.png']
		tick()
		
	},
	
})

var Weak = Class.create(SuperWeapon, {
	action : function(){
    if(window.document){
	  	Sounds.play(Sounds.superWeapons.weak,true)
		  var anim = new WeakAnimation()
		  var randomUnit = this.scene.creeps[Math.round(this.scene.randomizer.next()*(this.scene.creeps.length-1))]
		  this.scene.scenario.notify({name:"superWeaponsWeak", method: false, unit:randomUnit})
		  this.scene.objects.push(anim)
		  this.scene.rocketsLayer.attach(anim)
    }
		var self = this
		this.weak(0)
	},
	weak : function(count){
		var self = this
		this.scene.creeps.each(function(creep){creep.takeHit(Math.floor(creep.hp * self.factor1));})
		count++
		var self = this
		if(count < self.factor2){ this.scene.push(20, function(){self.weak(count);}) }
		else if(window.document)self.unWeak()
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
		self.scene.addPatriotRocket(new PatriotRocket(0, 0, self.scene, {theta: 0, targetUnit : creep, x : x, y : y, power: creep.maxHp*self.factor1, speed: 15}))
		})
	}
})
var Nuke = Class.create(SuperWeapon, {
	action : function(){
		this.scene.scenario.notify({name:"superWeaponsNuke", method: false, unit:this.scene.creeps.random()})
		Sounds.play(Sounds.superWeapons.nuke,true)
		function startNuke(){
			this.scene.creeps.each(function(creep){
				creep.takeHit(Math.round(creep.maxHp * 1));
			})
      if(window.document){
			  var anim = new NukeBoom(320, 240)
			  this.scene.objects.push(anim)
			  this.scene.rocketsLayer.attach(anim)
      }
		}
		this.scene.push(25,startNuke,this)
	}
})
var Heal = Class.create(SuperWeapon, {
	action : function(){
		this.scene.scenario.notify({name:"superWeaponsHeal", method: false, unit:this.scene.turrets.random()})
		
		var self = this
		self.scene.turrets.each(function(tower){
			tower.hp = Math.min(tower.maxHp,tower.hp+tower.maxHp*self.factor1)
      if(window.document){
        Sounds.play(Sounds.superWeapons.heal,true)
			  var anim = new HealAnimation(tower.x, tower.y - 43)
			  self.scene.objects.push(anim)
			  self.scene.rocketsLayer.attach(anim)
      }
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
			tower.originalX = tower.x
			tower.originalY = tower.y
		}
		this.scene.turrets.each(hyper)
		this.hyperEffect(0,0)
		this.scene.towerMutators.push({name : 'hyper', action : hyper})
	},
	hyperEffect : function(ticks,flip){
		if(ticks > this.factor2*1000/this.scene.reactor.delay){
			this.unHyper()
			return;
		}
		this.scene.turrets.each(function(turret){
			if(flip%2==0){
				var directionX = 1
				var directionY = 1
				var randx = Math.random()
				var randy = Math.random()
				if(randx > 0.5) directionX = -1
				if(randy > 0.5) directionY = -1
				turret.x+= directionX*1
				turret.y+= directionY*1
			}else{
				turret.x = turret.originalX
				turret.y = turret.originalY
			}
		})
		var self = this
		this.scene.push(2, function(){self.hyperEffect(ticks+2,flip+1);})
	},
	unHyper : function(){
		var self = this
		self.scene.turrets.each(function(tower){
			tower.rate /= self.factor1;
			tower.x = tower.originalX
			tower.y = tower.originalY
		});
		var index = -1
		this.scene.towerMutators.splice(index, 1)
	}
})
