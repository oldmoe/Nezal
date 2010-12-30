var Tutorial = Class.create({
  game : null,

  inProgress : [],
  
  initialize : function(game){
    this.game = game;
    var self = this;    
  },

  fire : function(){
    if (this.game.user.newbie) {
      if(!this.game.townhallFactory.townhall){
        serviceProvider.getUserInfo(function(){
                                      $('msg').innerHTML = this.game.templatesManager.welcome(serviceProvider.user['first_name']);
                                      $('msg').show();
                                    });
      }else {
        this.game.questsManager.handleQuests();
      }
    }else {
      this.game.questsManager.handleQuests();
    }
  },

  townhall : function(){
    this.game.buildingsManager.displayBuildButton();
    var offset = Element.cumulativeOffset($$('.buildButton .okButton')[0]);
    console.log(offset)
    $('hand').setStyle({ top : offset[1] - 60 + "px", left :  offset[0] + "px" });
    $('hand').show();
    var self = this.game.tutorial;
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

  quarry : function(){
    this.game.buildingsManager.displayBuildButton();
    var offset = Element.cumulativeOffset($$('.buildButton .okButton')[0]);
    console.log(offset)
    $('hand').setStyle({ top : offset[1] - 60 + "px", left :  offset[0] + "px" });
    $('hand').show();
    var self = this.game.tutorial;
    $$('.buildButton .okButton')[0].observe('click', 
                                            function(){
                                              $('hand').hide();
                                              setTimeout(function(){
                                                  var offset = Element.cumulativeOffset($$('#buildingsPanel #quarry .itemData')[0]);
                                                  ['townhall', 'mine'].each(function(item){
                                                      $$('#buildingsPanel #' + item + ' .background')[0].src=Loader.images.quests['inactiveCell.png'].src;
                                                      $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
                                                  });
                                                  var quest = self.game.questsManager.mandatoryQuest();
                                                  if(quest) {
                                                    self.inProgress.push(quest)
                                                    self.inProgress = self.inProgress.uniq();
                                                  }
                                                  $$('#buildingsPanel #quarry .itemData')[0].observe('click', function(){$('hand').hide()});
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
