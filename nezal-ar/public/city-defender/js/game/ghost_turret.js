var ghostTurretFeatures = {			
	validate : function(x, y, tower){			
		this.valid = true
		try{
			if(x==Map.bgGrid.length-1||Map.grid[x][y].tower || Map.bgGrid[x][y] == 1 || game.scene.money <tower.prototype.price){
				this.valid = false
			}
		}
		catch(e){
		  console.log("error in map in ",x,y,e)
		}
	},
	checkMap : function(x, y){
		if(!Map.empty(x, y-1) || !Map.empty(x, y) || !Map.empty(x, y + 1)){
			this.valid = false;
		}
	},
		
	select : function(div){
		$('droppingGround').stopObserving("mouseenter")
		var self = GhostTurret
		
		var tower = game.config.towers.find(function(tower){
		return tower == div.className
		})
		
		if(tower == null) return;
		var towerCategory = eval(tower)
		self.images = towerCategory.prototype.images
		self.initImages = towerCategory.prototype.initImages
		self.initImages()
		$('towerInfo').innerHTML = game.scene.templates['towerInfo'].process({values: towerCategory.prototype, tower : towerCategory.prototype})
		self.selected = true;
		$('droppingGround').observe("mouseenter", function(e){
			self.isIn = true
			self.x = e.layerX
			self.y = e.layerY					
			this.observe("mousemove", function(e){
				self.x = e.layerX
				self.y = e.layerY
				var x = Math.floor(e.layerX/32)
				var y = Math.floor(e.layerY/32)
				self.validate(x, y, towerCategory)
			}).observe("click", function(e){
				var x = Math.floor(e.layerX/32)
				var y = Math.floor(e.layerY/32)
				if(!self.selected) return
				self.validate(x, y, towerCategory);
				if(self.valid){
					var turret = new towerCategory(Math.floor(e.layerX/32), Math.floor(e.layerY/32),game.scene)
					game.scene.towerMutators.each(function(mutator){
						mutator.action(turret)
					})
					game.scene.addTurret(turret)
					game.scene.stats.towersCreated++
					game.scene.money -= towerCategory.prototype.price
				}
			})
		}).observe("mouseleave", function(e){
			self.isIn = false
			this.stopObserving("mousemove").stopObserving("click")
		}).addClassName('turret')

	},
	
	showInfo : function(){
	},
	clear : function(){
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
	},
	render : function(ctx){
		ctx.save()		
		ctx.translate(Map.transform(this.x)-Map.pitch, Map.transform(this.y))
		ctx.drawImage(this.images.base[0], 0, 0)		
		if(this.images.cannon){
			ctx.drawImage(this.images.cannon[0], 0, 0)
		}else{
			ctx.drawImage(this.images.pad[0], 0, 0)
			ctx.drawImage(this.images.rocket[0], 0, 0)
		}		
		if(this.valid){
			ctx.fillStyle = 'rgba(255,255,255,0.5)'
			ctx.beginPath();
			ctx.arc(Map.pitch+16, Map.pitch-16, this.range * Map.pitch, 0, Math.PI*2, false)
			ctx.closePath();
			ctx.fill();
		}else{
			ctx.fillStyle = 'rgba(255,0,0,0.0)'
			ctx.beginPath();
			ctx.arc(0, 0, 128, 0, Math.PI*2, false)
			ctx.closePath();
			ctx.fill();
			ctx.fillStyle = 'rgba(255,0,0,0.9)'
			ctx.fillRect(32,0, 32, 32)
		}
		ctx.restore();		
	}
}			
