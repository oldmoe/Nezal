var Scenario = Class.create({
  initialize : function(scene,conversation){
      this.scene = scene
      this.scene.moving = false
      this.scene.conversationOn = true
      this.conversation = conversation
      this.continueConversation()
      var self = this 
      document.stopObserving('click')     
      document.observe('click',function(e){
        if(!self.scene.bubbles[0])return 
        self.scene.bubbles[0].destroy()
        self.scene.bubbles.splice(0,1)
        self.continueConversation()
      })
  },
  continueConversation : function(){
    if(this.conversation.length == 0){
      this.scene.conversationOn = false
    }
    else{
     var message = this.conversation[0]
     this.conversation.splice(0,1)
     var index = message.index
     var lane = message.lane
     var msgValue = message.msg
     this.scene.addBubble(index,lane,msgValue)
    }
  }
  
  
})
