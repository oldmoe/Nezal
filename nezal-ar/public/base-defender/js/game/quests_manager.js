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

  displayCongratesMsg : function(msg){
    $('msg').innerHTML = this.game.templatesManager.congrates(msg);
    $('msg').show();
  },

  handleQuests : function() {
    /* Handle Quests should check any quests screens to display :
       if there is any quests notifications, display them one by one.
       else, Check for a mandatory Quest and display it.
    */
    $('questDisplay').hide();
    $('msg').hide();
    var notifications = this.game.user.data.notifications.queue.findAll(function(n) { return n['type'] == 'quest'; });
    if( notifications && notifications.length > 0 ) {
      this.displayCongratesMsg(notifications.first());
    } else {
      var mandatoryQuest = null;
      mandatoryQuest = this.mandatoryQuest();
      if(mandatoryQuest!=null && this.game.tutorial.inProgress.indexOf(mandatoryQuest)==-1)
      {
        this.displayQuest(mandatoryQuest);
        var tutorialHandle = this.game.tutorial[this.game.user.data.quests.descriptions[mandatoryQuest]['name']];
        if(tutorialHandle)
          tutorialHandle();
      }
    }
  },

  /* TODO : make sure it updates status from returned value instead of new request */
  ackCongratesMsgs : function(congratesId){
    this.game.network.notificationAck( congratesId );
    this.game.reInitialize();
  },

  mandatoryQuest : function() {
    var self = this;
    return this.game.user.data.quests['current'].find( function(quest){
                        if(self.game.user.data.quests.descriptions[quest]['mandatory'] == true)
                          return true; 
            });
  }

})
