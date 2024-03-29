var ghostTurretFeatures = {			
	validate : function(){			
		this.valid = true
		try{
			if(Map.grid[this.xGrid]&&Map.grid[this.xGrid][this.yGrid])
			if(this.xGrid==Map.bgGrid.length-1||Map.grid[this.xGrid][this.yGrid].tower || Map.bgGrid[this.xGrid][this.yGrid] > 0 || 
			game.scene.money <this.tower.prototype.price ||this.yGrid==0){
				this.valid = false
			}
		}
		catch(e){
		  console.log("error in map in ",x,y,e)
		}
		game.scene.push(20,this.validate,this)
	},
	checkMap : function(x, y){
		if(!Map.empty(x, y-1) || !Map.empty(x, y) || !Map.empty(x, y + 1)){
			this.valid = false;
		}
	},
	
	droppingGroundClick : function(e){
		var x=0,y=0
		var self = GhostTurret
		if(e.layerX){x = e.layerX;y = e.layerY}					//other than opera
		else{x=e.x;y=e.y}										//opera
		self.xGrid = Math.floor(x/32)
		self.yGrid = Math.floor(y/32)
		self.validate();
		if(self.valid&&self.selected){
			self.selected = true
			game.scene.addTurret(self.towerName, Math.floor(x/32), Math.floor(y/32))
		}
		else if (Map.grid[self.xGrid][self.yGrid].tower){
			self.selected = false
			game.scene.selectTower(self.xGrid, self.yGrid)
		}
		else{
				Sounds.play(Sounds.gameSounds.wrong_tower)
		}
		if(game.scene.selectedTower)
		game.scene.processTowerInfoTemplate()
	},
	select : function(div){
		$('droppingGround').stopObserving("mouseenter")
		var self = GhostTurret
		if(game.scene.selectedTower&&game.scene.selectedTower.display){
				game.scene.selectedTower.display.rangeSprite.visible = false
		}

		var tower = game.config.towers.find(function(tower){return tower == div.className})
		self.towerName = tower
		if(tower == null){ 	return; }
		var towerCategory = eval(tower)
		var towerDisplay = eval(tower+"Display")
		game.scene.selectedTower = towerCategory.prototype
		self.images = towerDisplay.prototype.images
		self.initImages = towerDisplay.prototype.initImages
		self.range = towerCategory.prototype.range
		self.initImages(1)
		self.selected = true;
		//$('droppingGround').style.cursor = "none"
		$('droppingGround').observe("mouseenter", function(e){
			self.isIn = true
			var x=0,y=0
			if(e.layerX){x = e.layerX;y = e.layerY}					//other than opera
			else{x=e.x;y=e.y}
			self.x = x
			self.y = y
			this.observe("mousemove", function(e){
				var x=0,y=0
				if(e.layerX){x = e.layerX;y = e.layerY} //other than opera
				else{x=e.x;y=e.y} //opera
				self.x = x
				self.y = y
				self.xGrid = Math.floor(x/32)
				self.yGrid = Math.floor(y/32)
				if(Map.grid[self.xGrid]&&Map.grid[self.xGrid][self.yGrid]&&Map.grid[self.xGrid][self.yGrid].tower){
					self.hoverXgrid = self.xGrid
					self.hoverYGrid = self.yGrid
						self.towerHovered = true
					}
				else{
					self.towerHovered = false
				}
				self.tower = towerCategory
				self.validate()
			}).observe("click",function(e){GhostTurret.droppingGroundClick(e)})
		}).observe("mouseleave", function(e){
			self.isIn = false
			this.stopObserving("mousemove").stopObserving("click")
		}).addClassName('turret')
		if(game.scene.selectedTower)
		game.scene.processTowerInfoTemplate()
	},
	showInfo : function(){
	},
	clear : function(){
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
	},
	render : function(ctx){
		ctx.save()
		ctx.translate(Map.transform(this.x)-Map.pitch, Map.transform(this.y))
		if(this.towerHovered){
			ctx.drawImage(Loader.images.game['hover_effect.png'],25,-3)
		}else{
			if(GhostTurret && GhostTurret.selected && GhostTurret.isIn){
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
					ctx.arc(Map.pitch+16, Map.pitch-16, (this.range * Map.pitch) + (Map.pitch/2), 0, Math.PI*2, false)
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
			}
		}
		ctx.restore(); 
	}
}			
