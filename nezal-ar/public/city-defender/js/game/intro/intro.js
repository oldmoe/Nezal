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
    
    resetResource: function(resource)
    {
        this.resources.set(resource, null);
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
              congrates : [ "congratesTemplate", 0],
              challenges : [ "challengesTemplate", 0],
              levelSelection : [ "levelSelectionTemplate", 0],
              campaign : [ "campaignTemplate", 0],
              mission : [ "missionTemplate", 0],
              marketPlace : [ "marketItemsTemplate", 0],
              marketplaceItem : [ "marketItemDetailsTemplate", 0],
              marketScroll : ["marketScrollerTemplate", 0]
            },

    initialize: function(){
		Intro.currentPage = -1;
        Intro.retrieveTemplates();
    },
    
    start: function(){  
		//alert('starting')
		if(Intro.doneLoading && Loader.events.intro.loaded) Intro.next();
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
			  //$("gameStart").innerHTML = loader.resources.get(PathConfigs.gameTemplate);
              $("gameStart").innerHTML = Intro.templates['game'] = loader.resources.get(PathConfigs.gameTemplate);
              var data = JSON.parse(loader.resources.get('metadata'));
              GameConfigs.currentCampaign = data['game_data']['current_campaign'];			  
			  GameConfigs.campaign = data['game_data']['current_campaign'];
              Intro.gameData = JSON.parse(data['game_data']['metadata']);
              for(var i in Intro.gameData.towers)
              {
                  Intro.gameData.towers[i].upgrades = JSON.parse(Intro.gameData.towers[i].upgrades);
              }
              for(var i in Intro.gameData.weapons)
              {
                  Intro.gameData.weapons[i].upgrades = JSON.parse(Intro.gameData.weapons[i].upgrades);
              }
              Intro.userData = data['user_data'];
              Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
              Intro.ranks = data['ranks'];
  			  Intro.doneLoading = true;
		  	  Intro.start()
			  $('scores').src = 'scores/friends.html?'+Object.toQueryString(FBConnect.session)
			  /*
              Loader.loadPage(GameConfigs.campaign, function(){
				  
                  Intro.start();
              });
			  */
          });
    },
	retrievePrevCampaigns : function(){
		new Ajax.Request( 'statics/campaigns.json', {method:'get',
			onSuccess: function(t){
				Intro.prevCampaigns = JSON.parse(t.responseText)
				$('previousCampaigns').innerHTML = TrimPath.parseTemplate($('prevChallengesTemplate').value).process({campaigns:Intro.prevCampaigns})
				$('levelSelection').hide()
				$('previousCampaigns').show()
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
                var loader = new ResourceLoader();
                Language.getLanguage(Intro.userData.locale, function(){
                    GameConfigs.language = Language.userLanguage;
                    loader.addResource('js/game/languages/'+GameConfigs.language+'.js');
                    loader.load(function(){
                        eval(loader.resources.get('js/game/languages/'+GameConfigs.language+'.js'));
                        Language.langsNames.each( function(lang){
                            $('intro').removeClassName(lang[0]);
                            $('congrates').removeClassName(lang[0]);
                        })
                        $('intro').addClassName(GameConfigs.language)
                        $('congrates').addClassName(GameConfigs.language)
            						$('levelSelection').innerHTML = Intro.templates.levelSelection[1].process(); 
                        if(Intro.userData.newbie){
						    Intro.displayTutorial();
                        }else{
                            Intro.show();
                        }
                        if(!Intro.userData.like){
                            FBDefender.isFan()
                        }
                    });
                });
            }
        },
        campaign : {
            index : 1,
			onSelect : function(campaign){
				$('previousCampaigns').hide()
				$$('.levels').each(function(div){div.hide()})
				if(campaign)GameConfigs.campaign = campaign.name
				Intro.enablePauseScreen();
				Loader.events.challenge = {loaded : false, onLoad :  Intro.pages.campaign.doOnSelect}
				Loader.loadPage(GameConfigs.campaign, function(){Loader.fire('challenge')})
			},
            doOnSelect : function() {
                var loader = Intro.campLoader;
                var campInfoPath = Intro.campPath() + "/camp.info";
                var campMetadata = GameConfigs.campaign + "/metadata";
				loader.resources=new Hash()	
                loader.addResource(campInfoPath);
                loader.addResource(campMetadata);
                loader.load(function(){
					Intro.campaignData = JSON.parse(loader.resources.get(campMetadata));
					Intro.campaignData.campaignInfo = JSON.parse(loader.resources.get(campInfoPath));
					Intro.campaignData.missionsInfo = {};
					loader.resetResource(campMetadata);
					var missionLoader = Intro.missionLoader;
					Intro.campaignData.camp_data.metadata.each(function(mission){
					   var missionPath = Intro.campPath() + "/" + mission['path'] + "/mission.info"; 
					   missionLoader.addResource(missionPath);
					});
					missionLoader.load( function(){
						Intro.campaignData.camp_data.metadata.each(function(mission){
						   var missionPath = Intro.campPath() + "/" + mission['path'] + "/mission.info"; 
						   Intro.campaignData.missionsInfo[mission['path']] = 
								JSON.parse(missionLoader.resources.get(missionPath));
						});
						$('campaign').innerHTML = 
						  Intro.templates.campaign[1].process({"camp":Intro.campaignData.campaignInfo}); 
						Intro.show();
						$('intro').show();
						Intro.disablePauseScreen();
						$('gameStart').hide();
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
                var missionCreeps = creepInfo.uniq();
                var loader = Intro.missionLoader;
                var missionPath = Intro.campPath() + Intro.missionPath() + "/mission.info";
                loader.addResource(missionPath)
                loader.load( function(){
                          var mission = JSON.parse(loader.resources.get(missionPath));
                          mission.creeps = missionCreeps;
                          $('mission').innerHTML = Intro.templates.mission[1].process({ 
                                              "city" : mission,
                                              "path" : Intro.missionPath(),
                                              "creepConfig" : CreepConfig }); 
                          var images = {
                                      'left' : Loader.images.intro['mission/carousel/left.png'].getAttribute('data'),
                                      'left-disabled' : Loader.images.intro['mission/carousel/left-disabled.png'].getAttribute('data'),
                                      'right' : Loader.images.intro['mission/carousel/right.png'].getAttribute('data'),
                                      'right-disabled' : Loader.images.intro['mission/carousel/right-disabled.png'].getAttribute('data')
                          };
                          Intro.creepsCarousel = new Carousel("creeps-scroll", images, 4);
                          Intro.show();
        	            });
            },
            setFloatBgInfo : function(element){
                  $$("#mission #floatBg div span")[0].innerHTML = Text.intro.creeps[element.getAttribute("creepid")].name;
                  $$("#mission #floatBg div span")[1].innerHTML = Text.intro.creeps[element.getAttribute("creepid")].desc;  
                  $$("#mission #floatBg .skeleton img")[0].src = Loader.images.intro[ "creeps/" + 
                                                  CreepConfig[element.getAttribute("creepid")].skeleton].getAttribute('data');    
            }
        }, 
        marketPlace : {
            index : 3,
            emptySpots : 5,
            onSelect : function(){
                /* Get User Data : coins, unlocked towers, super weapons & upgrade */
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
                                      'left' : Loader.images.intro['market/carousel/left.png'].getAttribute('data'),
                                      'left-disabled' : Loader.images.intro['market/carousel/left-disabled.png'].getAttribute('data'),
                                      'right' : Loader.images.intro['market/carousel/right.png'].getAttribute('data'),
                                      'right-disabled' : Loader.images.intro['market/carousel/right-disabled.png'].getAttribute('data')
                          };
                Intro.weaponsCarousel = new Carousel("weapons-scroll", images, 5);
                Intro.towersCarousel = new Carousel("towers-scroll", images, 5);
                Intro.show();
            },
            setFloatBgInfo : function(element){
                  var id = element.getAttribute('itemid');
                  var type = element.getAttribute('type'); 
                  var upgrade = element.getAttribute('upgrade');
                  var itemConfig = TowerConfig;
                  var translateName = "towers"
                  if(type == "weapons")
                  {
                    itemConfig = SuperWeaponConfig;
                    translateName = "superWeapons";
                  }
                  var item_rank;
                  var cost = Intro.gameData[type][id].cost;
                  var exp = Intro.gameData[type][id].exp;
                  var currUpgrade = 0;
                  var nextUpgrade = 0;
                  if(upgrade )
                  {
                      if(Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']])
                      {
                          cost = Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['cost'];
                          exp = Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp'];
                          nextUpgrade = Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']];
                          currUpgrade = Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']-1];
                          for(var rank in Intro.ranks)                 
                          {
                              if( (Intro.ranks[rank][0]<=
                                      Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp']) &&
                                  (Intro.ranks[rank][1]>=
                                      Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp']) )
                              {
                                item_rank = rank;
                                break;
                              }
                          } 
                      }else{
                          currUpgrade = Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']-1];
                          nextUpgrade = currUpgrade;
                      }
                        
                  }else{
                      for(var rank in Intro.ranks)                 
                      {
                          if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp &&
                                         Intro.ranks[rank][1]>=Intro.gameData[type][id].exp )
                          {
                            item_rank = rank;
                            break;
                          }
                      }
                  }
                  var data  = { 'coins' : Intro.userData.coins,
                                'exp' : Intro.userData.exp,
                                'configs' : itemConfig,
                                'itemid' : id,
                                'type': type,
                                'upgrade' : upgrade,
                                'translateName' : translateName,
                                'nextUpgrade' : nextUpgrade,
                                'currUpgrade' : currUpgrade,
                                'cost' : cost,
                                'rank' : [exp, item_rank]
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
                            var typeName = 'towers';
                            var itemConfig = TowerConfig;
                            if(type == "weapons")
                            {
                                itemConfig = SuperWeaponConfig;
                                typeName = "superWeapons";
                            }
                            FBDefender.publishUnlockedItem(
                                { name : itemid,
                                  image : 'intro/'+ type + "/" + itemConfig[itemid]['image'],
                                  type : typeName})
                            Intro.select('marketPlace');
                            Intro.disablePauseScreen();
                  }
            });
        }else{
        }
    },
    
    upgradeItem: function(element){
        var type = element.getAttribute('type');
        var itemid = element.getAttribute('itemid');
        var cost = Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['cost'];
        var exp = Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['exp'];
        if ( Intro.userData.coins >= cost &&
               Intro.userData.exp >= exp ) 
        {
            Intro.enablePauseScreen();
            new Ajax.Request( 'metadata',
                    {   method:'post', 
                        parameters: { 'data' : Object.toJSON({ 'type' :type,
                                                                'item_id' : itemid,
                                                                'event': 'upgrade' }) },
                        onSuccess : function(t, json){
                            var data = JSON.parse(t.responseText);
                            Intro.userData = data['user_data'];
                            Intro.userData["metadata"] = JSON.parse(data['user_data']['metadata']);
                            var typeName = 'towers';
                            var itemConfig = TowerConfig;
                            if(type == "weapons")
                            {
                                itemConfig = SuperWeaponConfig;
                                typeName = "superWeapons";
                            }
                            FBDefender.publishUpgradedItem(
                                { name : itemid,
                                  image : 'intro/'+ type + "/" + itemConfig[itemid]['image'],
                                  type : typeName})
                            Intro.select('marketPlace');
                            Intro.disablePauseScreen();
                  }
            });
        }else{
        }
    },

    sendScore : function(score, win, callback){
        new Ajax.Request(  GameConfigs.campaign + "/metadata" ,
              {   method:'post', 
                  parameters: { 'data' : Object.toJSON({'mission' : GameConfigs.mission.order,
                                                        'win' : win,
                                                        'level' : (GameConfigs.level).toString(),
                                                       'score' : score }) },
                  onSuccess : function(t, json){
                      var data = JSON.parse(t.responseText);
                      Intro.campaignData.user_data.metadata = data['user_data']['metadata'];
                      Intro.userData.rank = data['user_data'].rank;
                      Intro.userData.exp = data['user_data'].exp;                      
                      Intro.userData.coins = data['user_data'].coins;  
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
                      data = JSON.parse(t.responseText);
                      Intro.userData.exp = data['user_data']['exp'];
                      var oldRank = Intro.userData.rank;
                      Intro.userData.rank = data['user_data']['rank'];
                      Intro.show();
                      $("intro").show();   
                      $('gameStart').hide();
                      //console.log(oldRank, Intro.userData.rank)
                      if(oldRank != Intro.userData.rank)
                          FBDefender.publishRankPromotion({name : Intro.userData.rank, image : "fb-" + Intro.userData.rank + '.png'});
                  }
              });
    },
    
    setupGameConfigs : function(){
        var missions = Intro.campaignData.camp_data.metadata
        var mission = missions.find(function(mission){ if ( GameConfigs.missionPath == mission['path'] ) return true; })
        GameConfigs.mission = mission;
        var map = Intro.campaignData.user_data.metadata.missions[mission['order'] - 1  ]['map'];
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
        var towers = [], towerUpgrades={};
        for( var j in Intro.userData.metadata.towers)
        {
            towers.push(j);
            towerUpgrades[j] = Intro.userData.metadata.towers[j]['upgrades'];
        }
        var weapons = [], weaponUpgrades={};
        for( var j in Intro.userData.metadata.weapons)
        {
            weapons.push(j);
            weaponUpgrades[j] = Intro.userData.metadata.weapons[j]['upgrades'];
        }
        GameConfigs.map = mapFlipped;
        GameConfigs.mapEntry = Intro.campaignData.user_data.metadata.missions[mission['order'] - 1  ]['mapEntry'];
        GameConfigs.mapImage = 'challenges/' + GameConfigs.campaign + '/images' + Intro.missionPath() + '/path.png';
        GameConfigs.waves = Intro.campaignData.user_data.metadata.missions[mission['order'] - 1  ]['waves'];
        GameConfigs.towers = towers;
        GameConfigs.towerUpgrades = towerUpgrades;
        GameConfigs.weaponUpgrades = weaponUpgrades;
        GameConfigs.superWeapons = weapons;
        GameConfigs.rank = Intro.userData.rank;
        GameConfigs.exp = Intro.userData.exp;
    },
    
    showLikeCongrates : function(){
      $('congrates').innerHTML = Intro.templates.congrates[1].process({ "msg" : Text.facebook.like });
      $$('#congrates .clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
      });
      $('congrates').show()
    },
    showBookmarkCongrates : function(){
      $('congrates').innerHTML = Intro.templates.congrates[1].process({ "msg" : Text.facebook.bookmark });
      $$('#congrates .clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
      });
      $('congrates').show()
    },
    hideCongrates : function(){
      $('congrates').hide()
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
	startFileLoading : function(fileName){
		//	if(!Intro.fileLoading){
			fileName = fileName.replace("_dumb","")
			Intro.fileLoading=true
			$$('#pause #fileName').first().innerHTML = "Loading "+fileName.split('?')[0].split('/')[1] + "....."
			Intro.enableProgressbar(0,100,fileName)
		//}
	},
	enableProgressbar : function(percentage,timeout,fileName){
		if(Loader.loaded[fileName]||percentage==97){
			$$('#pause #loadingPercentage').first().innerHTML = "100 %"
			$$('#pause  #loadingBarEmpty #loadingBarFill').first().style.width = "97%"		
			//Intro.fileLoading=false
			return 
		}
		$$('#pause #loadingPercentage').first().innerHTML = percentage +" %"		
		$$('#pause  #loadingBarEmpty #loadingBarFill').first().style.width = percentage +"%"		
		window.setTimeout(function(){Intro.enableProgressbar(percentage+1,timeout*1.1,fileName)}, timeout)
	},
	
    disablePauseScreen : function() {
        $('pause').hide()
    },
    
	  doDisplayTutorial :function(){
		    Intro.disablePauseScreen();
        Intro.userData.newbie = true;
        city_defender_start();
        $('gameStart').show();
        $("intro").hide();    
			  onFinish()
	  },
	
    displayTutorial : function() {
	      if(Loader.events.tutorial.loaded){
		        Intro.doDisplayTutorial()
	      }else{
		        Loader.events.tutorial.onLoad = Intro.doDisplayTutorial
	      }	
    },

    show: function(){
        $$('.clickSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.click)})
        });
        $$('.acceptSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.accept)})
        })
        $$('.rejectSound').each(function(element){
          element.observe('click', function(element){Sounds.play(Sounds.gameSounds.reject)})
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
	      Intro.disabled = false;
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
	      Intro.disabled = false;
        Intro.enablePauseScreen();
        Intro.nextPageIndex = Intro.currentPage - 1;
        var callback = function() { Intro.pages[Intro.sequence[Intro.currentPage - 1]].onSelect(); } 
        callback();
	  },
	  
	  select: function(page){
	      Intro.disabled = false;
        Intro.enablePauseScreen();
        var index = Intro.pages[page].index
        Intro.nextPageIndex = index;
        $("intro").style['curspr'] = 'progress';
        var callback = function() { Intro.pages[Intro.sequence[index]].onSelect(); }
        callback();
	  },
	  
	  replay: function(){  
        Intro.select('campaign');
	  },
	  showLevelSelection: function(){
		$('previousCampaigns').hide()
		$('levelSelection').innerHTML = Intro.templates.levelSelection[1].process(); 
		$('levelSelection').show()		
	  },
	  finish: function(){
	      Intro.setupGameConfigs();
        city_defender_start();
        Intro.disablePauseScreen();
        $('gameStart').show();
        $("intro").hide();    
				onFinish()
	  },
    showPaymentBg: function(){
      $('payments-container').innerHTML = TrimPath.parseTemplate($('payment-options-template').value).process();
      $$('#payments-container .clickSound').each(function(element){
        element.stopObserving('click');
      });
      payment.activateMiddlePackage();
      $('paymentFloatBg').show();
    },
    hidePaymentBg: function(){
      $('paymentFloatBg').hide();
    },
    
    paymentSuccess: function(coins){
      $('paymentSuccessContainer').innerHTML = TrimPath.parseTemplate($('payment-success').value).process({'coins' : coins});
      $('paymentSuccessOk').observe('click', function(element){Sounds.play(Sounds.gameSounds.click)});
      //$$('#paymentSuccessModalWindow .content')[0].innerHTML = "+ " + coins
      $('paymentSuccessContainer').show();
      
      Intro.userData.coins += Number(coins);
      $$('#upperPart .coins')[0].innerHTML = Intro.userData.coins;
      
      Sounds.play(Sounds.gameSounds.add_money)
      
      var goldAnimationRepitition = 5;
      setInterval(function(){
        $$('#upperPart .coins')[0].style.color = ["black", "gold"][goldAnimationRepitition%2]
        goldAnimationRepitition--;
      }, 500);
    },
    hidePaymentSuccess: function(){
      $('paymentSuccessContainer').hide();
    },
    showContactUsForm : function(){
      var self = this;
      $('contactUsFloatBg').innerHTML = TrimPath.parseTemplate($('contactUsTemplate').value).process();
      $('contactUsFloatBg').show();
    },
    submitContactUsForm : function(){
         $('contact-us-form').request({
            onFailure: function(t) {
              $('contact-us-post-submission').update(Text.payments.contactUsFormPostSubmissionFailure);
            },
            onSuccess: function(t) {
              $('contact-us-post-submission').update(Text.payments.contactUsFormPostSubmissionSuccess);
              //self.hideContactUsBg();
            },
            onComplete: function(t){
              $('contact-us-form').remove();
            }
          });
    },
    hideContactUsBg: function(){
      $('contactUsFloatBg').hide();
    }
}
