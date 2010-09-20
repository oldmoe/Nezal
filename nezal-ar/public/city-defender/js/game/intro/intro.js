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
  upgrades : [],
  weaponsPackage :{},
  language : 'english'
}

var ResourceLoader = Class.create( {

    resources:  null,
    
    loadedCount : 0,
    
    addResource: function(resource)
    {
        if(!this.resources)
        {
            this.resources = new Hash();
        }
        if(!this.resources.get(resource))
        {
            this.resources.set(resource, null);
        }
    },

    load: function(callback, errorCallback)
    {
        var self=this;
        this.resources.each(
            function(resource){
                if(!resource[1])
                {
                    new Ajax.Request( resource[0], {method:'get',
                                                      onSuccess: function(t){
                                                          self.resources.set(resource[0], t.responseText);
                                                          self.loadedCount ++;
                                                          if(self.loadedCount == self.resources.keys().length)
                                                          {
                                                              self.loadedCount = 0;
                                                              callback();
                                                          }
                                                      },
                                                      onFailure: function(){
                                                          if(errorCallback)
                                                            errorCallback();
                                                      }
                                      });
                }else{
                    self.loadedCount ++;
                    if(self.loadedCount == self.resources.keys().length)
                    {
                        self.loadedCount = 0;
                        callback();
                    }
                }
          });
    }
})

var Config = GameConfigs;

var PathConfigs = {
  introTemplate : "templates/intro/intro.tpl",
  gameTemplate : "templates/game.tpl"
}

var Intro = {
    dirty : false ,
    currentPage : -1,
    nextPageIndex : 0,
    campLoader : new ResourceLoader(),
    missionLoader : new ResourceLoader(),
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
              levelSelection : [ "levelSelectionTemplate", 0],
              campaign : [ "campaignTemplate", 0],
              mission : [ "missionTemplate", 0],
              towers : [ "marketItemsTemplate", 0],
              weapons : [ "marketItemsTemplate", 0],
              upgrades : [ "marketItemsTemplate", 0],
              marketplaceItem : [ "marketItemDetailsTemplate", 0],
              marketplaceTabs : [ "marketplaceTabsTemplate", 0]
            },
    images : {
        path : "images/intro/" ,
        
        ranks : [ 'ranks/1stLt.png','ranks/1stSgt.png','ranks/2ndLt.png','ranks/BGen.png','ranks/Capt.png',
                  'ranks/Col.png','ranks/Cpl.png','ranks/Gen.png','ranks/GySgt.png','ranks/LCpl.png',
                  'ranks/LtCol.png','ranks/LtGen.png','ranks/MajGen.png','ranks/Maj.png','ranks/MGySgt.png',
                  'ranks/MSgt.png','ranks/PVT.png','ranks/SgtMaj.png','ranks/Sgt.png','ranks/SSgt.png'
        ],
        
        inProgress : [
                        'images/progress/loading.png',
                        'images/progress/loading-text.png',
                        'images/progress/loading-bar.gif'
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
        Intro.retrieveTemplates();
    },
    
    start: function(){  
        if(Intro.doneLoading && Loader.doneLoading)
            Intro.next();          
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
                    		  	                          Loader.loadPage(GameConfigs.campaign, function(){
                                            		  	      Intro.retrieveData( function() {
                                            		  	          Intro.doneLoading = true;
                                                              Intro.start();
                                                          })
                                                      });
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
        return "challenges/" + GameConfigs.campaign + "/" + GameConfigs.language ; 
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
                $('levelSelection').innerHTML = Intro.templates.levelSelection[1].process(); 
                Intro.show();
            }
        },
        campaign : {
            index : 1,
            onSelect : function() {
                var loader = Intro.campLoader;
                var campInfoPath = Intro.campPath() + "/camp.info";
                var campMetadata = GameConfigs.campaign + "/metadata";                
                loader.addResource(campInfoPath);
                loader.addResource(campMetadata);
                loader.load(function(){
                                ChallengeSelector.campaignInfo = JSON.parse(loader.resources.get(campInfoPath));
                                Intro.campaignInfo = JSON.parse(loader.resources.get(campMetadata));
                                $('campaign').innerHTML = 
                                      Intro.templates.campaign[1].process({"camp":ChallengeSelector.campaignInfo}); 
                                Intro.show();
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
                var loader = Intro.missionLoader;
                var missionPath = Intro.campPath() + Intro.missionPath() + "/mission.info";
                loader.addResource(missionPath)
                loader.load( function(){
                          ChallengeSelector.mission = JSON.parse(loader.resources.get(missionPath));
                          ChallengeSelector.mission.creeps = ChallengeSelector.missionCreeps;
                          $('mission').innerHTML = Intro.templates.mission[1].process({ 
                                              "city" : ChallengeSelector.mission,
                                              "path" : Intro.missionPath(),
                                              "creepConfig" : CreepConfig }); 
                          var images = {
                                      'left' : Loader.images.intro['mission/carousel/left.png'].src,
                                      'left-disabled' : Loader.images.intro['mission/carousel/left-disabled.png'].src,
                                      'right' : Loader.images.intro['mission/carousel/right.png'].src,
                                      'right-disabled' : Loader.images.intro['mission/carousel/right-disabled.png'].src
                          };
                          Intro.creepsCarousel = new Carousel("creeps-scroll", images);
                          Intro.creepsCarousel.displayCount = 4;
                          Intro.show();
        	            });
            },
            setFloatBgInfo : function(element){
                  $$("#mission #floatBg div span")[0].innerHTML = CreepConfig[element.getAttribute("creepid")].name;
                  $$("#mission #floatBg div span")[1].innerHTML = CreepConfig[element.getAttribute("creepid")].desc;  
                  $$("#mission #floatBg .skeleton img")[0].src = Loader.images.intro[ "creeps/" + 
                                                  CreepConfig[element.getAttribute("creepid")].skeleton].src;    
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
                $$('#towers #marketTabs')[0].innerHTML =
                         Intro.templates.marketplaceTabs[1].process({'type' : 'towers'});
                Intro.show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var item_rank;
                  for(var rank in Intro.ranks)                 
                  {
                      if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp &&
                                     Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
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
                  $$("#marketPlace #towers #floatBg")[0].innerHTML = 
                                                  Intro.templates['marketplaceItem'][1].process({ "data" : data });
                  $$('#marketPlace #towers #floatBg .clickSound').each(function(element){
                          element.observe('click', function(){Sounds.play(Sounds.gameSounds.click)})
                  })
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
                $$('#weapons #marketTabs')[0].innerHTML = 
                        Intro.templates.marketplaceTabs[1].process({'type' : 'weapons'});     
                Intro.show();
            },
            setFloatBgInfo : function(element){
                var id = element.getAttribute('itemid');
                var type = element.getAttribute('type'); 
                var item_rank;
                for(var rank in Intro.ranks)                 
                {
                    if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp &&
                               Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
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
                $$("#marketPlace #weapons #floatBg")[0].innerHTML = 
                                Intro.templates['marketplaceItem'][1].process({ "data" : data });     
                $$('#marketPlace #weapons #floatBg .clickSound').each(function(element){
                        element.observe('click', function(){Sounds.play(Sounds.gameSounds.click)})
                })
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
                $$('#upgrades #marketTabs')[0].innerHTML = 
                                Intro.templates.marketplaceTabs[1].process({'type': 'upgrades'});
                Intro.show();
            },
            setFloatBgInfo : function(element){
                var id = element.getAttribute('itemid');
                var type = element.getAttribute('type'); 
                var item_rank;
                for(var rank in Intro.ranks)                 
                {
                    if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp &&
                                 Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
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
                $$("#marketPlace #upgrades #floatBg")[0].innerHTML =
                                         Intro.templates['marketplaceItem'][1].process({ "data" : data });    
                $$('#marketPlace #upgrades #floatBg .clickSound').each(function(element){
                        element.observe('click', function(){Sounds.play(Sounds.gameSounds.click)})
                })
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
        $$('.clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
        })
    },
    
    removeItem: function(element){
        Intro.dirty = true;
        var type = element.getAttribute('type');
        var name = type;
        Intro.userData.metadata.added[type].splice( 
                          Intro.userData.metadata.added[type].indexOf(element.getAttribute('itemid')), 1);
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
        $$('.clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
        })     
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
                        parameters: { 'type' : 'game_profile', 'data' : Object.toJSON({ 'type' :type,
                                                                                      'item_id' : itemid,
                                                                                      'event': 'unlock' }) },
                        onSuccess : function(t, json){
                            var data = JSON.parse(t.responseText);
                            var addedItems = Intro.userData["metadata"]['added'];
                            Intro.gameData = JSON.parse(data['game_data']['metadata']);
                            Intro.userData = data['user_data'];
                            Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                            Intro.userData["metadata"]['added'] = addedItems;
                            var typeName = 'tower';
                            var itemConfig = TowerConfig;
                            if(type == "weapons")
                            {
                                itemConfig = SuperWeaponConfig;
                                typeName = "super weapon";
                            }
                            else if (type == "upgrade")
                            {
                                 itemConfig = UpgradeConfig;
                                 typeName = "upgrade";
                            }
                            FBDefender.publishUnlockedItem(
                                { name : itemid,
                                  image : 'intro/'+ type + "/" + itemConfig[itemid]['image'],
                                  mission : GameConfigs.missionPath, type : typeName})
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
                parameters: { 'type' : 'game_profile', 'data' : Object.toJSON({'setup' : Intro.userData.metadata.added,
                                                                               'event': 'user_setup' }) },
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
    
    saveUserSuperWeapons : function(callback){
        new Ajax.Request( 'metadata',
            {   method:'post', 
                parameters: { 'type' : 'game_profile', 'data' : Object.toJSON({'items' : {'Heal' : 2},
                                                                               'event': 'user_weapons' }) },
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
    
    sendScore : function(score, weapons, win, callback){
        if(!weapons)
            weapons = {}
        new Ajax.Request(  GameConfigs.campaign + "/metadata" ,
              {   method:'post', 
                  parameters: { 'data' : Object.toJSON({'mission' : GameConfigs.mission.order,
                                                        'win' : win,
                                                        'items' : weapons,
                                                        'event' : 'user_weapons',
                                                       'score' : score }) },
                  onSuccess : function(t, json){
                      var data = JSON.parse(t.responseText);
                      Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                      Intro.userData.rank = data['user_data'].rank;
                      Intro.userData.exp = data['user_data'].exp;                      
                      Intro.setupGameConfigs();
                      callback();
                  }
              });
    },
    
    newbieNoMore : function(){
        new Ajax.Request(  'newbie' ,
              {   method:'post', 
                  onSuccess : function(t, json){
                      Intro.userData.newbie = false;
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
        GameConfigs.weaponsPackage = Intro.userData.metadata.weapons_package;
        GameConfigs.rank = Intro.userData.rank;
        GameConfigs.exp = Intro.userData.exp;
    },
    
    showFloatBg : function(element){
        Intro.pages[Intro.sequence[Intro.currentPage]].setFloatBgInfo(element);
        $$("#" + Intro.sequence[Intro.currentPage]  + " #" + "floatBg")[0].show();
    },
    
    hideFloatBg : function(){
        $$("#" + Intro.sequence[Intro.currentPage]  + " #" + "floatBg")[0].hide();
    },

    enablePauseScreen : function() {
        $('pause').show()
    },
    
    disablePauseScreen : function() {
        $('pause').hide()
    },

    show: function(){
        $$('.clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
        })
        window.setTimeout(Intro.display, 200);
    },
    
    display : function(){
        Intro.disablePauseScreen();
        $('marketPlace').hide();
        if(	Intro.currentPage >= 0) {
          $(Intro.sequence[Intro.currentPage]).hide();
        }
        Intro.currentPage = Intro.nextPageIndex;
        $(Intro.sequence[Intro.currentPage]).style['display'] = "block"; //show();    
        if([Intro.pages['towers'].index, Intro.pages['weapons'].index,
             Intro.pages['upgrades'].index].indexOf(Intro.currentPage) >= 0)
            $('marketPlace').show();
        $("intro").style['cursor'] = 'auto';
    },

	  next: function(current){
        Intro.enablePauseScreen();
        Intro.nextPageIndex = Intro.currentPage + 1;
        var callback = function() {
                                    if(Intro.nextPageIndex == Intro.sequence.length )
                                        Intro.finish();
                                    else{
                                        Intro.pages[Intro.sequence[Intro.currentPage + 1]].onSelect();
																				}
                                }
        if(Intro.dirty)
            Intro.saveUserSetup( callback );
        else{
            callback();
				}
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
				onFinish()
	  }
	
}
