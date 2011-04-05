var BuildingsManager = Class.create({

  initialize : function(game){
    this.game = game
    this.displayBuildButton(function(){
      game.buildingsManager.displayBuildingsPanel({'disabled' : []});
	  Sounds.play(Sounds.gameSounds.click)
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
    }
    $('buildingDisplay').innerHTML = this.game.templatesManager.buildingsPanel(buildings);
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
    $("leftArrow").stopObserving("click");
    $("leftArrow").observe("click", function(){
      if(currentShift != 0) {
        currentShift -= 2;
        $$('#interaction .buildings')[0].setStyle({marginLeft : (currentShift*-84) + 'px' })
        $$('#rightArrow img')[0].setStyle({marginLeft : '-90px'});
        if(currentShift == 0)
          $$('#leftArrow img')[0].setStyle({marginLeft : '0'});
      }
    });
  },
  
  buildingrightArrowClickEvent : function(){
    $("rightArrow").stopObserving("click");
    $("rightArrow").observe("click", function(){
      if(currentShift < maxShift) { 
        currentShift += 3;
        $$('#interaction .buildings')[0].setStyle({marginLeft : (currentShift*-84) + 'px' });
        $$('#leftArrow img')[0].setStyle({marginLeft : '-60px'});
        if(currentShift == maxShift)
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
  }

})
