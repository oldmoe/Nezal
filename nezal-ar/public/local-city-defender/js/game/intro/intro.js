var Config = null

var Intro = {
    
    currentPage : -1,
    nextPageIndex : 0,
    sequence : [
              "levelSelection",
              "campaign",
              "mission",
              "towers",
              "superWeapons",
              "upgrades"
            ],
    templates : {
              challenges : [Configs.template_path + "challenges.tpl", 0],
              campaign : [Configs.template_path + "campaign.tpl", 0],
              mission : [Configs.template_path + "mission.tpl", 0],
              towers : [Configs.template_path + "towers.tpl", 0],
              superWeapons : [Configs.template_path + "super_weapons.tpl", 0],
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
                      "mission/float-bg.png"
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
                    "market/unlock.png"
                ],
        superWeapons : [
                ]
    },

    initialize: function(){
        this.currentPage = -1;
        for(var template in Intro.templates){
          Intro.retrieve(template);
	      }
    },
    
    retrieve: function(template){
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
      		  	      $("gameStart").innerHTML = Intro.templates['game'][1].source;
      		  	      loadAllImages();
      		  	      Upgrades.init(); 
                    Intro.next(); 		    
                }
			      }
	      })
    },

    campPath : function() {
        return "challenges/" + GameConfigs.campaign; 
    },
    
    missionPath : function(){
        return "/" + GameConfigs.missionName;
    },
  
    pages : {
        levelSelection : {
            onSelect : function() {
                ImageLoader.load(Intro.images.levelSelection, Intro.images.path, function(){}, Intro.show);
            }
        },
        campaign : {
            onSelect : function() {
                var images = []
                Intro.images.campaign.each(function(image){ images.push( Intro.images.path + image) });
                images.push( "../../" + Intro.campPath() + "/images/camp-map.png" );   
                new Ajax.Request( Intro.campPath() + "/camp.info" ,
                                    {   method:'get', 
                                        onComplete: function(t, json){
                                            ChallengeSelector.campaignInfo = JSON.parse(t.responseText);
                                            ImageLoader.load(images, Intro.images.path, function(){}, function()
                                            {
                                                $('campaign').innerHTML = Intro.templates.campaign[1].process({"camp":ChallengeSelector.campaignInfo}); 
                                                Intro.show();
                                            });
                                        }
                                      });
            }
        },
        mission : {
            onSelect : function(){
                console.log("mission on select");
                new Ajax.Request( Intro.campPath() + Intro.missionPath() + "/config.js" ,
                                {method:'get', 
                                      onComplete: function(t, json){
                                          try{
                                            console.log(eval(t.responseText));
                                          }catch(e){
                                            console.log(e)
                                          }
                                          window.Config = Config;         
                                          var creepInfo = [];
                                          window.Config['waves'].each( function(element) { 
                                                              for( var i =0; i< element['creeps'].length; i++ )
                                                              {
                                                                  creepInfo = creepInfo.concat([element['creeps'][i]['category'].prototype.name]);
                                                              }
                                                          })
                                          ChallengeSelector.missionCreeps = creepInfo.uniq();
                                          console.log(ChallengeSelector.missionCreeps);
                                          new Ajax.Request( Intro.campPath() + Intro.missionPath() + "/mission.info" ,
                                              {method:'get', 
                                                onComplete: function(t, json){
                                                    ChallengeSelector.mission = JSON.parse(t.responseText);
                                                    ChallengeSelector.mission.creeps = ChallengeSelector.missionCreeps;
                                                    var images = []
                                                    Intro.images.mission.each(function(image){ images.push( Intro.images.path + image) });
                                                    images.push( Intro.campPath() + Intro.missionPath() + "/images/city.png");
                                                    images.push( Intro.campPath() + Intro.missionPath() + "/images/map.png");   
                                                    for (var creep in CreepConfig)
                                                    {
                                                        images.push( Intro.images.path + "creeps/" + CreepConfig[creep]['image']);
                                                    }
                                                    ImageLoader.load (images, "",
                                                                      function(){},
                                                                      function() {
                                                                           $('mission').innerHTML = Intro.templates.mission[1].process({ 
                                                                                                  "city" : ChallengeSelector.mission,
                                                                                                  "path" : Intro.campPath() + Intro.missionPath(),
                                                                                                  "creepConfig" : CreepConfig }); 
                                                                           Intro.creepsCarousel = new Carousel("creeps-scroll");
                                                                           Intro.creepsCarousel.displayCount = 4;
                                                                           Intro.show();
                                                                           console.log("hiiiiiii");
                                                                      })
                                    	          }
                          	                })
                      	              }
                	              });
            },
            setFloatBgInfo : function(element){
                  $$("#mission #floatBg div span")[0].innerHTML = CreepConfig[element.getAttribute("creepid")].name;
                  $$("#mission #floatBg div span")[1].innerHTML = CreepConfig[element.getAttribute("creepid")].desc;  
                  $$("#mission #floatBg .skelaton img")[0].src = Intro.images.path + "creeps/" + 
                                                                  CreepConfig[element.getAttribute("creepid")].skelaton;    
            }
        }, 
        towers : {
            onSelect : function(){
                /* Change the tabs accordingly */
                path = "images/intro/market/";
                $$("#marketPlace #towersTab img")[0].addClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "towers-on.png";
                $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-off.png";
                $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-off.png";
                $$("#marketPlace #bar img")[0].src = path + "towers-bar.png";  
                /* Get User Data : coins, unlocked towers, super weapons & upgrade
                   Also should contain User last used tower, weapon set 
                   TODO replace this with Ajax  call to get the data */

                data = { "gameData" : {  "towers" : ["Cannon1", "Cannon2", "Rocket", "Cannon3", "Cannon4"],
                                         "weapons" : ["Nuck", "Weak"],
                                         "upgrades" : [] },
                         "userData" : { "coins" : 107834, 
                                        "towers" : ["Cannon1", "Cannon2", "Rocket"],
                                         "weapons" : ["Nuck"],
                                         "upgraged" : [],
                                         "added" : { "towers" : ["Cannon1", "Cannon2"],
                                                      "weapons" : [],
                                                      "upgrades" : [] } }
                      };
                data["gameData"]["emptyTowers"] = $A($R(0, 9-data["gameData"]["towers"].length-1));
                data["gameData"]["emptyWeapons"] = $A($R(0, 9-data["gameData"]["weapons"].length-1)); 
                data["gameData"]["emptyUpgrades"] = $A($R(0, 9-data["gameData"]["upgrades"].length-1));
                Intro.images.towers.each(function(image){ images.push( Intro.images.path + image) });  
                for (var tower in TowerConfig)
                {
                    images.push( Intro.images.path + "towers/" + TowerConfig[tower]['image']);
                    images.push( Intro.images.path + "towers/" + TowerConfig[tower]['skelaton']);    
                }    
                ImageLoader.load (images, "",
                                  function(){},
                                  function() {
                                      $('towers').innerHTML = Intro.templates.towers[1].process({ 
                                                                        "data" : data,
                                                                        "towerConfig" : TowerConfig });
                                      $('marketPlace').show();
                                      Intro.show();
                                  })
            },
            setFloatBgInfo : function(element){
                  $$("#marketPlace #floatBg div span")[0].innerHTML = TowerConfig[element.getAttribute("towerid")].model + " " +
                                                                   TowerConfig[element.getAttribute("towerid")].name;
                  $$("#marketPlace #floatBg div span")[1].innerHTML = TowerConfig[element.getAttribute("towerid")].desc;
                  $$("#marketPlace #floatBg div img")[0].src = Intro.images.path + "towers/" + 
                                                                  TowerConfig[element.getAttribute("towerid")].skelaton;    
            }
        },
        superWeapons : {
            onSelect : function(){
                /* Change the tabs accordingly */
                path = "images/intro/market/";
                $$("#marketPlace #weaponsTab img")[0].addClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-on.png";
                $$("#marketPlace #towersTab img")[0].removeClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "towers-off.png";
                $$("#marketPlace #upgradesTab img")[0].removeClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-off.png";  
                $$("#marketPlace #bar img")[0].src = path + "weapons-bar.png";  
                /* Get User Data : coins, unlocked towers, super weapons & upgrade
                   Also should contain User last used tower, weapon set 
                   TODO replace this with Ajax  call to get the data */
                data = { "gameData" : {  "towers" : ["Cannon1", "Cannon2", "Rocket", "Cannon3", "Cannon4"],
                                         "weapons" : ["Nuck", "Weak", "Hyper", "Splash"],
                                         "upgrades" : [] },
                         "userData" : { "coins" : 1074, 
                                        "towers" : ["Cannon1", "Cannon2", "Rocket"],
                                         "weapons" : ["Nuck", "Weak", "Hyper"],
                                         "upgraged" : [],
                                         "added" : { "towers" : ["Cannon1", "Cannon2"],
                                                      "weapons" : ["Weak"],
                                                      "upgrades" : [] } }
                      };
                data["gameData"]["emptyTowers"] = $A($R(0, 9-data["gameData"]["towers"].length-1));
                data["gameData"]["emptyWeapons"] = $A($R(0, 9-data["gameData"]["weapons"].length-1)); 
                data["gameData"]["emptyUpgrades"] = $A($R(0, 9-data["gameData"]["upgrades"].length-1));
                Intro.images.superWeapons.each(function(image){ images.push( Intro.images.path + image) });  
                for (var weapon in SuperWeaponConfig)
                {
                    images.push( Intro.images.path + "super-weapons/" + SuperWeaponConfig[weapon]['image']);
                    images.push( Intro.images.path + "super-weapons/" + SuperWeaponConfig[weapon]['skelaton']);    
                }    
                ImageLoader.load (images, "",
                                  function(){},
                                  function() {
                                      $('superWeapons').innerHTML = Intro.templates.superWeapons[1].process({ 
                                                                        "data" : data,
                                                                        "weaponConfig" : SuperWeaponConfig }); 
                                      $('marketPlace').show();
                                      Intro.show();
                                  })

            },
            setFloatBgInfo : function(element){
                  $$("#marketPlace #floatBg div span")[0].innerHTML = SuperWeaponConfig[element.getAttribute("weaponid")].model + " " +
                                                                   SuperWeaponConfig[element.getAttribute("weaponid")].name;
                  $$("#marketPlace #floatBg div span")[1].innerHTML = SuperWeaponConfig[element.getAttribute("weaponid")].desc;
                  $$("#marketPlace #floatBg div img")[0].src = Intro.images.path + "weapons/" + 
                                                                  SuperWeaponConfig[element.getAttribute("weaponid")].skelaton;    
            }
        },
        upgrades : {
            onSelect : function(){
                /* Change the tabs accordingly */ 
                path = "images/intro/market/";
                $$("#marketPlace #upgradesTab img")[0].addClassName('on');
                $$("#marketPlace #upgradesTab img")[0].src = path + "upgrades-on.png";  
                $$("#marketPlace #towersTab img")[0].removeClassName('on');
                $$("#marketPlace #towersTab img")[0].src = path + "towers-off.png";
                $$("#marketPlace #weaponsTab img")[0].removeClassName('on');
                $$("#marketPlace #weaponsTab img")[0].src = path + "weapons-off.png";
                $$("#marketPlace #bar img")[0].src = path + "upgrades-bar.png";  
                $('marketPlace').show();
                Intro.show();
            }
        }
    },
    
    show: function(){
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
        $('marketPlace').hide();
        Intro.nextPageIndex = Intro.currentPage + 1;
        if(Intro.nextPageIndex == Intro.sequence.length )
            Intro.finish();
        else
            Intro.pages[Intro.sequence[Intro.currentPage + 1]].onSelect();
	  },
	  
	  previous: function(current){
        $('marketPlace').hide();
        Intro.nextPageIndex = Intro.currentPage - 1;
        Intro.pages[Intro.sequence[Intro.currentPage - 1]].onSelect();
	  },
	  
	  select: function(index){
        $('marketPlace').hide();
        Intro.nextPageIndex = index;
        $("intro").style['curspr'] = 'progress';
        Intro.pages[Intro.sequence[index]].onSelect();
	  },
	  
	  finish: function(){
        $("intro").hide();
        console.log(Config) 
        gameStart();
	      $('gameStart').show();
	  }
	
}


