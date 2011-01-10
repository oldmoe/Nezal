var Tutorial = Class.create({
  game : null,

  inProgress : [],
  
  initialize : function(game){
    this.game = game;
    var self = this;    
    $('hand').hide();
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

  townhall : {
    self : this,
    handle : function() {
      this.level();
    },
    level : function() {  
      var self = this.self.game.tutorial;
      var buildButtonCallBack = function(){
                                    Hand.hide();
                                    $('questDisplay').hide();
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : ['quarry', 'lumbermill']});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #townhall .itemData')[0].observe('click', function(){$('hand').hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #townhall .itemData')[0], 'rotated' : false });
                                    } , 500);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(self.game, { 'object' : $$('.buildButton .okButton')[0], 'rotated' : false});
    }
  },

  workers : {
    self : this,
    handle : function() {
      this.workers();
    },
    workers : function() { 
      Hand.point(this.self.game, { 'object' : $('workers_game_element'), 'rotated' : true });
      var self = this.self.game.tutorial;
      $('workers_game_element').observe('click', 
                                              function(){
                                                Hand.hide();
                                              });
    }
  },

  quarry : {
    self : this,
    handle : function() {
      var status = this.self.game.user.data.quests.descriptions[this.self.game.questsManager.mandatoryQuest()]['status']['buildings']['quarry'];
      for( var i in status)
      {
        if(status[i]['status'] < 0)
        {
          this[i](status[i]['id']);
          break;
        }
      }
    },
    level : function(id) { 
      var self = this.self.game.tutorial;
      var buildButtonCallBack = function(){
                                    Hand.hide();
                                    $('questDisplay').hide();
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : ['townhall', 'lumbermill']});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #quarry .itemData')[0].observe('click', function(){$('hand').hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #quarry .itemData')[0], 'rotated' : false });
                                    } , 200);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(this.self.game, { 'object' : $$('.buildButton .okButton')[0], 'rotated' : false });
    },
    assigned_workers : function(id){
      Hand.point(this.self.game, { 'object' : this.self.game.quarryFactory.factoryRegistry[id].sprites.building.div, 'rotated' : false });
    }
  },

  lumbermill : {
    self : this,
    handle : function() {
      var status = this.self.game.user.data.quests.descriptions[this.self.game.questsManager.mandatoryQuest()]['status']['buildings']['lumbermill'];
      for( var i in status)
      {
        if(status[i]['status'] < 0)
        {
          this[i](status[i]['id']);
          break;
        }
      }
    },
    level : function(id) { 
      var self = this.self.game.tutorial;
      var buildButtonCallBack = function(){
                                    Hand.hide();
                                    $('questDisplay').hide();
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : ['quarry', 'townhall']});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #lumbermill .itemData')[0].observe('click', function(){$('hand').hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #lumbermill .itemData')[0], 'rotated' : false });
                                    } , 200);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(this.self.game, { 'object' : $$('.buildButton .okButton')[0], 'rotated' : false});
    },
    assigned_workers : function(id){
      Hand.point(this.self.game, { 'object' : this.self.game.lumbermillFactory.factoryRegistry[id].sprites.building.div, 'rotated' : false });
    }
  }

});
