var Rocket = Class.create(Unit, {
	images : {
		rocket : cityDefenderImages['rocket.png'],
	},
	
	speed : 20,
	step : 0,
	render : function(){
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.rotate(Math.PI/180 * this.theta)
		this.ctx.drawImage(this.images.rocket, -48 -(this.step*this.speed), -16)		
		this.ctx.restore()
	},
	
	move : function(){
		var dx = this.x - this.targetUnit.x
		var dy = this.y - this.targetUnit.y
		var distance = Math.sqrt(dx * dx + dy * dy)
		var theta = Math.acos( dx / distance ) *  180 / Math.PI  		
		if( dy >=0 ){
			this.theta = theta 
		}else{
			this.theta = -theta 
		}
		this.step++
		if(distance - (this.speed * this.step) <= this.speed){
			if(!this.targetUnit.dead){
				this.targetUnit.takeHit(this.power)
			}
			this.die()
		}		
	},
	
	die : function(){
		Game.objects.splice(Game.objects.indexOf(this),1)
	}
})
