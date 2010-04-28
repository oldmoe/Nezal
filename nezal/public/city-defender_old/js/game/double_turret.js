var DoubleTurret = Class.create(Turret, {
	images : {
		base : cityDefenderImages['tower_base.png'],
		cannon : cityDefenderImages['canon_2.png'],
		fire : [  
		          cityDefenderImages['canon_2_in_action_right.png'],  
              cityDefenderImages['canon_2_in_action_left.png'],
            ]
	},
	firing_turn : 0,
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
		//this.ctx.drawImage(this.images.cannon, -48, -16)		
		if(this.fired){
			this.fired = false
			this.ctx.drawImage(this.images.fire[this.firing_turn], -48, -16)		
			this.firing_turn += 1
			if(this.firing_turn > 1) this.firing_turn = 0
		}else{
			this.ctx.drawImage(this.images.cannon, -48, -16)		
		}
		this.ctx.restore();
	}
})
