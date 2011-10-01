var AttackIterfaceManager = Class.create({
    creeps: {"topLeft":{},"topRight":{},"bottomLeft":{},"bottomRight":{}},
    creepTypes : {"topLeft":0,"topRight":0,"bottomLeft":0,"bottomRight":0},
    creepIndeces : {"topLeft":{},"topRight":{},"bottomLeft":{},"bottomRight":{}},
    selectedDiv : null,
    initialize:function(game){
      this.game = game
      this.availableCreeps = this.game.user.data.creeps
    },
    registerPanelListeners : function(){
    this.creeps = {"topLeft":{},"topRight":{},"bottomLeft":{},"bottomRight":{}}
		this.creepTypes = {"topLeft":0,"topRight":0,"bottomLeft":0,"bottomRight":0}
		this.creepIndeces = {"topLeft":{},"topRight":{},"bottomLeft":{},"bottomRight":{}}
    var self = this
		$$('#attackPanel #creepsScroll #creeps-ul .item').each(function(div){
			div.observe('click',function(){
        var selectedDiv = self.selectedDiv
        var creeps = self.creeps
        var creepTypes = self.creepTypes
        var creepIndeces = self.creepIndeces
        var availableCreeps = self.availableCreeps
				if(selectedDiv  && availableCreeps[div.id]>0){
					if(creeps[selectedDiv.id][div.id]){
						creeps[selectedDiv.id][div.id]++
						$$('#attackInterface #'+selectedDiv.id+' .creep'+creepIndeces[selectedDiv.id][div.id]+' .count')[0].innerHTML = creeps[selectedDiv.id][div.id]
						availableCreeps[div.id]--
					}else{
						if(creepTypes[selectedDiv.id]<6){
							creeps[selectedDiv.id][div.id] = 1
							creepTypes[selectedDiv.id]++
							creepIndeces[selectedDiv.id][div.id] = creepTypes[selectedDiv.id]
							$$('#attackInterface #'+selectedDiv.id+' .creep'+creepTypes[selectedDiv.id]+' img')[0].src = 'images/creeps/menu/'+div.id+'_button.png'
							$$('#attackInterface #'+selectedDiv.id+' .creep'+creepTypes[selectedDiv.id]+' .count')[0].innerHTML = creeps[selectedDiv.id][div.id]
							availableCreeps[div.id]--
						}
					}
					 if(availableCreeps[div.id]==0){
							$$('#attackPanel #creepsAvailable #'+div.id+' img')[0].src = 'images/creeps/menu/'+div.id+'_button_disabled.png'
					}
					$$('#attackInterface #creeps-ul #'+div.id+' .count')[0].innerHTML = availableCreeps[div.id]
				}
			})
		})
   },
   registerCornerListeners : function(){
     this.selectedDiv = null
     var self = this
		$$('#attackInterface .attackCorner').each(function(div){
			div.observe('mouseover',function(){
				if(div!=self.selectedDiv)
				$$("#"+div.id+" .triangle_hover")[0].show()
			})
			div.observe('mouseout',function(){
				if(div!=self.selectedDiv)
				$$("#"+div.id+" .triangle_hover")[0].hide()
			})
			div.observe('click',function(){
				if(self.selectedDiv!=null) $$("#"+self.selectedDiv.id+" .triangle_selected")[0].hide()
				self.selectedDiv = div
				$$("#"+self.selectedDiv.id+" .triangle_hover")[0].hide()
				$$("#"+self.selectedDiv.id+" .triangle_selected")[0].show()
			})
		})
   },
   show : function(){
     if(this.game.originalUserData) this.availableCreeps = this.game.originalUserData.creeps
       this.totalCreepsAvailable= 0
      for(var type in this.availableCreeps){
        this.totalCreepsAvailable+=this.availableCreeps[type]
      }
      if (this.game.zoomFactor == 1) {
        game.controlsPanel.zoom()
      }
        this.initializeCaruosel()
        this.registerCornerListeners()
        this.registerPanelListeners()
          $('interaction').show()
          $('attackInterfaceContainer').show()
          new Effect.Move('topLeft', {x:150,y:150})
    			new Effect.Move('topRight', {x:-150,y:150})
    			new Effect.Move('bottomLeft', {x:150,y:-150})
    			new Effect.Move('bottomRight', {x:-150,y:-150})
    			new Effect.Move('attackPanel', {y:-147})
       
   },
   hide : function(callback){
      new Effect.Move('topLeft', {x:-150,y:-150})
			new Effect.Move('topRight', {x:150,y:-150})
			new Effect.Move('bottomLeft', {x:-150,y:150})
			new Effect.Move('bottomRight', {x:150,y:150,afterFinish:function(){
        $('attackInterfaceContainer').hide()
        if(callback)callback()
       }})
			new Effect.Move('attackPanel', {y:147})
   },
   initializeCaruosel : function(){
     var images = {
              'left' : 'images/quests/arrows_horizontal.png',
              'left-disabled' : 'images/quests/arrows_horizontal.png',
              'right' : 'images/quests/arrows_horizontal.png',
              'right-disabled' :'images/quests/arrows_horizontal.png'
            }
		$('attackInterfaceContainer').innerHTML = game.templatesManager.load("attackPanelCreeps", {'creeps' : this.availableCreeps});
    if(this.totalCreepsAvailable>0){
		  $$('#creepsAvailable #creeps-ul')[0].style.width = this.totalCreepsAvailable* parseInt(
      $$('#creepsAvailable #creeps-ul li')[0].getStyle("width").replace("px","")) +"px"
    }
		this.creepsCarousel = new Carousel("creepsScroll", images, 5);
		this.creepsCarousel.checkButtons();
    var self = this
    $$('#attackInterface #attackPanel #attackButton')[0].observe('click',function(){
      self.hide()
      $('attackDiv').show();
      self.game.attackManager.simulateAttack(self.creeps)
    })
    $$('#attackInterface #attackPanel #endAttack')[0].observe('click',function(){
      self.hide(function(){game.reInitialize(function(){game.scene.render()});})
      $('attackDiv').hide();
      if (self.game.zoomFactor == 0.5) {
        game.controlsPanel.zoom()
      }
    })
   }
   
})
