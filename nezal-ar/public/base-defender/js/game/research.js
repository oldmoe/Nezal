var Research = Class.create({
  all : null,
  done : null,
  notDone : null,
  
  initialize : function(game){
    this.game = game;
    this.all = game.data.researches;
    this.done = {};
    this.notDone = {};
    
    this.allUserResearches = game.user.data.researches;
    for( r in this.allUserResearches ){
      if( this.allUserResearches[r].done ){
        this.done[r] = this.all[r];
      } else {
        this.notDone[r] = this.all[r];
      }
    }
    new ResearchDisplay(this);
    
    //Debug Code
    var self = this;
    document.observe('keydown', function(event){
      if (event.keyCode == 82) {
        self.displayResearchPanel({'disabled' : []});
      }
    });
    /////////////
  },
  
  displayResearchPanel : function(options){
    var disabled = [];
    var mayBeDisabled = [];
    for(researchName in this.notDone ){
      var research = this.notDone[researchName];
      if( this.allUserResearches[researchName].started ){
        disabled = mayBeDisabled;
      } else {
        mayBeDisabled.push(researchName);
        research.msg = "Another research is already running";
      }
      
      var missingRock = research.needs.rock - this.game.resources.rock;
      var missingLumber = research.needs.lumber - this.game.resources.lumber;
      
      if(missingRock > 0 && missingLumber > 0) {
        disabled.push( researchName );
      }
      
      if(missingRock > 0 && missingLumber > 0){
        research.msg = "You need more " + this.game.scene.formatResourceDisplay(missingRock) + " rock, and " +
                       this.game.scene.formatResourceDisplay(missingLumber) + " lumber";
      } else if ( missingRock > 0 ){
        research.msg = "You need more " + this.game.scene.formatResourceDisplay(missingRock) + " rock";
      } else if ( missingLumber > 0 ){
        research.msg = "You need more " + this.game.scene.formatResourceDisplay(missingLumber) + " lumber";
      }
    };
    $('researchDisplay').innerHTML = this.game.templatesManager.load("research-panel", {'researches' : this.notDone, 'disabled' : disabled});
    this.game.addLoadedImagesToDiv("researchDisplay");
    if( options.animate != false ) {
      $('interaction').show();
      Animation.show("researchDisplay");
    }
  },
  
  start : function(researchName){
    var response = this.game.network.startResearch(researchName);
    this.game.updateGameStatus(response['gameStatus']);
  }
});
