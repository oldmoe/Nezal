var ControlsPanel = Class.create({
  initialize : function(game){
    this.game = game
    this._AttachDefaultEvents()
    this._AttachMoveListener()
    this._AttachZoomListener()
    this._AttachSoundListener()
    this._AttachMusicListener()
    this._AttackOpenerListener()    
  },
  _AttachDefaultEvents : function(){
     $$('#controlPanel .controlContainer').each(function(div){
       div.stopObserving('mousedown')
			div.observe('mousedown',function(){
				$$('#'+div.id+" .controlClick")[0].show()
			})
      div.stopObserving('mouseup')
			div.observe('mouseup',function(){
				$$('#'+div.id+" .controlClick")[0].hide()
			})
      div.stopObserving('mouseover')
			div.observe('mouseover',function(){
				$$('#'+div.id+" .controlHover")[0].show()
			})
      div.stopObserving('mouseout')
			div.observe('mouseout',function(){
				$$('#'+div.id+" .controlHover")[0].hide()
			})
		})
  },
  _AttachMoveListener : function(){
  	var buildingMode = this.game.buildingMode
  	$('move').observe('mouseup',function(){
  		buildingMode.moveMode = true
  		buildingMode.showBuildingBases()
  		$('cancelBuilding').show();
	  })
  },
  _AttachZoomListener : function(){
     var self = this
  	$('zoom').observe('mouseup',function(){
     if($$('#controlPanel #zoom')[0].getAttribute('clicked')=='true'){
				$$('#controlPanel #zoom')[0].setAttribute('clicked','false')
				$$('#controlPanel #zoom .controlClicked')[0].hide()
				$$('#controlPanel #zoom .controlButton')[0].show()
			}else{
				$$('#controlPanel #zoom .controlClicked')[0].show()
				$$('#controlPanel #zoom .controlButton')[0].hide()
				$$('#controlPanel #zoom')[0].setAttribute('clicked','true')
			}
		  self.zoom()
	  }) 
  },
  _AttachSoundListener : function(){    
    $$('#controlPanel #sound')[0].observe('mouseup',function(){
			if($$('#controlPanel #sound')[0].getAttribute('clicked')=='true'){
				$$('#controlPanel #sound')[0].setAttribute('clicked','false')
				$$('#controlPanel #sound .controlClicked')[0].hide()
				$$('#controlPanel #sound .controlButton')[0].show()
			}else{
				$$('#controlPanel #sound .controlClicked')[0].show()
				$$('#controlPanel #sound .controlButton')[0].hide()
				$$('#controlPanel #sound')[0].setAttribute('clicked','true')
			}
			if(Sounds.muted){
				Sounds.soundOn()
			}else{
				Sounds.mute()
			}
		})
  },
  _AttachMusicListener : function(){
    $$('#controlPanel #music')[0].observe('mouseup',function(){
			if($$('#controlPanel #music')[0].getAttribute('clicked')=='true'){
				$$('#controlPanel #music')[0].setAttribute('clicked','false')
				$$('#controlPanel #music .controlClicked')[0].hide()
				$$('#controlPanel #music .controlButton')[0].show()
			}else{
				$$('#controlPanel #music .controlClicked')[0].show()
				$$('#controlPanel #music .controlButton')[0].hide()
				$$('#controlPanel #music')[0].setAttribute('clicked','true')
			}
			Sounds.switchmusic()
		})
  },
  _AttackOpenerListener : function(){
    var self = this
    $$('#controlPanel #openControl')[0].stopObserving(this.game.mouseClickEvent)
    $$('#controlPanel #openControl')[0].observe(this.game.mouseClickEvent,function(){
      this.stopObserving(self.game.mouseClickEvent)
      if(this.getAttribute('opened') == 'true'){
        this.setAttribute('opened','false')
        new Effect.Move('controlPanel', {
          y: 72,
          mode: 'relative',
          transition: Effect.Transitions.spring,
          afterFinish : function(){self._AttackOpenerListener()}
        })
      }else{
        this.setAttribute('opened','true')
        new Effect.Move('controlPanel', {
          y: -72,
          mode: 'relative',
          duration: 0.3,
          afterFinish : function(){self._AttackOpenerListener()}
        })
      }
    })  
  },
  zoom : function(){
		if(this.game.zoomFactor ==1){
			this.game.zoomFactor = 0.5
			$('gameCanvas').addClassName('zoomed')
			$('zoom').removeClassName('in')
			$('zoom').addClassName('out')
		}else{
			this.game.zoomFactor = 1
			$('gameCanvas').removeClassName('zoomed')
			$('zoom').removeClassName('out')
			$('zoom').addClassName('in')
		}
		Map.centerMap(this.game.zoomFactor) 
	}
})