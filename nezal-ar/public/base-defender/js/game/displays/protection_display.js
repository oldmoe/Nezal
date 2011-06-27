var ProtectionDisplay = Class.create({
  initialize : function(game){
    this.game = game;
    this.protection = game.user.data.protection
    if (this.protection) {
      this.working = this.protection.working
    }else{
      this.working = false
    }
    if(this.working){
      this.remaining = this.protection.started + this.protection.time -  Math.round(new Date().getTime()/1000);
      $('protectionTime').show()
    }else{
      $('protectionTime').hide()
    }
    var self = this
    game.reactor.pushPeriodical(0,1,game.reactor.everySeconds(1), function(){self.render()});
  },
  
  render : function(){
//    if(this.working && this.remaining <=0){
//      game.reInitialize()
//    }
    this.remaining -- 
    $('protectionTime').innerHTML = "Protection: "+Util.timeDisplay(this.remaining)
  }
  

})