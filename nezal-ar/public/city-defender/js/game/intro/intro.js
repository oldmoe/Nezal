var GameConfigs = {
  level: 0, 
  campaign : 'tunisia',
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
  introTemplate : "templates/intro/intro.tpl",
  gameTemplate : "templates/game.tpl"
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
              challenges : [ "challengesTemplate", 0],
              campaign : [ "campaignTemplate", 0],
              mission : [ "missionTemplate", 0],
              towers : [ "marketItemsTemplate", 0],
              weapons : [ "marketItemsTemplate", 0],
              upgrades : [ "marketItemsTemplate", 0],
              marketplaceItem : [ "marketItemDetailsTemplate", 0]
            },
    images : {
        path : "images/intro/" ,
        
        ranks : [ 'ranks/1stLt.png','ranks/1stSgt.png','ranks/2ndLt.png','ranks/BGen.png','ranks/Capt.png',
                  'ranks/Col.png','ranks/Cpl.png','ranks/Gen.png','ranks/GySgt.png','ranks/LCpl.png',
                  'ranks/LtCol.png','ranks/LtGen.png','ranks/MajGen.png','ranks/Maj.png','ranks/MGySgt.png',
                  'ranks/MSgt.png','ranks/PVT.png','ranks/SgtMaj.png','ranks/Sgt.png','ranks/SSgt.png'
        ],
        
        inProgress : [
                        'loading.png',
                        'loading-text.png',
                        'loading-bar.gif'
                    ],
        
        levelSelection : [
                            "level-selection.png",
                            "difficulty.png"
                        ],    
        campaign : [
                      "back.png",
                      "campaign/campaign-bg.png"
                  ],
        mission : [
                      "mission/mission-bg.png",
                      "mission/accept.png",
                      "mission/carousel/left.png",
                      "mission/carousel/left-disabled.png",
                      "mission/carousel/right.png",
                      "mission/carousel/right-disabled.png",
                      "mission/float-bg.png",
                      "mission/confidintial-stamp.png"
                  ],
        towers : [
                    "market/tab-on.png",
                    "market/tab-off.png",
                    "market/background.png",
                    "market/added-towers.png",
                    "market/float-bg.png",
                    "market/q-box.png",
                    "market/hidden-lamp.png",
                    "market/add.png",
                    "market/added.png",
                    "market/unlock.png",
                    "market/shown-lamp.png",
                    "market/locked.png",
                    "market/remove.png",
                    "market/q-mark.png",
                    "market/coin.png",
                    "market/money.png"
                ],
        weapons : [
                    "market/tab-on.png",
                    "market/tab-off.png",
                    "market/background.png",
                    "market/added-items.png",
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
                    "market/tab-on.png",
                    "market/tab-off.png",
                    "market/background.png",
                    "market/added-items.png",
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
        var callback = function(){
            Intro.enablePauseScreen();
            var images =  [];
            var images2 =  []; 
            ['ranks', 'towers', 'weapons', 'upgrades'].each(function(item){
                                                    Intro.images[item].each(function(image){ 
                                                        if ( images.indexOf(image) < 0 )
                                                        {
                                                            images.push(image);
                                                        }
                                                    });
                                          });  

            for (var tower in TowerConfig)
            {
                images2.push( "towers/" + TowerConfig[tower]['image']);
                images2.push( "towers/" + TowerConfig[tower]['smallImage']);
                images2.push( "towers/" + TowerConfig[tower]['skeleton']);    
            }    
            for (var weapon in SuperWeaponConfig)
            {
                images2.push( "weapons/" + SuperWeaponConfig[weapon]['image']);  
            }    
            for (var upgrade in UpgradeConfig)
            {
                images2.push( "upgrades/" +UpgradeConfig[upgrade]['image']);
            }    
            Intro.loader.load( [{ images: images, path : Intro.images.path, store: 'intro'},
                                { images : images2, path : Intro.images.path, store : 'intro' }],
                                { onFinish : function() {
                                                Intro.retrieveTemplates();                    
                                              }});
        
        }
        Intro.loader.load([{ images : Intro.images.inProgress, path : Intro.images.path, store: 'intro'}],
                             { onFinish : callback } ); 
    },
    
    retrieveTemplates: function(){
        new Ajax.Request( PathConfigs.introTemplate, {method:'get',
	            onSuccess: function(t){
                  $('introTemplates').innerHTML = t.responseText;
                  for(var template in Intro.templates){
                		  Intro.templates[template][1] = TrimPath.parseDOMTemplate(Intro.templates[template][0]);
	                }
                  new Ajax.Request( PathConfigs.gameTemplate, {method:'get',
                                          onSuccess: function(t){
                                      		  	          $("gameStart").innerHTML = t.responseText;
                                      		  	          Intro.templates['game'] = t.responseText;
					  			  //game.setGameImages()
                                          		  	      Intro.retrieveData( function() {
                        				                                            initLoadImages(new Loader()); 
                                                                            Intro.next();
                                                        })
                                          } 
                  });
			      }
	      });
    },

    retrieveData: function( callback){
        new Ajax.Request( 'metadata', {method:'get',
              onSuccess: function(t){
                  var data = JSON.parse(t.responseText);
                  Intro.gameData = JSON.parse(data['game_data']['metadata']);
                  Intro.userData = data['user_data'];
                  Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                  Intro.ranks = data['ranks'];
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
            index : 0,
            onSelect : function() {
                Intro.loader.load( [ {images : Intro.images.levelSelection, path : Intro.images.path, store: 'intro'} ],
                              { onFinish : Intro.show } );
            }
        },
        campaign : {
            index : 1,
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
            index : 2,
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
                          images.push( "../../" + Intro.campPath() + Intro.missionPath() + "/images/path.png");   
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
                         "userData" : Intro.userData,
                         "name" : 'towers'
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["towers"] = $A($R(0, 9-data["gameData"]["towers"].length-1));
                data["userData"]["empty"]["towers"] = $A($R(0, 10-data.userData.metadata.added['towers'].length-1)); 
                $('towers').innerHTML = Intro.templates.towers[1].process({ 
                                                  "type" : "towers",
                                                  "data" : data,
                                                  "itemConfig" : TowerConfig });
                /* Change the tabs accordingly */
                path = "images/intro/market/";
                $$("#marketPlace #towersTab img")[0].addClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "tab-on.png";
                $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "tab-off.png";
                $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "tab-off.png";
                Intro.show();
                $('marketPlace').show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var item_rank;
                  for(var rank in Intro.ranks)                 
                  {
                      if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp && Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
                      {
                        item_rank = rank;
                        break;
                      }
                  }
                  var data  = { 'coins' : Intro.userData.coins,
                                'exp' : Intro.userData.exp,
                                'configs' : TowerConfig,
                                'itemid' : id,
                                'type': type,
                                'cost' : Intro.gameData[type][id].cost,
                                'rank' : [Intro.gameData[type][id].exp, item_rank]
                              }
                  $$("#marketPlace #towers #floatBg")[0].innerHTML = Intro.templates['marketplaceItem'][1].process({ "data" : data });    
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
                         "userData" : Intro.userData,
                         "name" : 'super weapons'
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["weapons"] = $A($R(0, 9-data["gameData"]["weapons"].length-1)); 
                data["userData"]["empty"]["weapons"] = $A($R(0, 5-data.userData.metadata.added['weapons'].length-1)); 
                $('weapons').innerHTML = Intro.templates.weapons[1].process({ 
                                                  "type" : "weapons",
                                                  "data" : data,
                                                  "itemConfig" : SuperWeaponConfig });
                /* Change the tabs accordingly */
                path = "images/intro/market/";
                $$("#marketPlace #weaponsTab img")[0].addClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "tab-on.png";
                $$("#marketPlace #towersTab img")[0].removeClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "tab-off.png";
                $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "tab-off.png";   
                Intro.show();
                $('marketPlace').show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var item_rank;
                  for(var rank in Intro.ranks)                 
                  {
                      if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp && Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
                      {
                        item_rank = rank;
                        break;
                      }
                  }
                  var data  = { 'coins' : Intro.userData.coins,
                                'exp' : Intro.userData.exp,
                                'configs' : SuperWeaponConfig,
                                'itemid' : id,
                                'type': type,
                                'cost' : Intro.gameData[type][id].cost,
                                'rank' : [Intro.gameData[type][id].exp, item_rank]
                              }
                  $$("#marketPlace #weapons #floatBg")[0].innerHTML = Intro.templates['marketplaceItem'][1].process({ "data" : data });     
            }
        },
        upgrades : {
            index : 5,
            emptySpots : 5,
            onSelect : function(){
                var gameData = [];
                Intro.toLabels( Intro.gameData, gameData)
                data = { "gameData" : gameData,
                         "userData" : Intro.userData,
                         "name" : 'upgrades'
                      };
                data["gameData"]["empty"] = {};
                data["userData"]["empty"] = {};
                data["gameData"]["empty"]["upgrades"] = $A($R(0, 9-data["gameData"]["upgrades"].length-1));
                data["userData"]["empty"]["upgrades"] = $A($R(0, 5-data.userData.metadata.added['upgrades'].length-1)); 
                $('upgrades').innerHTML = Intro.templates.upgrades[1].process({ 
                                                  "type" : "upgrades",
                                                  "data" : data,
                                                  "itemConfig" : UpgradeConfig });
                /* Change the tabs accordingly */ 
                path = "images/intro/market/";
                $$("#marketPlace #upgradesTab img")[0].addClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "tab-on.png";  
                $$("#marketPlace #towersTab img")[0].removeClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "tab-off.png";
                $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "tab-off.png";
                Intro.show();
                $('marketPlace').show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var item_rank;
                  for(var rank in Intro.ranks)                 
                  {
                      if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp && Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
                      {
                        item_rank = rank;
                        break;
                      }
                  }
                  var data  = { 'coins' : Intro.userData.coins,
                                'exp' : Intro.userData.exp,
                                'configs' : UpgradeConfig,
                                'itemid' : id,
                                'type': type,
                                'cost' : Intro.gameData[type][id].cost,
                                'rank' : [Intro.gameData[type][id].exp, item_rank]
                              }
                  $$("#marketPlace #upgrades #floatBg")[0].innerHTML = Intro.templates['marketplaceItem'][1].process({ "data" : data });    
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
        var name = type;
        Intro.userData.metadata.added[type].push(element.getAttribute('itemid'));
        var itemConfig = TowerConfig;
        if(type == "weapons")
        {
            itemConfig = SuperWeaponConfig;
            name = "super weapons";
        }
        else if (type == "upgrades")
             itemConfig = UpgradeConfig;
       data = { "gameData" : gameData,
                "userData" : Intro.userData, 
                "name" : name
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
        var name = type;
        Intro.userData.metadata.added[type].splice( Intro.userData.metadata.added[type].indexOf(element.getAttribute('itemid')), 1);
        var gameData = [];
        var itemConfig = TowerConfig; 
        Intro.toLabels( Intro.gameData, gameData);
        if(type == "weapons")
        {
            itemConfig = SuperWeaponConfig;
            name = "super weapons";
        }
        else if (type == "upgrades")
             itemConfig = UpgradeConfig;
       data = { "gameData" : gameData,
                "userData" : Intro.userData, 
                "name" : name
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
                                Intro.select(type);
                                Intro.disablePauseScreen();
                            }
                        });
        }else{
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
    
    sendScore : function(score, win, callback){
        new Ajax.Request(  GameConfigs.campaign + "/metadata" ,
              {   method:'post', 
                  parameters: { 'data' : Object.toJSON({'mission' : GameConfigs.mission.order, 'win' : win, 'score' : score }) },
                  onSuccess : function(t, json){
                      var data = JSON.parse(t.responseText);
                      callback();
                  }
              });
    },
    
    setupGameConfigs : function(){
        var missions = Intro.campaignInfo.camp_data.metadata
        var mission = missions.find(function(mission){ if ( GameConfigs.missionPath == mission['path'] ) return true; })
        GameConfigs.mission = mission;
        var map = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['map'];
        var mapFlipped = [];
        for(var i=0; i< map[0].length; i++)
        {
            mapFlipped[i] = [];
        }
        for( var i=0; i< map.length; i++)
        {
            for(var j = 0 ; j < map[i].length; j++)
            {
                mapFlipped[j][i] = map[i][j];
            }
        }
        GameConfigs.map = mapFlipped;
        GameConfigs.mapEntry = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['mapEntry'];
        GameConfigs.mapImage = Intro.campPath() + Intro.missionPath() + "/images/path.png";
        GameConfigs.waves = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['waves'];
        GameConfigs.towers = Intro.userData.metadata.added.towers;
        GameConfigs.superWeapons = Intro.userData.metadata.added.weapons;
        GameConfigs.upgrades = Intro.userData.metadata.added.upgrades;
        GameConfigs.rank = Intro.userData.rank;
        GameConfigs.exp = Intro.userData.exp;
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
	  
	  select: function(page){
        Intro.enablePauseScreen();
        var index = Intro.pages[page].index
        Intro.nextPageIndex = index;
        $("intro").style['curspr'] = 'progress';
        var callback = function() { Intro.pages[Intro.sequence[index]].onSelect(); }
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else
            callback();
	  },
	  
	  replay: function(){
	      Intro.retrieveData(function(){
	                                      
	                                      Intro.select('campaign');
                                        $('gameStart').hide();
                                        $('marketPlace').hide();
                                        $("intro").show();
	                                  });
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
