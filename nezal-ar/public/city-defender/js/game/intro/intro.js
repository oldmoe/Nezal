var GameConfigs = {
  level: 0, 
  campaign : 'current',
  missionPath : 'cairo', 
  mapImage : '',
  waves : [],
  map : [], 
  mapEntry : [], 
  towers : [],
  superWeapons : [],
  upgrades : []
}

var Config = GameConfigs;

var PathConfigs = {
  template_path : "templates/intro/"
}

var Intro = {
    dirty : false ,
    currentPage : -1,
    nextPageIndex : 0,
    sequence : [
              "levelSelection",
              "campaign",
              "mission",
              "towers",
              "weapons",
              "upgrades"
            ],
    templates : {
              challenges : [PathConfigs.template_path + "challenges.tpl", 0],
              campaign : [PathConfigs.template_path + "campaign.tpl", 0],
              mission : [PathConfigs.template_path + "mission.tpl", 0],
              towers : [PathConfigs.template_path + "towers.tpl", 0],
              weapons : [PathConfigs.template_path + "super_weapons.tpl", 0],
              upgrades : [PathConfigs.template_path + "upgrades.tpl", 0],
              game : [ "templates/game.tpl", 0 ]
            },
    images : {
        path : "images/intro/" ,
        levelSelection : [
                            "level-selection.png",
                            "difficulty.png"
                        ],    
        campaign : [
                      "campaign/campaign-bg.png"
                  ],
        mission : [
                      "mission/mission-bg.png",
                      "mission/accept.png",
                      "mission/reject.png",
                      "mission/carousel/left.png",
                      "mission/carousel/left-disabled.png",
                      "mission/carousel/right.png",
                      "mission/carousel/right-disabled.png",
                      "mission/float-bg.png",
                      "mission/confidintial-stamp.png"
                  ],
        towers : [
                    "market/towers-on.png",
                    "market/towers-off.png",
                    "market/weapons-on.png",
                    "market/weapons-off.png",
                    "market/upgrades-on.png",  
                    "market/upgrades-off.png",
                    "market/towers-bar.png",
                    "market/towers-bg.png",
                    "market/float-bg.png",
                    "market/q-box.png",
                    "market/hidden-lamp.png",
                    "market/add.png",
                    "market/added.png",
                    "market/unlock.png",
                    "market/shown-lamp.png",
                    "market/locked.png",
                    "market/remove.png",
                    "market/q-mark.png"
                ],
        weapons : [
                    "market/towers-on.png",
                    "market/towers-off.png",
                    "market/weapons-on.png",
                    "market/weapons-off.png",
                    "market/upgrades-on.png",  
                    "market/upgrades-off.png",
                    "market/weapons-bar.png",
                    "market/weapons-bg.png",
                    "market/float-bg.png",
                    "market/q-box.png",
                    "market/hidden-lamp.png",
                    "market/add.png",
                    "market/added.png",
                    "market/unlock.png",
                    "market/shown-lamp.png",
                    "market/locked.png",
                    "market/remove.png",
                    "market/q-mark.png"
                ],
        upgrades : [
                    "market/towers-on.png",
                    "market/towers-off.png",
                    "market/weapons-on.png",
                    "market/weapons-off.png",
                    "market/upgrades-on.png",  
                    "market/upgrades-off.png",
                    "market/upgrades-bar.png",
                    "market/upgrades-bg.png",
                    "market/float-bg.png",
                    "market/q-box.png",
                    "market/hidden-lamp.png",
                    "market/add.png",
                    "market/added.png",
                    "market/unlock.png",
                    "market/shown-lamp.png",
                    "market/locked.png",
                    "market/remove.png",
                    "market/q-mark.png"
                ]
    },

    initialize: function(){
        this.currentPage = -1;
        this.loader = new Loader();
        for(var template in Intro.templates){
            Intro.retrieveTemplates(template);
	      }
    },
    
    retrieveTemplates: function(template){
        new Ajax.Request(Intro.templates[template][0], {method:'get',
	            onSuccess: function(t){
  		      		  Intro.templates[template][1] = TrimPath.parseTemplate(t.responseText);
	  	      		  var size = 0;
	  	      		  var received = 0;
	  	      		  for(var t in Intro.templates) 
	  	      		  {
	    	      		    size += 1;
	    	      		    if( Intro.templates[t][1])
    	    	      		      received++;	      		      
	  	      		  }
		        		  if (received == size)
		        		  {
        		  	      Intro.retrieveData( function() {
        		  	          $("gameStart").innerHTML = Intro.templates['game'][1].source;
						              initLoadImages(new Loader()); 
                          Intro.next();
                      })
                  }
			      }
	      })
    },

    retrieveData: function( callback){
        new Ajax.Request( 'metadata', {method:'get',
              onSuccess: function(t){
                  var data = JSON.parse(t.responseText);
                  Intro.gameData = JSON.parse(data['game_data']['metadata']);
                  Intro.userData = data['user_data'];
                  Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                  callback();
              }
        });
    },
    
    campPath : function() {
        return "challenges/" + GameConfigs.campaign; 
    },
    
    missionPath : function(){
        return "/" + GameConfigs.missionPath;
    },
    
    /* Convert returned hash of objects into an array of it labels 
     * To be sent to the display part
     */
    toLabels : function( hash, labelsHash ) {
        for( i in hash ) 
        {
            labelsHash[i] = [];
            for( j in hash[i]) 
            {
                labelsHash[i].push(hash[i][j]['name']);
            }
        }      
    },
  
    pages : {
        levelSelection : {
            onSelect : function() {
                Intro.loader.load( [ {images : Intro.images.levelSelection, path : Intro.images.path, store: 'intro'} ],
                              { onFinish : Intro.show } );
            }
        },
        campaign : {
            onSelect : function() {
                var images = [];
                var images2 = ["/images/camp-map.png"];
                Intro.images.campaign.each(function(image){ images.push( image) });
                new Ajax.Request( Intro.campPath() + "/camp.info" ,
                            { method:'get', 
                              onSuccess: function(t, json){
                                  ChallengeSelector.campaignInfo = JSON.parse(t.responseText);
                                  new Ajax.Request( GameConfigs.campaign + "/metadata" ,      
                                  {   method:'get', 
                                      onSuccess: function(t, json){
                                          Intro.campaignInfo = JSON.parse(t.responseText);
                                          Intro.campaignInfo.camp_data.metadata.each( function(mission) { 
                                                                        if (Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1])
                                                                            images2.push( "/" + mission['path'] + "/images/mission_active.png");
                                                                        else
                                                                            images2.push( "/" + mission['path'] + "/images/mission_inactive.png");
                                                                    });
                                          Intro.loader.load( [{ images: images, path : Intro.images.path , store: 'intro'},
                                                      { images: images2, path :  Intro.campPath(), store: 'intro'}],
                                                      { onFinish : function() {                                            
                                                            $('campaign').innerHTML = 
                                                                    Intro.templates.campaign[1].process({"camp":ChallengeSelector.campaignInfo}); 
                                                            Intro.show();
                                                    } }); // End of load
                                    }
                                  });
                              }
                            });
            }
        },
        mission : {
            onSelect : function(){
                Intro.setupGameConfigs();
                var creepInfo = [];
                GameConfigs['waves'].each( function(element) { 
                                    for( var i =0; i< element.length; i++ )
                                    {
                                        creepInfo = creepInfo.concat([element[i]['category']]);
                                    }
                                })
                ChallengeSelector.missionCreeps = creepInfo.uniq();
                new Ajax.Request( Intro.campPath() + Intro.missionPath() + "/mission.info" ,
                    {method:'get', 
                      onComplete: function(t, json){
                          ChallengeSelector.mission = JSON.parse(t.responseText);
                          ChallengeSelector.mission.creeps = ChallengeSelector.missionCreeps;
                          var images = [], images2 = [];
                          var path2 = Intro.images.path + "creeps/";
                          Intro.images.mission.each(function(image){ images.push(image) });
                          images.push( "../../" + Intro.campPath() + Intro.missionPath() + "/images/city.png");
                          images.push( "../../" + Intro.campPath() + Intro.missionPath() + "/images/map.png");   
                          ChallengeSelector.mission.creeps.each( function(creep){
                                                                     images2.push(CreepConfig[creep]['image']);
                                                                     images2.push(CreepConfig[creep]['skeleton']);  
                                                                  } );
                          Intro.loader.load( [{ images: images, path : Intro.images.path, store: 'intro'}, 
                                              { images: images2, path : path2, store: 'intro'}],
                                        { onFinish : function() {
                                                 $('mission').innerHTML = Intro.templates.mission[1].process({ 
                                                                        "city" : ChallengeSelector.mission,
                                                                        "path" : Intro.campPath() + Intro.missionPath(),
                                                                        "creepConfig" : CreepConfig }); 
                                                 Intro.creepsCarousel = new Carousel("creeps-scroll");
                                                 Intro.creepsCarousel.displayCount = 4;
                                                 Intro.show();
                                            } });
          	          }
	                });
            },
            setFloatBgInfo : function(element){
                  $$("#mission #floatBg div span")[0].innerHTML = CreepConfig[element.getAttribute("creepid")].name;
                  $$("#mission #floatBg div span")[1].innerHTML = CreepConfig[element.getAttribute("creepid")].desc;  
                  $$("#mission #floatBg .skeleton img")[0].src = Intro.images.path + "creeps/" + 
                                                                  CreepConfig[element.getAttribute("creepid")].skeleton;    
            }
        }, 
        towers : {
            index : 3,
            emptySpots : 10,
            onSelect : function(){
                /* Get User Data : coins, unlocked towers, super weapons & upgrade
                   Also should contain User last used tower, weapon set 
                   TODO replace this with Ajax  call to get the data */
                var gameData = [];
                Intro.toLabels( Intro.gameData, gameData)
                data = { "gameData" : gameData,
                         "userData" : Intro.userData
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["towers"] = $A($R(0, 9-data["gameData"]["towers"].length-1));
                data["userData"]["empty"]["towers"] = $A($R(0, 10-data.userData.metadata.added['towers'].length-1)); 
                var images =  [], images2 = [];
                Intro.images.towers.each(function(image){ images.push(image) });  
                for (var tower in TowerConfig)
                {
                    images2.push( TowerConfig[tower]['image']);
                    images2.push( TowerConfig[tower]['smallImage']);
                    images2.push( TowerConfig[tower]['skeleton']);    
                }    
                var path2 = Intro.images.path + "towers/";
                Intro.loader.load( [{ images: images, path :  Intro.images.path, store: 'intro'},
                              { images: images2, path :  path2, store: 'intro'}],
                              { onFinish : function() {
                                      $('towers').innerHTML = Intro.templates.towers[1].process({ 
                                                                        "type" : "towers",
                                                                        "data" : data,
                                                                        "itemConfig" : TowerConfig });
                                      /* Change the tabs accordingly */
                                      path = "images/intro/market/";
                                      $$("#marketPlace #towersTab img")[0].addClassName('on');
                                      $$("#marketPlace #towersTab img")[0].src = path + "towers-on.png";
                                      $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                                      $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-off.png";
                                      $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                                      $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-off.png";
                                      $$("#marketPlace #bar img")[0].src = path + "towers-bar.png";  
                                      Intro.show();
                                      $('marketPlace').show();
                                  }} );
            },
            setFloatBgInfo : function(element){
                  $$("#marketPlace #floatBg div span")[0].innerHTML = TowerConfig[element.getAttribute("itemid")].model + " " +
                                                                   TowerConfig[element.getAttribute("itemid")].name + " : ";
                  $$("#marketPlace #floatBg div span")[1].innerHTML = TowerConfig[element.getAttribute("itemid")].desc;
                  $$("#marketPlace #floatBg div img")[0].src = Intro.images.path + "towers/" + 
                                                                  TowerConfig[element.getAttribute("itemid")].skeleton;    
            }
        },
        weapons : {
            index : 4,
            emptySpots : 5,
            onSelect : function(){
                /* Get User Data : coins, unlocked towers, super weapons & upgrade
                   Also should contain User last used tower, weapon set 
                   TODO replace this with Ajax  call to get the data */
                var gameData = [];
                Intro.toLabels( Intro.gameData, gameData)
                data = { "gameData" : gameData,
                         "userData" : Intro.userData
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["weapons"] = $A($R(0, 9-data["gameData"]["weapons"].length-1)); 
                data["userData"]["empty"]["weapons"] = $A($R(0, 5-data.userData.metadata.added['weapons'].length-1)); 
                var images =  [], images2 = [];
                Intro.images.weapons.each(function(image){ images.push(image) });  
                for (var weapon in SuperWeaponConfig)
                {
                    images2.push( SuperWeaponConfig[weapon]['image']);  
                }    
                Intro.loader.load( [{ images: images, path : Intro.images.path, store: 'intro'},
                              { images : images2, path : Intro.images.path + "weapons/", store : 'intro' }],
                              { onFinish : function() {
                                      $('weapons').innerHTML = Intro.templates.weapons[1].process({ 
                                                                        "type" : "weapons",
                                                                        "data" : data,
                                                                        "itemConfig" : SuperWeaponConfig });
                                      /* Change the tabs accordingly */
                                      path = "images/intro/market/";
                                      $$("#marketPlace #weaponsTab img")[0].addClassName('on');
                                      $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-on.png";
                                      $$("#marketPlace #towersTab img")[0].removeClassName('on');
                                      $$("#marketPlace #towersTab img")[0].src = path + "towers-off.png";
                                      $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                                      $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-off.png";  
                                      $$("#marketPlace #bar img")[0].src = path + "weapons-bar.png";  
                                      Intro.show();
                                      $('marketPlace').show();
                              }});

            },
            setFloatBgInfo : function(element){
                  $$("#marketPlace #weapons #floatBg div span")[0].innerHTML = SuperWeaponConfig[element.getAttribute("itemid")].name  + " : " ;
                  $$("#marketPlace #weapons #floatBg div span")[1].innerHTML = SuperWeaponConfig[element.getAttribute("itemid")].desc;
                  $$("#marketPlace #weapons #floatBg div img")[0].src = Intro.images.path + "weapons/" + 
                                                                  SuperWeaponConfig[element.getAttribute("itemid")].skeleton;    
            }
        },
        upgrades : {
            index : 5,
            emptySpots : 5,
            onSelect : function(){
                var gameData = [];
                Intro.toLabels( Intro.gameData, gameData)
                data = { "gameData" : gameData,
                         "userData" : Intro.userData
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["upgrades"] = $A($R(0, 9-data["gameData"]["upgrades"].length-1));
                data["userData"]["empty"]["upgrades"] = $A($R(0, 5-data.userData.metadata.added['upgrades'].length-1)); 
                var images =  [];
                var images2 = [];
                Intro.images.upgrades.each( function(image){ images.push( image) });  
                for (var upgrade in UpgradeConfig)
                {
                    images2.push( UpgradeConfig[upgrade]['image']);
                }    
                Intro.loader.load( [{ images: images, path : Intro.images.path, store: 'intro'},
                              { images: images2, path : Intro.images.path + "upgrades/", store: 'intro'}],
                              { onFinish : function() {
                                      $('upgrades').innerHTML = Intro.templates.upgrades[1].process({ 
                                                                        "type" : "upgrades",
                                                                        "data" : data,
                                                                        "itemConfig" : UpgradeConfig });
                                      /* Change the tabs accordingly */ 
                                      path = "images/intro/market/";
                                      $$("#marketPlace #upgradesTab img")[0].addClassName('on');
                                      $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-on.png";  
                                      $$("#marketPlace #towersTab img")[0].removeClassName('on');
                                      $$("#marketPlace #towersTab img")[0].src = path + "towers-off.png";
                                      $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                                      $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-off.png";
                                      $$("#marketPlace #bar img")[0].src = path + "upgrades-bar.png";  
                                      Intro.show();
                                      $('marketPlace').show();
                                  }} );
            },
            setFloatBgInfo : function(element){
                  $$("#marketPlace #upgrades #floatBg div span")[0].innerHTML = UpgradeConfig[element.getAttribute("itemid")].name  + " : ";
                  $$("#marketPlace #upgrades #floatBg div span")[1].innerHTML = UpgradeConfig[element.getAttribute("itemid")].desc;
                  $$("#marketPlace #upgrades #floatBg div img")[0].src = Intro.images.path + "upgrades/" + 
                                                                  UpgradeConfig[element.getAttribute("itemid")].skeleton;
            }
        }
    },
    
    selectMission : function(element){
      GameConfigs.missionPath = element.getAttribute('path');
    },
    
    addItem: function(element){
        Intro.dirty = true;
        var gameData = [];
        Intro.toLabels( Intro.gameData, gameData);
        var type = element.getAttribute('type');
        Intro.userData.metadata.added[type].push(element.getAttribute('itemid'));
        var itemConfig = TowerConfig;
        if(type == "weapons")
            itemConfig = SuperWeaponConfig;
        else if (type == "upgrades")
             itemConfig = UpgradeConfig;
       data = { "gameData" : gameData,
                "userData" : Intro.userData
                    };
        var emptySpots = Intro.pages[type].emptySpots;
        data["gameData"]["empty"] = {};
        data["userData"]["empty"] = {};
        data["gameData"]["empty"][type] = $A($R(0, 9-data["gameData"][type].length-1));
        data["userData"]["empty"][type] = $A($R(0, emptySpots-data.userData.metadata.added[type].length-1)); 
        $(type).innerHTML = Intro.templates[type][1].process({ 
                                                                  "type" : type,
                                                                  "data" : data,
                                                                  "itemConfig" : itemConfig });
    },
    
    removeItem: function(element){
        Intro.dirty = true;
        var type = element.getAttribute('type');
        Intro.userData.metadata.added[type].splice( Intro.userData.metadata.added[type].indexOf(element.getAttribute('itemid')), 1);
        var gameData = [];
        var itemConfig = TowerConfig; 
        Intro.toLabels( Intro.gameData, gameData);
        if(type == "weapons")
            itemConfig = SuperWeaponConfig;
        else if (type == "upgrades")
             itemConfig = UpgradeConfig;
        data = { "gameData" : gameData,
                 "userData" : Intro.userData
              };
        var emptySpots = Intro.pages[type].emptySpots;
        data["gameData"]["empty"] = {};
        data["userData"]["empty"] = {};
        data["gameData"]["empty"][type] = $A($R(0, 9-data["gameData"][type].length-1));
        data["userData"]["empty"][type] = $A($R(0, emptySpots-data.userData.metadata.added[type].length-1)); 
        $(type).innerHTML = Intro.templates[type][1].process({ 
                                                                  "type" : type,
                                                                  "data" : data,
                                                                  "itemConfig" : itemConfig });        
    },
    
    unlockItem: function(element){
        var type = element.getAttribute('type');
        var itemid = element.getAttribute('itemid');
        if ( Intro.userData.coins >= parseInt(Intro.gameData[type][itemid]['cost']) &&
               Intro.userData.exp >= parseInt(Intro.gameData[type][itemid]['exp'])) 
        {
            Intro.enablePauseScreen();
            new Ajax.Request( 'metadata',
                        {   method:'post', 
                            parameters: { 'type' : 'game_profile', 'data' : Object.toJSON({ 'type' : type, 'item_id' : itemid, 'event': 'unlock' }) },
                            onSuccess : function(t, json){
                                var data = JSON.parse(t.responseText);
                                var addedItems = Intro.userData["metadata"]['added'];
                                Intro.gameData = JSON.parse(data['game_data']['metadata']);
                                Intro.userData = data['user_data'];
                                Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                                Intro.userData["metadata"]['added'] = addedItems;
                                Intro.select(Intro.pages[type]['index']);
                                Intro.disablePauseScreen();
                            }
                        });
        }else{
            alert(" u r either missing coins or experience points");
        }
    },
    
    saveUserSetup : function(callback) {
        new Ajax.Request( 'metadata',
              {   method:'post', 
                  parameters: { 'type' : 'game_profile', 'data' : Object.toJSON({'setup' : Intro.userData.metadata.added, 'event': 'user_setup' }) },
                  onSuccess : function(t, json){
                      var data = JSON.parse(t.responseText);
                      Intro.gameData = JSON.parse(data['game_data']['metadata']);
                      Intro.userData = data['user_data'];
                      Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                      Intro.dirty = false;
                      callback();
                  }
              });
    },
    
    setupGameConfigs : function(){
        var missions = Intro.campaignInfo.camp_data.metadata
        var mission = missions.find(function(mission){ if ( GameConfigs.missionPath == mission['path'] ) return true; })
        GameConfigs.map = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['map'];
        GameConfigs.mapEntry = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['mapEntry'];
        GameConfigs.mapImage = "../../" + Intro.campPath() + Intro.missionPath() + "/images/path.png";
        GameConfigs.waves = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['waves'];
        GameConfigs.towers = Intro.userData.metadata.added.towers;
        GameConfigs.superWeapons = Intro.userData.metadata.added.weapons;
        GameConfigs.upgrades = Intro.userData.metadata.added.upgrades;
    },
    
    enablePauseScreen : function() {
        $('pause').show()
    },
    
    disablePauseScreen : function() {
        $('pause').hide()
    },
    
    show: function(){
        Intro.disablePauseScreen();
        $('marketPlace').hide();
	      if(	Intro.currentPage >= 0) {
          $(Intro.sequence[Intro.currentPage]).hide();
        }
	      Intro.currentPage = Intro.nextPageIndex;
        $(Intro.sequence[Intro.currentPage]).style['display'] = "block"; //show();    
        $("intro").style['cursor'] = 'auto';
    },
    
    showFloatBg : function(element){
        Intro.pages[Intro.sequence[Intro.currentPage]].setFloatBgInfo(element);
        $$("#" + Intro.sequence[Intro.currentPage]  + " #" + "floatBg")[0].show();
    },
    
    hideFloatBg : function(){
        $$("#" + Intro.sequence[Intro.currentPage]  + " #" + "floatBg")[0].hide();
    },

	  next: function(current){
        Intro.enablePauseScreen();
        Intro.nextPageIndex = Intro.currentPage + 1;
        var callback = function() {
                                    if(Intro.nextPageIndex == Intro.sequence.length )
                                        Intro.finish();
                                    else
                                        Intro.pages[Intro.sequence[Intro.currentPage + 1]].onSelect();
                                }
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else
            callback();
	  },
	  
	  previous: function(current){
        Intro.enablePauseScreen();
        Intro.nextPageIndex = Intro.currentPage - 1;
        var callback = function() { Intro.pages[Intro.sequence[Intro.currentPage - 1]].onSelect(); } 
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else
            callback();
	  },
	  
	  select: function(index){
        Intro.enablePauseScreen();
        Intro.nextPageIndex = index;
        $("intro").style['curspr'] = 'progress';
        var callback = function() { Intro.pages[Intro.sequence[index]].onSelect(); }
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else
            callback();
	  },
	  
	  finish: function(){
	      Intro.setupGameConfigs();
        var callback = function() {
                                        city_defender_start();
	                                      $('gameStart').show();
	                                      $("intro").hide();
                                  }
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else
            callback();
	  }
	
}
