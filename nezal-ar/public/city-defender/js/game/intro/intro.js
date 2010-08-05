var Intro = {
    
    currentPage : -1,
    nextPageIndex : 0,
    sequence : [
              "levelSelection",
              "cityInfo",
              "towers",
              "weapons",
              "upgrades"
            ],
    templates : {
              challenges: [Configs.template_path + "challenges.tpl", 0],
              cityInfo: [Configs.template_path + "city_info.tpl", 0],
              towers: [Configs.template_path + "towers_info.tpl", 0],
              weapons: [Configs.template_path + "weapons_info.tpl", 0]
            },
    images : {
        path : "images/intro/" ,
        levelSelection : [
                            "level-selection.png",
                            "difficulty.png"
                        ],
        cityInfo : [
                      "city/city-info.png",
                      "city/accept.png",
                      "city/reject.png",
                      "city/carousel/left.png",
                      "city/carousel/left-disabled.png",
                      "city/carousel/right.png",
                      "city/carousel/right-disabled.png",
                      "city/float-bg.png",
                      "difficulty.png",
                      "creeps.png"
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
        weapons : [
                ]
    },

    initialize: function(){
        this.currentPage = -1;
        for(var template in Intro.templates){
          Intro.send(template);
	      }
        Intro.next();
    },
    
    send: function(template){
        new Ajax.Request(Intro.templates[template][0], {method:'get',
	            onComplete: function(t){
		      		  Intro.templates[template][1] = TrimPath.parseTemplate(t.responseText) 
			      }
	      })
    },
  
    pages : {
        levelSelection : {
            onSelect : function() {
                ImageLoader.load(Intro.images.levelSelection, Intro.images.path, function(){}, Intro.show);
            }
        },
        cityInfo : {
            onSelect : function(){
                new Ajax.Request('challenges/' + GameConfigs.campaign + "/city.info" ,
                                    {method:'get', 
                                        onComplete: function(t, json){
                                            ChallengeSelector.mission = JSON.parse(t.responseText);
                                            images = []
                                            Intro.images.cityInfo.each(function(image){ images.push( Intro.images.path + image) });
                                            images.push("challenges/"+GameConfigs.campaign+"/images/city.png");
                                            images.push("challenges/"+GameConfigs.campaign+"/images/map.png");   
                                            for (var creep in CreepConfig)
                                            {
                                                images.push( Intro.images.path + "creeps/" + CreepConfig[creep]['image']);
                                            }    
                                            console.log(ChallengeSelector.mission)
                                            ImageLoader.load (images, "",
                                                              function(){},
                                                              function() {
                                                                   console.log("hiiiiiii")
                                                                   $('cityInfo').innerHTML = Intro.templates.cityInfo[1].process({ 
                                                                                                    "city" : ChallengeSelector.mission,
                                                                                                    "path" : GameConfigs.campaign,
                                                                                                    "creepConfig" : CreepConfig }); 
                                                                   console.log("hiiiiiii")
                                                                   Intro.creepsCarousel = new Carousel("creeps-scroll");
                                                                   Intro.creepsCarousel.displayCount = 4;
                                                                   Intro.show();
                                                              })
                            	          }
                    	              })
            },
            setFloatBgInfo : function(element){
                  $$("#cityInfo #floatBg div span")[0].innerHTML = CreepConfig[element.getAttribute("creepid")].name;
                  $$("#cityInfo #floatBg div span")[1].innerHTML = CreepConfig[element.getAttribute("creepid")].desc;  
//                  $$("#cityInfo #floatBg div img")[0].src = Intro.images.path + "creeps/" + 
//                                                                  CreepConfig[element.getAttribute("creepid")].skelaton;    
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
                                        "towers" : { "Cannon1" : 1, "Cannon2" : 1, "Rocket" : 1}, "weapons" : ["Nuck"] }
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
                                      console.log("hiiiiiii")
                                      $('towers').innerHTML = Intro.templates.towers[1].process({ 
                                                                        "data" : data,
                                                                        "towerConfig" : TowerConfig }); 
                                      console.log("hiiiiiii")
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
        weapons : {
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
                $('marketPlace').show();
                Intro.show();
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
        $("intro").style['curspr'] = 'auto';
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
	  }
	
}


