/**
 * @author nomier
 */
var QuestsManager = Class.create({

  status : {
    notStarted : -1,
    inProgress : 0,
    done : 1
  },

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
    $('interaction').show();
    Animation.show('questScreen');
  },

  displayCongratesMsg : function(msg){
    $('msg').innerHTML = this.game.templatesManager.congrates(msg);
    $('interaction').show();
    $('msg').show();
    Animation.show('congratesMsg');
  },

  handleQuests : function() {
    /* Handle Quests should check any quests screens to display :
       if there is any quests notifications, display them one by one.
       else, Check for a mandatory Quest and display it.
    */
    $('buildingDisplay').hide();
    $('interaction').hide();
    $('msg').innerHTML = ""
    $('questDisplay').innerHTML = ""
    var notifications = this.game.user.data.notifications.queue.findAll(function(n) { return n['type'] == 'quest'; });
    if( notifications && notifications.length > 0 ) {
      this.displayCongratesMsg(notifications.first());
    } else {
      var mandatoryQuest = null;
      mandatoryQuest = this.mandatoryQuest();
      if(mandatoryQuest!=null)
      {
        this.displayQuest(mandatoryQuest);
        var tutorialHandle = this.game.tutorial[this.game.user.data.quests.descriptions[mandatoryQuest]['name']];
        if(tutorialHandle)
          tutorialHandle.handle();
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
    var mandatory =  this.game.user.data.quests['current'].find( function(quest){
                            if(self.game.user.data.quests.descriptions[quest]['mandatory'] == true)
                            {
                              if(self.game.user.data.quests.descriptions[quest]['status']['buildings'])
                              {
                                for(var i in self.game.user.data.quests.descriptions[quest]['status']['buildings'])
                                {
                                  var conditions = self.game.user.data.quests.descriptions[quest]['status']['buildings'][i]; 
                                  for( var j in conditions)
                                  {
                                    if(conditions[j]['status'] == self.status.notStarted )
                                    {
                                      return true; 
                                    }else if(conditions[j]['status'] == self.status.inProgress )
                                    {
                                      return false
                                    }
                                  }
                                }
                              }
                              if(self.game.user.data.quests.descriptions[quest]['status']['resources'])
                              {
                                for(var i in self.game.user.data.quests.descriptions[quest]['status']['resources'])
                                {
                                  var conditions = self.game.user.data.quests.descriptions[quest]['status']['resources'][i];
                                  if(conditions['status'] == self.status.notStarted )
                                  {
                                    return true; 
                                  }else if(conditions['status'] == self.status.notStarted )
                                  {
                                    return false;
                                  }
                                } 
                              }
                            }
                    }); 
    return mandatory;
  }

})
