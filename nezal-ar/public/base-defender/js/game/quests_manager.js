/**
 * @author nomier
 */
var QuestsManager = Class.create({

  status : {
    notStarted : -1,
    inProgress : 0,
    done : 1
  },

  categories : {
    1 : "civil",
    2 : "military",
    3 : "social"
  },
  
  categoryMsgs : {
    "noQuest" : "No quests at the moment.",
    "civil" : "Civil quests : Build your empire. Continue the structure of your buildings." ,
    "military" : "Military Quests : Place your wedges. Defend your Empire" ,
    "social" : "Social Quests : Increase your neighbours"
  },

  initialize : function(game){
    this.game = game
  },

  render : function(){
    if(this.game.neighborGame) return;
    var quests = this.nextInCategory();
    $('quest-panel').innerHTML = this.game.templatesManager.questsList(quests);
    $$('#quest-panel .clickable').each( function(button){
                                            var id = button.getAttribute('id');
                                            button.observe( 'click', function(){
                                                                        game.questsManager.displayQuest(id);
                                                                      });
                                            $$( "#quest-panel #" + id + " .shadow")[0].hide();
                                            button.observe( 'mouseover', function(){
                                                                           $$( "#quest-panel #" + id + " .shadow")[0].show();
                                                                        });
                                            button.observe( 'mouseout', function(){
                                                                           $$("#quest-panel #" + id + " .shadow")[0].hide();
                                                                        });
                              });
    $$('#quest-panel .empty').each( function(button){
                                            var id = button.getAttribute('id');
                                            button.observe( 'click', function(){
                                                                        game.questsManager.displayQuestEmptyMsg(id);
                                                                      });
                                            $$( "#quest-panel #" + id + " .shadow")[0].hide();
                                            button.observe( 'mouseover', function(){
                                                                           $$( "#quest-panel #" + id + " .shadow")[0].show();
                                                                        });
                                            button.observe( 'mouseout', function(){
                                                                           $$("#quest-panel #" + id + " .shadow")[0].hide();
                                                                        });
                              });
    $('quest-panel').show();
  },

  displayQuest : function(questId){
    if($('emptyQuest')) Animation.hide('emptyQuest');
    $('msg').hide();
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

  displayQuestEmptyMsg : function(category){
    if($('questScreen')) Animation.hide('questScreen');
    $('questDisplay').hide();
    $('msg').innerHTML = '';
    $('msg').innerHTML = this.game.templatesManager.emptyQuest(category, this.categoryMsgs[category], this.categoryMsgs["noQuest"]);
    $('msg').show();
    $('interaction').show();
    Animation.show('emptyQuest');
  },

  handleQuests : function() {
    if(this.game.neighborGame == true)
    {
      if($('quest-panel')) $('quest-panel').hide();
      if($('msg')) $('msg').hide();
      if($('questDisplay')) $('questDisplay').hide();
      if($('emptyQuest')) $('emptyQuest').hide();
      return;
    }
    /* Handle Quests should check any quests screens to display :
       if there is any quests notifications, display them one by one.
       else, Check for a mandatory Quest and display it.
    */
    $('buildingDisplay').hide();
    $('msg').innerHTML = ""
    $('questDisplay').innerHTML = ""
    this.render();
    var notifications = this.game.user.data.notifications.queue.findAll(function(n) { return n['type'] == 'quest'; });
    if( notifications && notifications.length > 0 ) {
			$('interaction').hide();
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
  },

  nextInCategory : function() {
    var self = this;
    var result = { };
    for( var i in this.categories) 
    {
      // Initialize the next quest for each category with null
      result[this.categories[i]]  = null;
      // Find Next quest id for each category
      result[this.categories[i]] = this.game.user.data.quests['current'].find( function(quest){
                                                    if(self.game.user.data.quests.descriptions[quest]['category'] == i)
                                                    { 
                                                      return true
                                                    }
                                           });
    }
    return result;
  }

})
