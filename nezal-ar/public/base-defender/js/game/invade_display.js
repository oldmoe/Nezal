var InvadeDisplay = Class.create({
    invadedUserId : null,
    initialize : function(game){
      this.game = game
    },
    registerListeners : function(){
            var self = this
      $$('#invadeDisplay #upLeftInvade')[0].observe('click',function(){
//        if(self.invadedUserId){
            $('invadeDisplay').hide()
            $('attackDiv').show();
            self.game.attackManager.simulateAttack(Map.NW,game.originalUserData.creeps)
//        }
      })
      $$('#invadeDisplay #upRightInvade')[0].observe('click',function(){
//        if(self.invadedUserId){
          $('invadeDisplay').hide()
          $('attackDiv').show();
          self.game.attackManager.simulateAttack(Map.NE,game.originalUserData.creeps)
//        }
      })
      $$('#invadeDisplay #downLeftInvade')[0].observe('click',function(){
//        if(self.invadedUserId){
          $('invadeDisplay').hide()
          $('attackDiv').show();
          self.game.attackManager.simulateAttack(Map.SW,game.originalUserData.creeps)
//        }
      })
      $$('#invadeDisplay #downLeftInvade')[0].observe('click',function(){
//        if(self.invadedUserId){
            $('invadeDisplay').hide()
            $('attackDiv').show();
            self.game.attackManager.simulateAttack(Map.SE,game.originalUserData.creeps)
//        }
      })
    },
    show : function(invadedUserId){
      $('invadeDisplay').innerHTML = game.templatesManager.load('invadeScene',{creeps:game.originalUserData.creeps})
      game.addLoadedImagesToDiv('invadeDisplay')
      this.registerListeners()
      if(invadedUserId) game.invadeDisplay.invadedUserId = invadedUserId
      if (this.game.zoomFactor == 1) {
        game.controlsPanel.zoom()
      }
      $('interaction').show()
      $('invadeDisplay').show()
    },
    hide : function(){
      $('interaction').show()
      $('invadeDisplay').hide()
    }
})
