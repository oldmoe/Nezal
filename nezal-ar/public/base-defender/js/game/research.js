var Research = Class.create({
  all : null,
  done : null,
  notDone : null,
  
  initialize : function(game){
    this.game = game;
    this.all = game.data.researches;
    this.done = {};
    this.notDone = {};
    
    var allUserResearches = game.user.data.researches;
    for( r in allUserResearches ){
      if( allUserResearches[r].done ){
        this.done[r] = this.all[r];
      } else {
        this.notDone[r] = this.all[r];
      }
    }
    
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
    $('researchDisplay').innerHTML = this.game.templatesManager.load("research-panel", {'researches' : this.notDone, 'disabled' : disabled});
    this.game.addLoadedImagesToDiv("researchDisplay");
    $('interaction').show();
    Animation.show("researchDisplay");
  },
  
  start : function(researchName){
    var response = this.game.network.startResearch(researchName);
    this.game.updateGameStatus(response['gameStatus']);
  }
});