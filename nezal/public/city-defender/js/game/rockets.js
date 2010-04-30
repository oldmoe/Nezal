var RocketLauncher = Class.create(Turret, {
	name : 'R1G',
	targets : 'Ground<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'rocketLauncher',
	images : {
		base : Game.images['tower_base.png'],
		pad : Game.images['rocket_launcher.png'],
		rocket : Game.images['rocket.png'],
		ranks : [Game.images['rank_1.png'], Game.images['rank_2.png'], Game.images['rank_3.png']]
	},
	reloaded: true,
	canHitFlying: false,
	canHitGround: true,

	render : function(){
		this.target()
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.rotate(Math.PI/180 * this.theta)
		if(this == Game.selectedTurret){
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(-18,-18, 36,36)
		}
		this.ctx.drawImage(this.images.base, -48, -16)		
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-16, -22, 32, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-16, -22, 32 * this.hp / this.maxHp, 3 )
		this.ctx.rotate(Math.PI/180 * this.cannonTheta)
		this.ctx.drawImage(this.images.pad, -48, -16)		
		if(this.reloaded){
			this.ctx.drawImage(this.images.rocket, -48, -16)		
		}
		if(this.fired){
			this.fired = false
			var power = this.power
			if(this.rank > 0){
				power *= this.ranks[this.rank - 1]
			}			
			Game.objects.push(new Rocket(this.canvas, this.x, this.y,  {parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : this.x, y : this.y, power: power}))
		}else{
		}
		this.ctx.restore();
		this.renderRank();
	},
	
	fire : function(){
		Sounds.play(Sounds.turret.rocketLaunch)
	}
	
})

var Rocket = Class.create(Unit, {
	images : {
		rocket : Game.images['rocket_in_action.png'],
		shade : Game.images['rocket_shade.png'],
	},
	speed : 10,
	step : 0,
	lastTargetX : 0,
	lastTargerY : 0,
	render : function(){
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(Math.PI/180 * this.theta);
		this.ctx.drawImage(this.images.rocket, -48 -(this.step*this.speed), -16);		
		//this.ctx.drawImage(this.images.shade, -54 -(this.step*this.speed), -22);		
		this.ctx.restore();
	},	
	move : function(){
		if(this.targetUnit){
			this.lastTargetX  =  this.targetUnit.x
			this.lastTargetY  =  this.targetUnit.y
		}
		var dx = this.x - this.lastTargetX;
		var dy = this.y - this.lastTargetY;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var theta = Math.acos( dx / distance ) *  180 / Math.PI; 		
		if( dy >= 0 ){
			this.theta = theta; 
		}else{
			this.theta = -theta; 
		}
		this.step++;
		if(distance - (this.speed * this.step) <= this.speed){
			if(!this.targetUnit.dead){
				this.targetUnit.takeHit(this.power);
				if(this.targetUnit.dead){
					if(this.parent && !this.parent.dead){
						this.parent.kills++
						if(this.parent.kills == this.parent.rankKills[this.parent.rank] && this.parent.rank < this.parent.maxRank){
							this.parent.rank += 1;
							this.parent.kills = 0;
						}			
					}
				}
			}
			this.die();		
			//Game.animations.push(new RocketBoom(this.ctx, this.lastTargetX, this.lastTargetY))
		}
	},
	die : function(){
		Game.objects.splice(Game.objects.indexOf(this), 1);
	}
})

var Patriot = Class.create(Turret, {
	name : 'R4A',
	targets : 'Air<br/>Only',
	facilities : 'Fires Rockets',
	cssClass : 'patriot',
	images : {
		base : Game.images['tower_base.png'],
		cannon : Game.images['patriot_launcher.png'],
		fire : [Game.images['patriot_launcher_in_action_right.png'], Game.images['patriot_launcher_in_action_left.png']],
		ranks : [Game.images['rank_1.png'], Game.images['rank_2.png'], Game.images['rank_3.png']]
	},
	firing_turn : 0,
	canHitFlying: true,
	canHitGround: false,
	render : function(){
		this.target()
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.rotate(Math.PI/180 * this.theta)
		if(this == Game.selectedTurret){
			this.ctx.fillStyle = 'white'
			this.ctx.fillRect(-18,-18, 36,36)
		}
		this.ctx.drawImage(this.images.base, -48, -16)		
		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(-16, -22, 32, 3)
		this.ctx.fillStyle = 'green'
		this.ctx.fillRect(-16, -22, 32 * this.hp / this.maxHp, 3 )
		this.ctx.rotate(Math.PI/180 * this.cannonTheta)
		if(this.fired){
			this.fired = false
			this.ctx.drawImage(this.images.fire[this.firing_turn], -48, -16)		
			this.firing_turn += 1
			if(this.firing_turn > 1) this.firing_turn = 0			
			var rocketX = this.x - (30 * Math.cos(this.cannonTheta * Math.PI / 180)) + ( - 5 + (10 * this.firing_turn)) * Math.sin(this.theta * Math.PI / 180)
			var rocketY = this.y - (30 * Math.sin(this.cannonTheta * Math.PI / 180)) + ( - 5 + (10 * this.firing_turn)) * Math.cos(this.theta * Math.PI / 180)		
			var power = this.power
			if(this.rank > 0){
				power *= this.ranks[this.rank - 1]
			}			
			Game.objects.push(new PatriotRocket(this.canvas, 0, 0,  {parent : this, theta: this.cannonTheta, targetUnit : this.targetUnit, x : rocketX, y : rocketY, power: power}))
		}else{
			this.ctx.drawImage(this.images.cannon, -48, -16)		
		}
		this.ctx.restore();
		this.renderRank();
	},
	fire : function(target){
		Sounds.play(Sounds.turret.rocketLaunch)
	}
})


var PatriotRocket = Class.create(Rocket, {
	images : {
		rocket : Game.images['patriot_rocket.png'],
	},
	speed : 10,
	render : function(){
		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.ctx.rotate(Math.PI/180 * this.theta);
		this.ctx.drawImage(this.images.rocket, -10 -(this.step*this.speed), -5);		
		this.ctx.restore();
	}
})