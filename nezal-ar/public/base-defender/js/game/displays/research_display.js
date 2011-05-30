var ResearchDisplay = Class.create({
  
  initialize : function(researchOwner){
    
    researchOwner.game.reInitializationNotifications.push(function(){
      if( $('researchDisplay').getStyle("display") == "block" ){
        researchOwner.game.research.displayResearchPanel({animate : false});
      }
    });
    
    this.researchOwner = researchOwner;
    for (researchName in researchOwner.notDone) {
      var research = researchOwner.notDone[researchName];
      if( researchOwner.allUserResearches[researchName].started ){
        this.seedTime = new Date().getTime();
        this.ongoingResearch = researchOwner.allUserResearches[researchName];
        this.ongoingResearch.name = researchName;
        var self = this;
        researchOwner.game.reactor.pushPeriodical(0, 1, game.reactor.everySeconds(0.5), function(){
          self.tick()
        })
      }
    }
  
  },
  
  tick : function(){
    var timePassed = Math.floor( (new Date().getTime() - this.seedTime)/1000 );
    console.log( Util.timeDisplay(this.ongoingResearch.time_remaining - timePassed) );
    var self = this;
    if( timePassed > this.ongoingResearch.time_remaining + 2 ){
      self.researchOwner.game.reInitialize();
    }
    if( $(this.ongoingResearch.name + "_ongoing") ){
      $(this.ongoingResearch.name + "_ongoing").show();
      var timeLeft = this.ongoingResearch.time_remaining - timePassed;
      $(this.ongoingResearch.name + "TimeLeftText").innerHTML = "Time left " + Util.timeDisplay(timeLeft > 0 ? timeLeft : 0);
    }
  }
  
});