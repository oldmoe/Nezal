var RocketLauncher = Class.create(Turret, {
	images : {
	  base : cityDefenderImages['tower_base.png'],
		pad : cityDefenderImages['rocket_launcher.png'],
		rocket : cityDefenderImages['rocket.png'],
		fire : new Image(),
	},
	reloaded: true,
	
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
			Game.objects.push(new Rocket(this.canvas, this.x, this.y,  {theta: this.theta, targetUnit : this.targetUnit, x : this.x, y : this.y, power: this.power}))
		}else{
		}
		this.ctx.restore();
	},
	
	fire : function(){
	}
	
})
