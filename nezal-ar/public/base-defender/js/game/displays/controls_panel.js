var ControlsPanel = Class.create({
  initialize : function(game){
    this.game = game
    
  },
  _AttachDefaultEvents : function(){
     $$('#controlPanel .controlContainer').each(function(div){
			div.observe('mousedown',function(){
				$$('#'+div.id+" .controlClick")[0].show()
			})
			div.observe('mouseup',function(){
				$$('#'+div.id+" .controlClick")[0].hide()
			})
			div.observe('mouseover',function(){
				$$('#'+div.id+" .controlHover")[0].show()
			})
			div.observe('mouseout',function(){
				$$('#'+div.id+" .controlHover")[0].hide()
			})
			div.observe('mouseup',function(){
				$$('#'+div.id+" .controlHover")[0].hide()
			})
		})
  },
  _AttachMoveListener : function(){
  	var buidlingMode = this.game.buidlingMode
  	$('move').observe(this.game.mouseClickEvent,function(){
  		buidlingMode.moveMode = true
  		buidlingMode.showBuildingBases()
  		$('cancelBuilding').show();
	  })
  },
  _AttachZoomListener : function(){
     var self = this
  	$('zoom').observe(this.game.mouseClickEvent,function(){
		  self.zoom()
	  }) 
  },
  _AttackSoundListener : function(){
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