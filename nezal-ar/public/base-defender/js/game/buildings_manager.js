var BuildingsManager = Class.create({

  images : {
              'left' : 'images/quests/arrows_horizontal.png',
              'left-disabled' : 'images/quests/arrows_horizontal.png',
              'right' : 'images/quests/arrows_horizontal.png',
              'right-disabled' :'images/quests/arrows_horizontal.png'
            },

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
    $('buildingDisplay').innerHTML = this.game.templatesManager.load("buildings-panel", {'buildings' : buildings, 'disabled' : params['disabled']});

    if(this.buildingsCarousel)
      this.buildingsCarousel.destroy();      
    if(this.defenseCarousel)
      this.defenseCarousel.destroy();
    this.defenseCarousel = new Carousel("defense", this.images, 5);
    this.buildingsCarousel = new Carousel("buildings", this.images, 5);
    this.defenseCarousel.checkButtons();
    this.buildingsCarousel.checkButtons();
    var disabled = params['disabled'] || [];
    disabled.each(function(item){
                      $$('#buildingsPanel #' + item + ' .itemData')[0].onclick=function(){}
                      $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
                      $$('#buildingsPanel #' + item + ' span')[0].setAttribute('imgSrc', 'images/quests/'+item+'_info_dimmed.png');
                  });
   this.game.addLoadedImagesToDiv('buildingDisplay');
    Animation.hide('questDisplay');
    Animation.show('buildingDisplay');
    $('interaction').show();
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


