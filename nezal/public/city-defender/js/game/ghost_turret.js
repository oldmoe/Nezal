var ghostTurretFeatures = {			
	validate : function(x, y, tower){			
		this.valid = true
		if(Map.grid[x][y].tower || Map.bgGrid[x][y] == 1 || Game.money < tower.values.price){
			this.valid = false
		}
	},
	checkMap : function(x, y){
		if(!Map.empty(x, y-1) || !Map.empty(x, y) || !Map.empty(x, y + 1)){
			this.valid = false;
		}
	},
	select : function(){
		Game.selectedTurret = null
		$('droppingGround').stopObserving("mouseenter")
		//$$('.tower').each(function(t){t.removeClassName('selected')})
		//$('unitData').innerHTML = ''
		var self = GhostTurret
		var div = this;
		//this.addClassName('selected')
		var tower = Config.towers.find(function(tower){return tower.name == div.title})
		if(tower == null) return;
		tower.values.maxHp = tower.values.hp
		Object.extend(self, tower.values)
		self.images = tower.klass.prototype.images
		self.initImages = tower.klass.prototype.initImages
		self.initImages()
		//tower.attributes = Tower.attributes
		//$('unitData').innerHTML = Game.templates['unitData'].process({unit: tower.values})
		self.selected = true;
		$('droppingGround').observe("mouseenter", function(e){
			//alert('in')
			self.isIn = true
			self.x = e.layerX
			self.y = e.layerY					
			this.observe("mousemove", function(e){
				self.x = e.layerX
				self.y = e.layerY
				var x = Math.floor(e.layerX/32)
				var y = Math.floor(e.layerY/32)
				self.validate(x, y, tower)
			}).observe("click", function(e){
				var x = Math.floor(e.layerX/32)
				var y = Math.floor(e.layerY/32)
				if(Map.grid[x][y].tower){
					Game.selectedTurret = Map.grid[x][y].tower
					self.selected = false
					self.isIn = false
					div.removeClassName("selected")
					$('droppingGround').stopObserving('mousemove').stopObserving('mouseenter').removeClassName('turret')
					return
				}
				if(!self.selected) return
				self.validate(x, y, tower);
				if(self.valid){
					var turret = new tower.klass($('gameForeground'), Math.floor(e.layerX/32), Math.floor(e.layerY/32), tower.values)
					Game.turrets.push(turret)
					Map.grid[turret.gridX][turret.gridY].tower = turret
					Game.money -= turret.price
				}
			})
		}).observe("mouseleave", function(e){
			self.isIn = false
			this.stopObserving("mousemove").stopObserving("click")
		}).addClassName('turret')

	},
	clear : function(){
		//this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height)
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
	},
	render : function(){
		this.ctx.save()
		this.ctx.translate(this.x, this.y)
		this.ctx.drawImage(this.images.base, -48, -16)		
		if(this.images.cannon){
			this.ctx.drawImage(this.images.cannon, -48, -16)
		}else{
			this.ctx.drawImage(this.images.pad, -48, -16)
			this.ctx.drawImage(this.images.rocket, -48, -16)
		}		
		if(this.valid){
			this.ctx.fillStyle = 'rgba(55,55,55,0.5)'
			this.ctx.beginPath();
			this.ctx.arc(0, 0, this.range * Map.pitch, 0, Math.PI*2, false)
			this.ctx.closePath();
			this.ctx.fill();
		}else{
			this.ctx.fillStyle = 'rgba(255,0,0,0.0)'
			this.ctx.beginPath();
			this.ctx.arc(0, 0, 128, 0, Math.PI*2, false)
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.fillStyle = 'rgba(255,0,0,0.9)'
			this.ctx.fillRect(-16,-16, 32, 32)
		}
		this.ctx.restore();		
	}
}			