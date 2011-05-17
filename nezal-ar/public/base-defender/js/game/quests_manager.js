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
    this.game = game;
    this.oldQuest = null;
    if($('questScreen') && $('questDisplay').getStyle('display')=='block')
      this.oldQuest = $('questScreen').getAttribute('questId');
    this.displayedNotifications = [];
  },

  renderQuestPanel : function(){
    var quests = this.nextInCategory();
    $('quest-panel').innerHTML = this.game.templatesManager.load("quests-list", {questsList : quests});
  	this.game.addLoadedImagesToDiv('quest-panel');
    $$('#quest-panel .clickable').each( function(button){
                                            var id = button.getAttribute('id');
                                            button.observe( 'click', function(){
																		                                    Sounds.play(Sounds.gameSounds.click)
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
    $('quest-panel').show();
  },

  displayQuest : function(questId){
    if(! this.game.user.data.quests.descriptions[questId] )
      return;
    $('questDisplay').innerHTML = '';
    $('questDisplay').innerHTML = this.game.templatesManager.load("quest", 
                                    {quest: this.game.user.data.quests.descriptions[questId],
                                     questId : questId,
                                     text : Text.quests[questId] || {'conditionMsgs' : {}} });
    this.game.addLoadedImagesToDiv('questDisplay')		
    if($('emptyQuest')) Animation.hide('emptyQuest');
    if($('congratesMsg')) Animation.hide('congratesMsg');
    if($('buildingDisplay')) Animation.hide('buildingDisplay');
    $('interaction').show();
    Animation.show('questDisplay');
  },

  displayCongratesMsg : function(msg){
    if(Text.quests[msg['data']['id']])
      msg.text = Text.quests[msg['data']['id']]['congratesMsg']
    $('msg').innerHTML = this.game.templatesManager.load("congrates", {msg : msg});
  	this.game.addLoadedImagesToDiv('msg')
    if($('emptyQuest')) Animation.hide('emptyQuest');
    if($('questDisplay')) Animation.hide('questDisplay');
    if($('buildingDisplay')) Animation.hide('buildingDisplay');
    $('interaction').show();
    $('msg').show();
    Animation.show('congratesMsg');
    this.displayedNotifications.push(msg['id']);
    this.ackCongratesMsgs(msg['id']);
  },

  displayQuestEmptyMsg : function(category){
    $('msg').innerHTML = '';
    $('msg').innerHTML = this.game.templatesManager.load("empty-quest", 
                    { category: category, msg: this.categoryMsgs[category], msg2: this.categoryMsgs["noQuest"]});
  	this.game.addLoadedImagesToDiv('msg')		
    if($('congratesMsg')) Animation.hide('congratesMsg');
    if($('questDisplay')) Animation.hide('questDisplay');
    if($('buildingDisplay')) Animation.hide('buildingDisplay');		
    $('interaction').show();
    $('msg').show();
    Animation.show('emptyQuest');
  },

  hideQuests : function(){
    if($('quest-panel')) 
    { 
      $('quest-panel').innerHTML = '';
      $('quest-panel').hide();
    }
    if($('msg'))
    {
      $('msg').innerHTML = '';
      $('msg').hide();
    }
    if($('questDisplay'))
    {
      $('questDisplay').innerHTML = '';
      $('questDisplay').hide();
    }
    if($('emptyQuest'))
    {
      $('questDisplay').innerHTML = '';
      $('questDisplay').hide();
    }
  },

  handleQuests : function() {
    /* Handle Quests should check any quests screens to display :
       if there is any quests notifications, display them one by one.
       else, Check for a mandatory Quest and display it.
    */
    this.hideQuests();
    this.renderQuestPanel();
    var self = this;
    var notifications = this.game.user.data.notifications.queue.findAll(function(n) {
                                                                         return n['type'] == 'quest' && self.displayedNotifications.indexOf(n['id'])<0 });
    if( notifications && notifications.length > 0 ) {
			$('interaction').hide();
      this.displayCongratesMsg(notifications.first());
    } else {
      var mandatoryQuest = null;
      mandatoryQuest = this.mandatoryQuest();
      if(mandatoryQuest!=null) {
        this.displayQuest(mandatoryQuest);
        var tutorialHandle = this.game.tutorial[this.game.user.data.quests.descriptions[mandatoryQuest]['name']];
        if(tutorialHandle)
          tutorialHandle.handle();
      }else if(this.oldQuest) {
        this.displayQuest(this.oldQuest);
      }
    }
  },

  /* TODO : make sure it updates status from returned value instead of new request */
  ackCongratesMsgs : function(congratesId){
    this.game.network.notificationAck( congratesId );
//    this.game.reInitialize();
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
