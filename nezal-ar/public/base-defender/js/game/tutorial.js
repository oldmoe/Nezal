var Tutorial = Class.create({
  game : null,

  inProgress : [],
  
  initialize : function(game){
    this.game = game;
    var self = this;    
    $('hand').hide();
  },

  fire : function(){
  	var self = this
    if (this.game.user.newbie) {
      $('buildButton').hide();
      if(!this.game.townhallFactory.townhall){
        serviceProvider.getUserInfo(function(){
                                      $('msg').innerHTML = this.game.templatesManager.load("welcome", 
                                                                {userName : serviceProvider.user['first_name']});
										self.game.addLoadedImagesToDiv('msg')						
                                      $('interaction').show();
                                      $('msg').show();  
                                      Animation.show('welcomeMsg');
                                    });
      }else {
        $('buildButton').show();
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
                                    var disabled =  BuildingFactory.prototype.buildings.clone();
                                    disabled.remove('townhall');
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : disabled});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #townhall .itemData')[0].observe(game.mouseClickEvent, function(){Hand.hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #townhall .itemData')[0], 'rotated' : false });
                                    } , 500);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(self.game, { 'object' : $('buildButton'), 'rotated' : false});
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
      $('workers_game_element').observe(game.mouseClickEvent, 
                                        function(){
                                          Animation.hide('questDisplay');
                                          Hand.hide();
                                          Hand.point(self.game, { 'object' : $('hire-worker-button'), 'rotated' : true });
                                          $('hire-worker-button').observe(game.mouseClickEvent, function(){
                                            Hand.hide();
                                          });
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
                                    var disabled =  BuildingFactory.prototype.buildings.clone();
                                    disabled.remove('quarry');
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : disabled});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #quarry .itemData')[0].observe(game.mouseClickEvent, function(){Hand.hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #quarry .itemData')[0], 'rotated' : false });
                                    } , 500);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(this.self.game, { 'object' : $('buildButton'), 'rotated' : false });
    },
    assigned_workers : function(id){
      var self = this.self.game.tutorial;
      var id = id;
      $$('#questDisplay .okButton')[0].observe(game.mouseClickEvent, function(){
            Hand.point(self.game, { 'object' : self.game.quarryFactory.factoryRegistry[id].sprites.building.div, 'rotated' : false });
            $$('#questDisplay .okButton')[0].stopObserving('click');
       });
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
                                    var disabled =  BuildingFactory.prototype.buildings.clone();
                                    disabled.remove('lumbermill');
                                    self.game.buildingsManager.displayBuildingsPanel({'disabled' : disabled});
                                    setTimeout(function(){
                                        $$('#buildingsPanel #lumbermill .itemData')[0].observe(game.mouseClickEvent, function(){Hand.hide()});
                                        Hand.point(self.game, { 'object' : $$('#buildingsPanel #lumbermill .itemData')[0], 'rotated' : false });
                                    } , 500);
                                 };
      this.self.game.buildingsManager.displayBuildButton(buildButtonCallBack);
      Hand.point(this.self.game, { 'object' : $('buildButton'), 'rotated' : false});
    },
    assigned_workers : function(id){
      var self = this.self.game.tutorial;
      var id = id;
      $$('#questDisplay .okButton')[0].observe(game.mouseClickEvent, function(){
            Hand.point(self.game, { 'object' : self.game.lumbermillFactory.factoryRegistry[id].sprites.building.div, 'rotated' : false });
            $$('#questDisplay .okButton')[0].stopObserving('click');
       });
    }
  }

});
