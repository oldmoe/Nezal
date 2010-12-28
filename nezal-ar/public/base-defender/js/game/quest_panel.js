/**
 * @author nomier
 */
var QuestPanel = Class.create({
  initialize : function(game){
    this.game = game
  },
  render : function(){
    if(this.game.neighborGame) return;
    $('quest-panel').show();
    $('quests-list').innerHTML = this.game.templatesManager.questsList(game.user.data.quests.descriptions);
  }
})