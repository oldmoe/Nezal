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
  language : 'arabic'
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
              "marketPlace"
            ],
    templates : {
              challenges : [ "challengesTemplate", 0],
              levelSelection : [ "levelSelectionTemplate", 0],
              campaign : [ "campaignTemplate", 0],
              mission : [ "missionTemplate", 0],
              marketPlace : [ "marketItemsTemplate", 0],
              marketplaceItem : [ "marketItemDetailsTemplate", 0],
              marketScroll : ["marketScrollerTemplate", 0]
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
        var loader = new ResourceLoader();
        loader.addResource(PathConfigs.introTemplate);
        loader.addResource(PathConfigs.gameTemplate);
        loader.addResource('metadata');
        loader.load(function(){
              $('introTemplates').innerHTML = loader.resources.get(PathConfigs.introTemplate);
              for(var template in Intro.templates){
            		  Intro.templates[template][1] = TrimPath.parseDOMTemplate(Intro.templates[template][0]);
              }
              $("gameStart").innerHTML = loader.resources.get(PathConfigs.gameTemplate);
              Intro.templates['game'] = loader.resources.get(PathConfigs.gameTemplate);
              var data = JSON.parse(loader.resources.get('metadata'));
              Intro.gameData = JSON.parse(data['game_data']['metadata']);
              Intro.userData = data['user_data'];
              Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
              Intro.ranks = data['ranks'];
              Loader.loadPage(GameConfigs.campaign, function(){
      	          Intro.doneLoading = true;
                  Intro.start();
              });
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
                var loader = new ResourceLoader();
                Language.getLanguage(Intro.userData.locale, function(){
                    GameConfigs.language = Language.userLanguage;
                    loader.addResource('js/game/languages/'+GameConfigs.language+'.js');
                    loader.load(function(){
                        eval(loader.resources.get('js/game/languages/'+GameConfigs.language+'.js'));
                        if(GameConfigs.language=="arabic")
                          $('intro').style['direction'] = 'rtl';
                        else
                          $('intro').style['direction'] = 'ltr';
                        $('levelSelection').innerHTML = Intro.templates.levelSelection[1].process(); 
                        Intro.show();
                    });
                });
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
                                Intro.campaignInfo.missions = {};
                                var missionLoader = Intro.missionLoader;
                                Intro.campaignInfo.camp_data.metadata.each(function(mission){
                                   var missionPath = Intro.campPath() + "/" + mission['path'] + "/mission.info"; 
                                   missionLoader.addResource(missionPath);
                                });
                                missionLoader.load( function(){
                                    Intro.campaignInfo.camp_data.metadata.each(function(mission){
                                       var missionPath = Intro.campPath() + "/" + mission['path'] + "/mission.info"; 
                                       Intro.campaignInfo.missions[mission['path']] = 
                                            JSON.parse(missionLoader.resources.get(missionPath));
                                    });
                                    $('campaign').innerHTML = 
                                      Intro.templates.campaign[1].process({"camp":ChallengeSelector.campaignInfo}); 
                                    Intro.show();
                                });
                            });
            }
        },
        mission : {
            index : 2,
            onSelect : function(){
                var creepInfo = [];
                Intro.setupGameConfigs();
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
                          Intro.creepsCarousel = new Carousel("creeps-scroll", images, 4);
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
        marketPlace : {
            index : 3,
            emptySpots : 5,
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
                data["gameData"]["empty"]["towers"] = $A($R(0, 5-data["gameData"]["towers"].length-1));
                data["gameData"]["empty"]["weapons"] = $A($R(0, 5-data["gameData"]["weapons"].length-1));
                $('marketPlace').innerHTML = Intro.templates.marketPlace[1].process({ 
                                                  "type" : "towers",
                                                  "data" : data});
                $('weaponsDisplay').innerHTML = Intro.templates.marketScroll[1].process({ 
                                                  "type" : "weapons",
                                                  "data" : data,
                                                  "itemConfig" : SuperWeaponConfig });
                $('towersDisplay').innerHTML = Intro.templates.marketScroll[1].process({ 
                                                  "type" : "towers",
                                                  "data" : data,
                                                  "itemConfig" : TowerConfig });
                var images = {
                                      'left' : Loader.images.intro['market/carousel/left.png'].src,
                                      'left-disabled' : Loader.images.intro['market/carousel/left-disabled.png'].src,
                                      'right' : Loader.images.intro['market/carousel/right.png'].src,
                                      'right-disabled' : Loader.images.intro['market/carousel/right-disabled.png'].src
                          };
                Intro.weaponsCarousel = new Carousel("weapons-scroll", images, 5);
                Intro.towersCarousel = new Carousel("towers-scroll", images, 5);
                Intro.show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var itemConfig = TowerConfig;
                  if(type == "weapons")
                  {
                    itemConfig = SuperWeaponConfig;
                  }
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
                                'configs' : itemConfig,
                                'itemid' : id,
                                'type': type,
                                'cost' : Intro.gameData[type][id].cost,
                                'rank' : [Intro.gameData[type][id].exp, item_rank]
                              }
                  $$("#marketPlace #floatBg")[0].innerHTML = 
                                                  Intro.templates['marketplaceItem'][1].process({ "data" : data });
                  $$('#marketPlace #floatBg .clickSound').each(function(element){
                          element.observe('click', function(){Sounds.play(Sounds.gameSounds.click)})
                  })
            }
        }
    },
    
    selectLanguage : function(element)
    {
      var lang=element.getAttribute('language')
      Intro.enablePauseScreen();
      Language.select(lang, function(){
          Intro.userData.locale = Language.userLanguage;
          Intro.select('levelSelection')
      });
    },
    
    selectMission : function(element){
      GameConfigs.missionPath = element.getAttribute('path');
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
                        parameters: { 'data' : Object.toJSON({ 'type' :type,
                                                                'item_id' : itemid,
                                                                'event': 'unlock' }) },
                        onSuccess : function(t, json){
                            var data = JSON.parse(t.responseText);
                            Intro.userData = data['user_data'];
                            Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
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
                            Intro.select('marketPlace');
                            Intro.disablePauseScreen();
                  }
            });
        }else{
        }
    },

    sendScore : function(score, weapons, win, callback){
        if(!weapons)
            weapons = {}
        new Ajax.Request(  GameConfigs.campaign + "/metadata" ,
              {   method:'post', 
                  parameters: { 'data' : Object.toJSON({'mission' : GameConfigs.mission.order,
                                                        'win' : win,
                                                        'items' : weapons,
                                                        'event' : 'consumed_weapons',
                                                       'score' : score }) },
                  onSuccess : function(t, json){
                      var data = JSON.parse(t.responseText);
                      Intro.campaignInfo.user_data.metadata = JSON.parse(data['user_data']['metadata']);
                      Intro.userData.rank = data['user_data'].rank;
                      Intro.userData.exp = data['user_data'].exp;                      
                      Intro.setupGameConfigs();
                      callback();
                  }
              });
    },
    
    newbieNoMore : function(){
        new Ajax.Request(  'users/newbie' ,
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
        GameConfigs.mapImage = 'challenges/' + GameConfigs.campaign + '/images' + Intro.missionPath() + '/path.png';
        GameConfigs.waves = Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1  ]['waves'];
        var towers = [];
        for( j in Intro.userData.metadata.towers) 
        {
            towers.push(j);
        }
        var weapons = [];
        for( j in Intro.userData.metadata.weapons) 
        {
            weapons.push(j);
        }
        GameConfigs.towers = towers;
        GameConfigs.superWeapons = weapons;
        GameConfigs.upgrades = [];
        GameConfigs.weaponsPackage = [];
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
        if(	Intro.currentPage >= 0) {
          $(Intro.sequence[Intro.currentPage]).hide();
        }
        Intro.currentPage = Intro.nextPageIndex;
        $(Intro.sequence[Intro.currentPage]).style['display'] = "block"; //show();    
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
        callback();
	  },
	  
	  previous: function(current){
        Intro.enablePauseScreen();
        Intro.nextPageIndex = Intro.currentPage - 1;
        var callback = function() { Intro.pages[Intro.sequence[Intro.currentPage - 1]].onSelect(); } 
        callback();
	  },
	  
	  select: function(page){
        Intro.enablePauseScreen();
        var index = Intro.pages[page].index
        Intro.nextPageIndex = index;
        $("intro").style['curspr'] = 'progress';
        var callback = function() { Intro.pages[Intro.sequence[index]].onSelect(); }
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
        city_defender_start();
        $('gameStart').show();
        $("intro").hide();    
				onFinish()
	  }
	
}
