/**
 * @author nomier
 */
var QuestsManager = Class.create({

  initialize : function(game){
    this.game = game
  },

  render : function(){
    if(this.game.neighborGame) return;
    $('quest-panel').show();
    $('quests-list').innerHTML = this.game.templatesManager.questsList(game.user.data.quests.descriptions);
  },

  displayQuest : function(questId){
    $('questDisplay').innerHTML = '';
    $('questDisplay').innerHTML = this.game.templatesManager.quest(this.game.user.data.quests.descriptions[questId]);
    $('questDisplay').show();
  },

  mandatoryQuest : function() {
    var self = this;
    return this.game.user.data.quests['current'].find( function(quest){
                        if(self.game.user.data.quests.descriptions[quest]['mandatory'] == true)
                          return true; 
            });
  }

})
