var BuildingsManager = Class.create({

  initialize : function(game){
    this.game = game
    this.displayBuildButton(function(){
      game.buildingsManager.displayBuildingsPanel({'disabled' : []});
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
    disabled.each(function(item){
                      $$('#buildingsPanel #' + item + ' .itemData')[0].onclick=function(){}
                      $$('#buildingsPanel #' + item + ' .background')[0].src=Loader.images.quests['inactiveCell.png'].src;
                      $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
                  });
    $('buildingDisplay').show();
    $('interaction').show();
  },

  /*
   * Params will include : The param list to be passed on to displayBuildingsPanel
   */
  displayBuildButton : function(onclick){
    $('buildButton').stopObserving('click');
    $('buildButton').observe('click', onclick);
    $('buildButton').show();
  },
  
  build : function(building){
    this.game.buildingMode.on(this.game[building + 'Factory'].newBuilding(), function(){});
  }

})
