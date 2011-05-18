var BuildingsManager = Class.create({

  images : {
              'left' : 'images/quests/arrows_horizontal.png',
              'left-disabled' : 'images/quests/arrows_horizontal.png',
              'right' : 'images/quests/arrows_horizontal.png',
              'right-disabled' :'images/quests/arrows_horizontal.png'
            },

  initialize : function(game){
    this.game = game;
    if(this.game.reInitializationNotifications)
    {
      if($('buildingDisplay').getStyle("display") == "block")
      {
        this.game.reInitializationNotifications.push(function(){
                                                      if($('questDisplay').getStyle("display") == 'none' &&          
                                                          $('msg').getStyle("display") == 'none')
                                                        $('buildingDisplay').show();
                                                    })
      } 
    }
    this.displayBuildButton(function(){
      game.buildingsManager.displayBuildingsPanel({'disabled' : []});
      Sounds.play(Sounds.gameSounds.click);
    });
  },

  destroy : function(){
    if(this.buildingsCarousel)
      this.buildingsCarousel.destroy();      
    if(this.defenseCarousel)
      this.defenseCarousel.destroy();
  },

  /*
   Params will include : hash { 'disable', 'listeners'}
    - disabled list : disables clicks on items named in disbaled array.
    - listeners : hash of listeners to attach to certain items.
  */
  displayBuildingsPanel : function(params){
    this.destroy();
    var buildings = {};
    var disabled = [];
    for ( var i in this.game.data.buildings) {
      if(this.game[i.dasherize().camelize() + 'Factory'].isDependenciesMet(1).valid)
      {
        buildings[i] = this.game.data.buildings[i]['levels'][1];
        buildings[i]['defense'] = this.game.data.buildings[i]['defense'];
      }
    }
    for ( var i in buildings) {
      var valid = this.game[i.dasherize().camelize() + 'Factory'].hasEnoughResources(1);
      if(!valid.valid)
      {
        buildings[i]['msg'] = valid.msg;
        disabled.push(i);
      }
    }
    disabled = (params['disabled'] || []).concat(disabled);
    $('buildingDisplay').innerHTML = this.game.templatesManager.load("buildings-panel", {'buildings' : buildings, 'disabled' : disabled});
    this.defenseCarousel = new Carousel("defense", this.images, 5);
    this.buildingsCarousel = new Carousel("buildings", this.images, 5);
    this.defenseCarousel.checkButtons();
    this.buildingsCarousel.checkButtons();
    disabled.each(function(item){
                      if($$('#buildingsPanel #' + item)[0])
                      {
                        $$('#buildingsPanel #' + item + ' .itemData')[0].onclick=function(){}
                        $$('#buildingsPanel #' + item + ' .itemData')[0].setStyle({cursor : 'default' });
                        $$('#buildingsPanel #' + item + ' span')[0].setAttribute('imgSrc', 'images/quests/'+item+'_info_dimmed.png');
                      }
                  });
   this.game.addLoadedImagesToDiv('buildingDisplay');
    if($('questDisplay')) Animation.hide('questDisplay');
    if($('congratesMsg')) Animation.hide('congratesMsg');
    if($('rewardsContainer')) Animation.hide('rewardsContainer');
    $('interaction').show();
    Animation.show('buildingDisplay');
  },
  
  /*
  * Params will include : The param list to be passed on to displayBuildingsPanel
  */
  displayBuildButton : function(onclick){
    $('buildButton').stopObserving(game.mouseClickEvent);
    $('buildButton').observe(game.mouseClickEvent, onclick);
    $('buildButton').show();
  },

  hideBuildControls : function(){
    if($('buildButton'))
    {
      $('buildButton').hide();
      $('buildButton').stopObserving(game.mouseClickEvent);
    }
    if($('buildingDisplay'))
    {
      $('buildingDisplay').innerHTML = '';
      $('buildingDisplay').hide();
    }
  },
  
  build : function(building){
    this.game.buildingMode.on(this.game[building.dasherize().camelize() + 'Factory'].newBuilding(), function(){});
  },

  displayDefenseTab : function(){
    $$(".buildingsBg")[0].setStyle({zIndex:0});
    $$(".wedgesBg")[0].setStyle({zIndex:10});
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
    $("defenseTrigger").removeClassName('activeTrigger');
    $("defenseTrigger").addClassName('inactiveTrigger');
    $("buildingsTrigger").removeClassName('inactiveTrigger');
    $("buildingsTrigger").addClassName('activeTrigger');
    $$("#buildingsPanel #defense")[0].hide();
    $$("#buildingsPanel #buildings")[0].show();
  }

})


