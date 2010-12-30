var Tutorial = Class.create({
  game : null,

  inProgress : [],
  
  initialize : function(game){
    this.game = game;
    var self = this;
    
    if (game.user.newbie) {
      if(!game.townhallFactory.townhall){
        serviceProvider.getUserInfo(function(){
                                      $('msg').innerHTML = this.game.templatesManager.welcome(serviceProvider.user['first_name']);
                                      $('msg').show();
                                    });
      }else {
        this.checkMandatoryQuests();
      }
    }else {
        this.checkMandatoryQuests();
    }
  },

  checkMandatoryQuests : function() {
    var mandatoryQuest = null;
    mandatoryQuest = this.game.questsManager.mandatoryQuest();
    if(mandatoryQuest!=null && this.inProgress.indexOf(mandatoryQuest)==-1)
    {
      this.game.questsManager.displayQuest(mandatoryQuest);
      if(this[this.game.user.data.quests.descriptions[mandatoryQuest]['name']])
        this[this.game.user.data.quests.descriptions[mandatoryQuest]['name']]();
    }
  },

  townhall : function(){
    this.game.buildingsManager.displayBuildButton();
    var offset = Element.cumulativeOffset($$('.buildButton .okButton')[0]);
    console.log(offset)
    $('hand').setStyle({ top : offset[1] - 60 + "px", left :  offset[0] + "px" });
    $('hand').show();
    var self= this;
    $$('.buildButton .okButton')[0].observe('click', 
                                            function(){
                                              $('hand').hide();
                                              setTimeout(function(){
                                                  var offset = Element.cumulativeOffset($$('#buildingsPanel #townhall .itemData')[0]);
                                                  ['quarry', 'mine'].each(function(item){
                                                      $$('#buildingsPanel #' + item + ' .background')[0].src=Loader.images.quests['inactiveCell.png'].src;
                                                      $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
                                                  });
                                                  var quest = self.game.questsManager.mandatoryQuest();
                                                  if(quest) {
                                                    self.inProgress.push(quest)
                                                    self.inProgress = self.inProgress.uniq();
                                                  }
                                                  $$('#buildingsPanel #townhall .itemData')[0].observe('click', function(){$('hand').hide()});
                                                  $('hand').setStyle({ top : offset[1] - 60 + "px", left :  offset[0] + "px" });
                                                  $('hand').show();
                                              } , 200);
                                           });
  },

  buildTownhall : function(){
    $('establish-townhall-container').show();
    $('establish-townhall').observe('click', function(){
      $('establish-townhall-container').hide();
      game.buildingMode.on(self.game.townhallFactory.newTownhall(), function(){
        //$('establish-townhall').hide();
      });
    });
  }
});
