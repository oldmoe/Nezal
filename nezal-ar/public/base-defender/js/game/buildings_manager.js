var BuildingsManager = Class.create({

  currentShift : 0,

  maxShift : 5 ,

  initialize : function(game){
    this.game = game
    this.displayBuildButton(function(){
      game.buildingsManager.displayBuildingsPanel({'disabled' : []});
  	  Sounds.play(Sounds.gameSounds.click);
    })
  },

  /*
   * Params will include : hash { 'disable', 'listeners'}
      - disabled list : disables clicks on items named in disbaled array.
      - listeners : hash of listeners to attach to certain items.
   */
  displayBuildingsPanel : function(params){
    var buildings = {};
    for ( var i in this.game.data.buildings) {
      buildings[i] = this.game.data.buildings[i]['levels'][1];
      buildings[i]['defense'] = this.game.data.buildings[i]['defense'];
    }
    $('buildingDisplay').innerHTML = this.game.templatesManager.load("buildings-panel", {'buildings' : buildings});
  	this.game.addLoadedImagesToDiv('buildingDisplay')
    var disabled = params['disabled'] || [];
//    disabled.each(function(item){
//                      $$('#buildingsPanel #' + item + ' .itemData')[0].onclick=function(){}
//                      $$('#buildingsPanel #' + item + ' .background')[0].src=Loader.images.quests['inactiveCell.png'].src;
//                      $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
//                  });

    this.buildingLeftArrowClickEvent();
    this.buildingrightArrowClickEvent();
    
    Animation.hide('questDisplay');
    Animation.show('buildingDisplay');
    $('interaction').show();
  },
  
  buildingLeftArrowClickEvent : function(){
    var self = this;
    $("leftArrow").stopObserving("click");
    $("leftArrow").observe("click", function(){
      if(self.currentShift != 0) {
        self.currentShift -= 5;
        $$('#interaction .buildings')[0].setStyle({marginLeft : (self.currentShift*-84) + 'px' })
        $$('#rightArrow img')[0].setStyle({marginLeft : '-90px'});
        if(self.currentShift == 0)
          $$('#leftArrow img')[0].setStyle({marginLeft : '0'});
      }
    });
  },
  
  buildingrightArrowClickEvent : function(){
    var self = this;
    $("rightArrow").stopObserving("click");
    $("rightArrow").observe("click", function(){
      if(self.currentShift < self.maxShift) { 
        self.currentShift += 5;
        $$('#interaction .buildings')[0].setStyle({marginLeft : (self.currentShift*-84) + 'px' });
        $$('#leftArrow img')[0].setStyle({marginLeft : '-60px'});
        if(self.currentShift == self.maxShift)
          $$('#rightArrow img')[0].setStyle({marginLeft : '-30px'});
      }
    });
  },

  /*
   * Params will include : The param list to be passed on to displayBuildingsPanel
   */
  displayBuildButton : function(onclick){
    $('buildButton').stopObserving(game.mouseClickEvent);
    $('buildButton').observe(game.mouseClickEvent, onclick);
    $('buildButton').show();
  },
  
  build : function(building){
    this.game.buildingMode.on(this.game[building.dasherize().camelize() + 'Factory'].newBuilding(), function(){});
  },

  displayDefenseTab : function(){
    $$(".buildingsBg")[0].setStyle({zIndex:0});
    $$(".wedgesBg")[0].setStyle({zIndex:10});
    $("buildingsPanel").setStyle({zIndex:11});
    $("buildingsTrigger").removeClassName('activeTrigger');
    $("buildingsTrigger").addClassName('inactiveTrigger');
    $("defenseTrigger").removeClassName('inactiveTrigger');
    $("defenseTrigger").addClassName('activeTrigger');
    $$("#buildingsPanel #buildings")[0].hide();
    $$("#buildingsPanel #defense")[0].show();
  },

  displayBuildingsTab : function(){
    $$(".buildingsBg")[0].setStyle({zIndex:10});
    $$(".wedgesBg")[0].setStyle({zIndex:0});
    $("buildingsPanel").setStyle({zIndex:11});
    $("defenseTrigger").removeClassName('activeTrigger');
    $("defenseTrigger").addClassName('inactiveTrigger');
    $("buildingsTrigger").removeClassName('inactiveTrigger');
    $("buildingsTrigger").addClassName('activeTrigger');
    $$("#buildingsPanel #defense")[0].hide();
    $$("#buildingsPanel #buildings")[0].show();
  }

})

