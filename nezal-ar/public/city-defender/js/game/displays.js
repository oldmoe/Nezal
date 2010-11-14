var Display = Class.create({
	initialize : function(owner){
		this.owner = owner;
	},
	update : function(){},
  finish : function(){}
})

var CanvasDisplay = Class.create(Display, {
	initialize : function(owner){
		this.owner = owner;
		this.initImages();
	},	
	initImages : function(){}
})

var UnitDisplay = Class.create(CanvasDisplay, {
	createBaloon : function(num){
		if(!this.baloon){
			this.baloon = new Baloon(num,this.owner)
			this.owner.scene.creepsLayer.attach(this.baloon)
		}
	},

	destroyBaloon : function(){
		this.baloon.destroy()
		this.baloon = null
	}
})

var CreepDisplay = Class.create(UnitDisplay, {
	initialize : function(owner){
		this.owner = owner;
		this.initImages();
		this.sprite = new CompositeUnitSprite(this.images, this.owner)
	},
	update : function(){
		if(this.owner.killed){
          var anim = new CreepBoom(this.owner.x, this.owner.y)
          this.owner.scene.rankLayer.attach(anim)
          this.owner.scene.objects.push(anim)
          Sounds.play(Sounds.boom.unit)
     }
	},
  finish : function(){
      var anim = new CreepBoom(this.x, this.y)
			this.owner.scene.rankLayer.attach(anim)
			this.owner.scene.objects.push(anim)    
      Sounds.play(Sounds.boom.unit)
  },
})

var HumveeDisplay = Class.create(CreepDisplay, {
 	initImages : function(){
		this.images = {
			base : Loader.images.game['humvee_body.png'],
			cannon : Loader.images.game['humvee_tower.png'],
			fire : Loader.images.game['humvee_tower_in_action.png']
		}
	}
})

var TankDisplay = Class.create(CreepDisplay,{
  initImages : function(){
		this.images = {
			base : Loader.images.game['tank_body.png'],
			cannon : Loader.images.game['tank_tower.png'],
			fire : Loader.images.game['tank_tower_in_action.png']
		}
	}
})

var TankIDisplay = Class.create(CreepDisplay, {
  initImages : function(){
	this.images = {
		base : Loader.images.game['tank_1_body.png'],
		cannon : Loader.images.game['tank_1_tower.png'],
		fire : Loader.images.game['tank_1_tower_in_action.png']
	}
  }
})

var TankIIDisplay = Class.create(CreepDisplay, {
  initImages : function(){
	this.images = {
		base : Loader.images.game['tank_2_body.png'],
		cannon : Loader.images.game['tank_2_tower.png'],
		fire : Loader.images.game['tank_2_tower_in_action.png']
	}
  }
})

var BlackTankDisplay = Class.create(CreepDisplay,{
  	initImages : function(){
		this.images = {
			base : Loader.images.game['black_tank_body.png'],
			cannon : Loader.images.game['black_tank_tower.png'],
			fire : Loader.images.game['black_tank_tower_in_action.png']
		}
	}
})

var RedTankDisplay = Class.create(CreepDisplay,{
  initImages : function(){
		this.images = {
			base : Loader.images.game['red_tank_body.png'],
			cannon : Loader.images.game['red_tank_tower.png'],
			fire : Loader.images.game['red_tank_tower_in_action.png']
		}
	}
})
var PlaneDisplay = Class.create(UnitDisplay,{
  initialize : function($super,owner){
    $super(owner)
		this.cannonSprite = new Sprite([this.images.base,this.images.fire],owner)
		this.shadowSprite = new Sprite([this.images.shadow],owner)
		this.healthSprite = new HealthSprite(owner)
    this.cannonSprite.shiftX=30
		this.shadowSprite.shiftX=30
		
  },
  initImages : function(){
		this.images = {
		base : Loader.images.game['air_craft.png'],
		fire : Loader.images.game['air_craft_in_action.png'],
		shadow : Loader.images.game['air_craft_shade.png']
		}
	},
  update : function(){
    if(this.owner.fired){
			this.cannonSprite.currentFrame = 1
	}else{
		this.cannonSprite.currentFrame = 0
	}
	if(this.owner.killed){
          var anim = new CreepBoom(this.owner.x, this.owner.y)
          this.owner.scene.rankLayer.attach(anim)
          this.owner.scene.objects.push(anim)
          Sounds.play(Sounds.boom.unit)
     }
  },
  finish : function(){
      var anim = new CreepBoom(this.x, this.y)
	  this.owner.scene.rankLayer.attach(anim)
	  this.owner.scene.objects.push(anim)    
	  Sounds.play(Sounds.boom.unit)
  }
})

var RedPlaneDisplay = Class.create(PlaneDisplay,{
  initImages : function(){
		this.images = {
			base : Loader.images.game['red_air_craft.png'],
			fire : Loader.images.game['red_air_craft_in_action.png'],
			shadow : Loader.images.game['air_craft_shade.png']
		}
	}
})
var TurretDisplay = Class.create(UnitDisplay,{
  fireSound : Sounds.turret.fire,
	initialize : function(owner){
		this.owner = owner;
		this.initImages(1);
		this.rangeSprite = new RangeSprite(owner.range,owner)
		this.baseSprite = new Sprite(this.images.base,owner)
		if(this.images.cannon)this.cannonSprite = new Sprite(this.images.cannon.concat(this.images.fire),owner)
		this.rankSprite = new Sprite(this.images.ranks,owner)
    this.rankSprite.shiftX=50;
     this.rankSprite.shiftY=-5;
		this.healthSprite = new HealthSprite(owner)
	},
	initImages : function(rank){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']]
		this.images.cannon = [Loader.images.game['belcher_'+rank+'.png']]
		this.images.fire = [Loader.images.game['belcher_'+rank+'_inaction.png']]
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
	update : function(){
		if(this.owner.killed){
      var anim = new CreepBoom(this.owner.x, this.owner.y)
      this.owner.scene.rankLayer.attach(anim)
      this.owner.scene.objects.push(anim)
      Sounds.play(Sounds.boom.unit)
     }
		this.cannonSprite.rotation = Nezal.degToRad(this.owner.cannonTheta)
		if(this.owner.fired){
      Sounds.play(this.fireSound)
			this.cannonSprite.currentFrame = 1
		}
		else{
			this.cannonSprite.currentFrame = 0
		}
		this.rankSprite.currentFrame = this.owner.rank %4;
	},
	upgrade : function(){
		if(this.owner.rank==4)this.initImages(2)
		else if(this.owner.rank==8)this.initImages(3)
		this.baseSprite.images = this.images.base
		if(this.images.cannon)this.cannonSprite.images = this.images.cannon.concat(this.images.fire)
	}
})
var DoubleTurretDisplay = Class.create(TurretDisplay,{
  fireSound : Sounds.turret.fire,
	initImages : function($super,rank){
		$super(rank)
		this.images.cannon = [Loader.images.game['reaper_'+rank+'.png']]
		this.images.fire = [Loader.images.game['reaper_'+rank+'_inaction_right.png'],Loader.images.game['reaper_'+rank+'_inaction_left.png']]	
	},
	update : function(){
		this.cannonSprite.rotation = Nezal.degToRad(this.owner.cannonTheta)
		if(this.owner.fired){
      Sounds.play(this.fireSound)		
			this.cannonSprite.currentFrame = this.owner.firing_turn+1
		}
		else{
			this.cannonSprite.currentFrame = 0
		}
		this.rankSprite.currentFrame = this.owner.rank %4;
	},
})
var RocketLauncherDisplay = Class.create(TurretDisplay,{
	initialize : function(owner){
		this.owner = owner;
		this.initImages(1);
		this.cannonSprite = new Sprite(this.images.pad,owner)
		this.rangeSprite = new RangeSprite(owner.range,owner)
		this.baseSprite = new Sprite(this.images.base,owner)
		this.rocketSprite = new Sprite(this.images.rocket,owner)
		if(this.images.cannon)this.cannonSprite = new Sprite(this.images.cannon.concat(this.images.fire),owner)
		this.rankSprite = new Sprite(this.images.ranks,owner)
    this.rankSprite.shiftX=50;
     this.rankSprite.shiftY=-5;
		this.healthSprite = new HealthSprite(owner)
	},
	initImages : function(rank){
		this.images ={}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']],
		this.images.pad = [Loader.images.game['exploder.png']],
		this.images.rocket = [Loader.images.game['exploder_rocket.png']],
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
  update : function(){
		if(this.fired){
      Sounds.play(Sounds.turret.patriotLaunch)
    }
		if(this.owner.reloaded){
			this.rocketSprite.draw = true		
		}
		else this.rocketSprite.draw = false		
  }
})
var PatriotDisplay = Class.create(TurretDisplay,{
	initImages: function(rank){
		this.images = {}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']],
		this.images.cannon = [Loader.images.game['patriot.png']],
		this.images.fire = [Loader.images.game['patriot_inaction_right.png'], Loader.images.game['patriot_inaction_left.png']],
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
  update : function(){
    if(this.owner.fired){
      this.cannonSprite.currentFrame = this.owner.firing_turn+1
      Sounds.play(Sounds.turret.patriotLaunch)
    }else{
			this.cannonSprite.currentFrame = 0		
		}
	
  }
})
var RocketDisplay = Class.create(CanvasDisplay,{
  initialize : function($super,owner){
      $super(owner)
  		this.rocketSprite = new Sprite([this.rocketImage],owner)
      this.rocketSprite.rotation = Nezal.degToRad(this.owner.theta)
  },
  initImages : function(){
    this.rocketImage = Loader.images.game['exploder_rocket_inaction.png']
  },
  update : function(){
    this.rocketSprite.rotation = Nezal.degToRad(this.owner.theta)
    this.rocketSprite.transitionX = -(this.owner.step*this.owner.speed)	
  }
})
var PatriotRocketDisplay = Class.create(RocketDisplay,{
  initImages : function(){
     this.rocketImage = Loader.images.game['patriot_rocket.png']
  }
})


