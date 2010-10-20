
FBDefender={imagesUrl:'http://studio.nezal.com:5500/fb-games/city-defender/images/',gameName:function(){return Text.gameName;},isMarket:false,onPublishSuccess:function(){new Ajax.Request('users/coins',{method:'post',parameters:{'coins':5},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.userData.coins=data['user_data'].coins;if(Intro.currentPage==Intro.pages['marketPlace'].index&&FBDefender.isMarket==true)
Intro.select('marketPlace');}});},publishMissionCompletion:function(mission){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.completeMession[0]+" "+
mission.name.toUpperCase()+" "+Text.facebook.completeMession[1]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/medal.png','href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.completeMession[2]+" "+
mission.score+Text.facebook.completeMession[3]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishCampaignCompletion:function(campaign){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.completeCampaign[0]+" "+
campaign.name.toUpperCase()+" "+Text.facebook.completeCampaign[1]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/medal.png','href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.completeCampaign[2]+" "+
campaign.name.toUpperCase()+" "+Text.facebook.completeCampaign[3]+" "+
campaign.score+" "+Text.facebook.completeCampaign[4]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishRankPromotion:function(info){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.rankPromotion[0]+" "+
Text.game.ranks[info.name]['name']+" "+Text.facebook.rankPromotion[1]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/ranks/'+info.image,'href':loc}],caption:Text.facebook.rankPromotion[2]+" "+
FBDefender.gameName()+", "+
FBConnect.user.first_name+" "+Text.facebook.rankPromotion[3]+" "+
Text.game.ranks[info.name]['name']+" "+Text.facebook.rankPromotion[4]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishUnlockedItem:function(info){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.unlockItem[0]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.unlockItem[1]+" "+FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+info.image,'href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.unlockItem[2]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.unlockItem[3]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=true;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishUpgradedItem:function(info){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.upgradeItem[0]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.upgradeItem[1]+" "+FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+info.image,'href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.upgradeItem[2]+" "+
Text.intro[info.type][info.name]['name']+" "+Text[info.type]+" "+Text.facebook.upgradeItem[3]};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=true;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});},publishCampaignRanking:function(info){FBConnect.getUserInfo(function(){var loc="http://apps.facebook.com/"+FBConnect.url()+"/";var attachment={name:FBConnect.user.first_name+" "+Text.facebook.campaignRanking[0]+" "+
info.ranking+" "+Text.facebook.campaignRanking[1]+" "+
info.rankingGlobal+" "+Text.facebook.campaignRanking[2]+" "+" "+Text.facebook.campaignRanking[3]+" "+
FBDefender.gameName(),href:loc,'media':[{'type':'image','src':FBDefender.imagesUrl+'facebook/medal.png','href':loc}],caption:FBConnect.user.first_name+" "+Text.facebook.campaignRanking[4]+" "+
info.ranking+" "+Text.facebook.campaignRanking[5]+" "+
info.rankingGlobal+" "+Text.facebook.campaignRanking[6]+" "+
info.campaignName.toUpperCase()+" "+Text.facebook.campaignRanking[6]+" "};var actionLinks=[{text:FBDefender.gameName(),href:loc}];FBDefender.isMarket=false;FBConnect.publish(attachment,Text.facebook.userPrompt,actionLinks,FBDefender.onPublishSuccess)});}}
var CreepConfig={"BlackTank":{image:'black_tank.png',skeleton:'black_tank_skeleton.png'},"RedTank":{image:'red_tank.png',skeleton:'red_tank_skeleton.png'},"Tank":{image:'tank.png',skeleton:'tank_skeleton.png'},"TankI":{image:'tank_i.png',skeleton:'tank_i_skeleton.png'},"TankII":{image:'tank_ii.png',skeleton:'tank_ii_skeleton.png'},"Humvee":{image:'humvee.png',skeleton:'humvee_skeleton.png'},"RedPlane":{image:'red_plane.png',skeleton:'red_plane_skeleton.png'},"Plane":{image:'plane.png',skeleton:'plane_skeleton.png'}}
var TowerConfig={"Belcher":{name:'Belcher',image:'belecher.png',smallImage:'belecher_small.png',skeleton:'belecher_skeleton.png',desc:"Belcher, a fast machine gun tower, it has small range nozzle,"+" and can be used to counter both air and ground units."+" It uses bullets as its main ammunition and doesn't have any detection mechanism, but it will fire on sight."},"Reaper":{name:'Reaper',image:'reaper.png',smallImage:'reaper_small.png',skeleton:'reaper_skeleton.png',desc:"Reaper, an upgraded version of the Belcher machine gun tower,"+" it has two nozzles which enable it to attack with a higher rate than the Belcher."+" It is more effective than the Belcher as it secures more fire power against any hostile activities."},"Patriot":{name:'Patriot',image:'patriot.png',smallImage:'patriot_small.png',skeleton:'patriot_skeleton.png',desc:"Patriot , a long-range, all-altitude, surface-to-air missile (SAM) launcher."+" This air defense system is used to counter advanced aircraft."+" It uses an advanced aerial interceptor missiles and high performance radar systems to destroy its target."},"Exploder":{name:'Exploder',image:'exploder.png',smallImage:'exploder_small.png',skeleton:'exploder_skeleton.png',desc:"Exploder, a tactical surface-to-surface missile (SSM) launcher,"+" Its major use is as a general bombardment weapon to counter heavy land units."+" It has a radar system for detecting its targets to destroy them."}}
var SuperWeaponConfig={"Splash":{name:"Splash",image:'splash.png',skeleton:'splash.png',desc:"Sends up to 10 rockets that targets biggest 10 enemy units, each deal 2000 damage. Can be used 10 times."},"Weak":{name:"Weak",image:'weak.png',skeleton:'weak.png',desc:"Reduces all units' health point by 10% per second. Lasts for 10 seconds. Can be used 10 times."},"Hyper":{name:"Hyper",image:'hyper.png',skeleton:'hyper.png',desc:"Doubles the attack speed of all your towers. Lasts for 30 seconds. Can be used 10 times."},"Nuke":{name:"Nuke",image:'nuke.png',skeleton:'nuke.png',desc:"Call the nuke bomb to destroy all units on the map. Can be used 5 times."},"Heal":{name:"Heal",image:'heal.png',skeleton:'heal.png',desc:"Restores all your towers' full health point . Can be used 10 times."}}
var UpgradeConfig={"Bullets":{name:"Bullets",image:'upgrade1.png',smallImage:'upgrade1.png',skeleton:'upgrade1.png',desc:"Increases attack speed of all bullets towers by 50%."},"Rockets":{name:"Rockets",image:'upgrade2.png',smallImage:'upgrade2.png',skeleton:'upgrade2.png',desc:"Increases attack speed of all rocket towers by 50%."},"Shields":{name:"Shields",image:'upgrade3.png',smallImage:'upgrade3.png',skeleton:'upgrade3.png',desc:"Increases the health point of all towers by 50% and restores towers' full health point."}}
var ChallengeSelector={challenges:[],selected:0,list:function(element){$(Intro.pages[Intro.currentPage]).style['cursor']="progress"
element.style['cursor']="progress"
new Ajax.Request('challenges',{method:'get',onComplete:function(t,json){ChallengeSelector.challenges=JSON.parse(t.responseText);$('challenges').innerHTML=Intro.templates.challenges[1].process({"challenges":ChallengeSelector.challenges});Intro.next();}})},select:function(challenge,callback){new Ajax.Request('challenges'+challenge+"/city.info",{method:'get',onComplete:function(t,json){ChallengeSelector.city=JSON.parse(t.responseText);$('cityInfo').innerHTML=Intro.templates.cityInfo[1].process({"city":ChallengeSelector.city,"path":challenge});callback();}})}}
var GameConfigs={level:0,campaign:'tunisia',missionPath:'cairo',mapImage:'',waves:[],map:[],mapEntry:[],towers:[],superWeapons:[],upgrades:[],weaponsPackage:{},language:'arabic'}
var ResourceLoader=Class.create({resources:null,loadedCount:0,addResource:function(resource)
{if(!this.resources)
{this.resources=new Hash();}
if(!this.resources.get(resource))
{this.resources.set(resource,null);}},resetResource:function(resource)
{this.resources.set(resource,null);},load:function(callback,errorCallback)
{var self=this;this.resources.each(function(resource){if(!resource[1])
{new Ajax.Request(resource[0],{method:'get',onSuccess:function(t){self.resources.set(resource[0],t.responseText);self.loadedCount++;if(self.loadedCount==self.resources.keys().length)
{self.loadedCount=0;callback();}},onFailure:function(){if(errorCallback)
errorCallback();}});}else{self.loadedCount++;if(self.loadedCount==self.resources.keys().length)
{self.loadedCount=0;callback();}}});}})
var Config=GameConfigs;var PathConfigs={introTemplate:"templates/intro/intro.tpl",gameTemplate:"templates/game.tpl"}
var Intro={dirty:false,currentPage:-1,nextPageIndex:0,campLoader:new ResourceLoader(),missionLoader:new ResourceLoader(),sequence:["levelSelection","campaign","mission","marketPlace"],templates:{challenges:["challengesTemplate",0],levelSelection:["levelSelectionTemplate",0],campaign:["campaignTemplate",0],mission:["missionTemplate",0],marketPlace:["marketItemsTemplate",0],marketplaceItem:["marketItemDetailsTemplate",0],marketScroll:["marketScrollerTemplate",0]},initialize:function(){this.currentPage=-1;Intro.retrieveTemplates();},start:function(){if(Intro.doneLoading&&Loader.doneLoading)Intro.next();},retrieveTemplates:function(){var loader=new ResourceLoader();loader.addResource(PathConfigs.introTemplate);loader.addResource(PathConfigs.gameTemplate);loader.addResource('metadata');loader.load(function(){$('introTemplates').innerHTML=loader.resources.get(PathConfigs.introTemplate);for(var template in Intro.templates){Intro.templates[template][1]=TrimPath.parseDOMTemplate(Intro.templates[template][0]);}
$("gameStart").innerHTML=Intro.templates['game']=loader.resources.get(PathConfigs.gameTemplate);var data=JSON.parse(loader.resources.get('metadata'));GameConfigs.campaign=data['game_data']['current_campaign'];Intro.gameData=JSON.parse(data['game_data']['metadata']);for(var i in Intro.gameData.towers)
{Intro.gameData.towers[i].upgrades=JSON.parse(Intro.gameData.towers[i].upgrades);}
for(var i in Intro.gameData.weapons)
{Intro.gameData.weapons[i].upgrades=JSON.parse(Intro.gameData.weapons[i].upgrades);}
Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);Intro.ranks=data['ranks'];Loader.loadPage(GameConfigs.campaign,function(){Intro.doneLoading=true;Intro.start();});});},retrieveData:function(callback){new Ajax.Request('metadata',{method:'get',onSuccess:function(t){var data=JSON.parse(t.responseText);Intro.gameData=JSON.parse(data['game_data']['metadata']);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);Intro.ranks=data['ranks'];callback();}});},campPath:function(){return"challenges/"+GameConfigs.campaign+"/"+GameConfigs.language;},missionPath:function(){return"/"+GameConfigs.missionPath;},toLabels:function(hash,labelsHash){for(i in hash)
{labelsHash[i]=[];for(j in hash[i])
{labelsHash[i].push(hash[i][j]['name']);}}},pages:{levelSelection:{index:0,onSelect:function(){var loader=new ResourceLoader();Language.getLanguage(Intro.userData.locale,function(){GameConfigs.language=Language.userLanguage;loader.addResource('js/game/languages/'+GameConfigs.language+'.js');loader.load(function(){eval(loader.resources.get('js/game/languages/'+GameConfigs.language+'.js'));if(GameConfigs.language=="arabic")
$('intro').style['direction']='rtl';else
$('intro').style['direction']='ltr';$('levelSelection').innerHTML=Intro.templates.levelSelection[1].process();if(Intro.userData.newbie)
{Intro.displayTutorial();Intro.disablePauseScreen();}else{Intro.show();}});});}},campaign:{index:1,onSelect:function(){var loader=Intro.campLoader;var campInfoPath=Intro.campPath()+"/camp.info";var campMetadata=GameConfigs.campaign+"/metadata";loader.addResource(campInfoPath);loader.addResource(campMetadata);loader.load(function(){Intro.campaignData=JSON.parse(loader.resources.get(campMetadata));Intro.campaignData.campaignInfo=JSON.parse(loader.resources.get(campInfoPath));Intro.campaignData.missionsInfo={};loader.resetResource(campMetadata);var missionLoader=Intro.missionLoader;Intro.campaignData.camp_data.metadata.each(function(mission){var missionPath=Intro.campPath()+"/"+mission['path']+"/mission.info";missionLoader.addResource(missionPath);});missionLoader.load(function(){Intro.campaignData.camp_data.metadata.each(function(mission){var missionPath=Intro.campPath()+"/"+mission['path']+"/mission.info";Intro.campaignData.missionsInfo[mission['path']]=JSON.parse(missionLoader.resources.get(missionPath));});$('campaign').innerHTML=Intro.templates.campaign[1].process({"camp":Intro.campaignData.campaignInfo});Intro.show();$('intro').show();$('gameStart').hide();});});}},mission:{index:2,onSelect:function(){var creepInfo=[];Intro.setupGameConfigs();GameConfigs['waves'].each(function(element){for(var i=0;i<element.length;i++)
{creepInfo=creepInfo.concat([element[i]['category']]);}})
var missionCreeps=creepInfo.uniq();var loader=Intro.missionLoader;var missionPath=Intro.campPath()+Intro.missionPath()+"/mission.info";loader.addResource(missionPath)
loader.load(function(){var mission=JSON.parse(loader.resources.get(missionPath));mission.creeps=missionCreeps;$('mission').innerHTML=Intro.templates.mission[1].process({"city":mission,"path":Intro.missionPath(),"creepConfig":CreepConfig});var images={'left':Loader.images.intro['mission/carousel/left.png'].src,'left-disabled':Loader.images.intro['mission/carousel/left-disabled.png'].src,'right':Loader.images.intro['mission/carousel/right.png'].src,'right-disabled':Loader.images.intro['mission/carousel/right-disabled.png'].src};Intro.creepsCarousel=new Carousel("creeps-scroll",images,4);Intro.show();});},setFloatBgInfo:function(element){$$("#mission #floatBg div span")[0].innerHTML=Text.intro.creeps[element.getAttribute("creepid")].name;$$("#mission #floatBg div span")[1].innerHTML=Text.intro.creeps[element.getAttribute("creepid")].desc;$$("#mission #floatBg .skeleton img")[0].src=Loader.images.intro["creeps/"+
CreepConfig[element.getAttribute("creepid")].skeleton].src;}},marketPlace:{index:3,emptySpots:5,onSelect:function(){var gameData=[];Intro.toLabels(Intro.gameData,gameData)
data={"gameData":gameData,"userData":Intro.userData,"name":'towers'};data["gameData"]["empty"]={};data["userData"]["empty"]={};data["gameData"]["empty"]["towers"]=$A($R(0,5-data["gameData"]["towers"].length-1));data["gameData"]["empty"]["weapons"]=$A($R(0,5-data["gameData"]["weapons"].length-1));$('marketPlace').innerHTML=Intro.templates.marketPlace[1].process({"type":"towers","data":data});$('weaponsDisplay').innerHTML=Intro.templates.marketScroll[1].process({"type":"weapons","data":data,"itemConfig":SuperWeaponConfig});$('towersDisplay').innerHTML=Intro.templates.marketScroll[1].process({"type":"towers","data":data,"itemConfig":TowerConfig});var images={'left':Loader.images.intro['market/carousel/left.png'].src,'left-disabled':Loader.images.intro['market/carousel/left-disabled.png'].src,'right':Loader.images.intro['market/carousel/right.png'].src,'right-disabled':Loader.images.intro['market/carousel/right-disabled.png'].src};Intro.weaponsCarousel=new Carousel("weapons-scroll",images,5);Intro.towersCarousel=new Carousel("towers-scroll",images,5);Intro.show();},setFloatBgInfo:function(element){var id=element.getAttribute('itemid');var type=element.getAttribute('type');var upgrade=element.getAttribute('upgrade');var itemConfig=TowerConfig;if(type=="weapons")
{itemConfig=SuperWeaponConfig;}
var item_rank;var cost=Intro.gameData[type][id].cost;var exp=Intro.gameData[type][id].exp;var currUpgrade=0;if(upgrade)
{cost=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['cost'];exp=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp'];upgrade=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']];currUpgrade=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']-1];for(var rank in Intro.ranks)
{if((Intro.ranks[rank][0]<=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp'])&&(Intro.ranks[rank][1]>=Intro.gameData[type][id].upgrades[Intro.userData.metadata[type][id]['upgrades']]['exp']))
{item_rank=rank;break;}}}else{for(var rank in Intro.ranks)
{if(Intro.ranks[rank][0]<=Intro.gameData[type][id].exp&&Intro.ranks[rank][1]>=Intro.gameData[type][id].exp)
{item_rank=rank;break;}}}
var data={'coins':Intro.userData.coins,'exp':Intro.userData.exp,'configs':itemConfig,'itemid':id,'type':type,'upgrade':upgrade,'currUpgrade':currUpgrade,'cost':cost,'rank':[exp,item_rank]}
$$("#marketPlace #floatBg")[0].innerHTML=Intro.templates['marketplaceItem'][1].process({"data":data});$$('#marketPlace #floatBg .clickSound').each(function(element){element.observe('click',function(){Sounds.play(Sounds.gameSounds.click)})})}}},selectLanguage:function(element)
{var lang=element.getAttribute('language')
Intro.enablePauseScreen();Language.select(lang,function(){Intro.userData.locale=Language.userLanguage;Intro.select('levelSelection')});},selectMission:function(element){GameConfigs.missionPath=element.getAttribute('path');},unlockItem:function(element){var type=element.getAttribute('type');var itemid=element.getAttribute('itemid');if(Intro.userData.coins>=parseInt(Intro.gameData[type][itemid]['cost'])&&Intro.userData.exp>=parseInt(Intro.gameData[type][itemid]['exp']))
{Intro.enablePauseScreen();new Ajax.Request('metadata',{method:'post',parameters:{'data':Object.toJSON({'type':type,'item_id':itemid,'event':'unlock'})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);var typeName='towers';var itemConfig=TowerConfig;if(type=="weapons")
{itemConfig=SuperWeaponConfig;typeName="superWeapons";}
FBDefender.publishUnlockedItem({name:itemid,image:'intro/'+type+"/"+itemConfig[itemid]['image'],mission:Intro.campaignData.missionsInfo[GameConfigs.missionPath]['name'],type:typeName})
Intro.select('marketPlace');Intro.disablePauseScreen();}});}else{}},upgradeItem:function(element){var type=element.getAttribute('type');var itemid=element.getAttribute('itemid');var cost=Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['cost'];var exp=Intro.gameData[type][itemid].upgrades[Intro.userData.metadata[type][itemid]['upgrades']]['exp'];if(Intro.userData.coins>=cost&&Intro.userData.exp>=exp)
{Intro.enablePauseScreen();new Ajax.Request('metadata',{method:'post',parameters:{'data':Object.toJSON({'type':type,'item_id':itemid,'event':'upgrade'})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.userData=data['user_data'];Intro.userData["metadata"]=JSON.parse(data['user_data']['metadata']);var typeName='towers';var itemConfig=TowerConfig;if(type=="weapons")
{itemConfig=SuperWeaponConfig;typeName="superWeapons";}
FBDefender.publishUpgradedItem({name:itemid,image:'intro/'+type+"/"+itemConfig[itemid]['image'],mission:Intro.campaignData.missionsInfo[GameConfigs.missionPath]['name'],type:typeName})
Intro.select('marketPlace');Intro.disablePauseScreen();}});}else{}},sendScore:function(score,win,callback){if(!weapons)
weapons={}
new Ajax.Request(GameConfigs.campaign+"/metadata",{method:'post',parameters:{'data':Object.toJSON({'mission':GameConfigs.mission.order,'win':win,'score':score})},onSuccess:function(t,json){var data=JSON.parse(t.responseText);Intro.campaignData.user_data.metadata=data['user_data']['metadata'];Intro.userData.rank=data['user_data'].rank;Intro.userData.exp=data['user_data'].exp;Intro.setupGameConfigs();callback();}});},newbieNoMore:function(){new Ajax.Request('users/newbie',{method:'post',onSuccess:function(t,json){Intro.userData.newbie=false;data=JSON.parse(t.responseText);Intro.userData.exp=data['user_data']['exp'];var oldRank=Intro.userData.rank;Intro.userData.rank=data['user_data']['rank'];Intro.show();$("intro").show();$('gameStart').hide();if(oldRank!=Intro.userData.rank)
FBDefender.publishRankPromotion({name:Intro.userData.rank,image:"fb-"+Intro.userData.rank+'.png'});}});},setupGameConfigs:function(){var missions=Intro.campaignData.camp_data.metadata
var mission=missions.find(function(mission){if(GameConfigs.missionPath==mission['path'])return true;})
GameConfigs.mission=mission;var map=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['map'];var mapFlipped=[];for(var i=0;i<map[0].length;i++)
{mapFlipped[i]=[];}
for(var i=0;i<map.length;i++)
{for(var j=0;j<map[i].length;j++)
{mapFlipped[j][i]=map[i][j];}}
var towers=[],towerUpgrades={};for(var j in Intro.userData.metadata.towers)
{towers.push(j);towerUpgrades[j]=Intro.userData.metadata.towers[j]['upgrades'];}
var weapons=[],weaponUpgrades={};for(var j in Intro.userData.metadata.weapons)
{weapons.push(j);weaponUpgrades[j]=Intro.userData.metadata.weapons[j]['upgrades'];}
GameConfigs.map=mapFlipped;GameConfigs.mapEntry=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['mapEntry'];GameConfigs.mapImage='challenges/'+GameConfigs.campaign+'/images'+Intro.missionPath()+'/path.png';GameConfigs.waves=Intro.campaignData.user_data.metadata.missions[mission['order']-1]['waves'];GameConfigs.towers=towers;GameConfigs.towerUpgrades=towerUpgrades;GameConfigs.weaponUpgrades=weaponUpgrades;GameConfigs.superWeapons=weapons;GameConfigs.rank=Intro.userData.rank;GameConfigs.exp=Intro.userData.exp;},showFloatBg:function(element){Intro.pages[Intro.sequence[Intro.currentPage]].setFloatBgInfo(element);$$("#"+Intro.sequence[Intro.currentPage]+" #"+"floatBg")[0].show();},hideFloatBg:function(){$$("#"+Intro.sequence[Intro.currentPage]+" #"+"floatBg")[0].hide();},enablePauseScreen:function(){$('pause').show()},disablePauseScreen:function(){$('pause').hide()},displayTutorial:function(){Intro.userData.newbie=true;city_defender_start();$('gameStart').show();$("intro").hide();onFinish()},show:function(){$$('.clickSound').each(function(element){element.observe('click',function(element){Sounds.play(Sounds.gameSounds.click)})})
window.setTimeout(Intro.display,200);},display:function(){Intro.disablePauseScreen();if(Intro.currentPage>=0){$(Intro.sequence[Intro.currentPage]).hide();}
Intro.currentPage=Intro.nextPageIndex;$(Intro.sequence[Intro.currentPage]).style['display']="block";$("intro").style['cursor']='auto';},next:function(current){Intro.disabled=false;Intro.enablePauseScreen();Intro.nextPageIndex=Intro.currentPage+1;var callback=function(){if(Intro.nextPageIndex==Intro.sequence.length)
Intro.finish();else{Intro.pages[Intro.sequence[Intro.currentPage+1]].onSelect();}}
callback();},previous:function(current){Intro.disabled=false;Intro.enablePauseScreen();Intro.nextPageIndex=Intro.currentPage-1;var callback=function(){Intro.pages[Intro.sequence[Intro.currentPage-1]].onSelect();}
callback();},select:function(page){Intro.disabled=false;Intro.enablePauseScreen();var index=Intro.pages[page].index
Intro.nextPageIndex=index;$("intro").style['curspr']='progress';var callback=function(){Intro.pages[Intro.sequence[index]].onSelect();}
callback();},replay:function(){Intro.select('campaign');},finish:function(){Intro.setupGameConfigs();city_defender_start();Intro.disablePauseScreen();$('gameStart').show();$("intro").hide();onFinish()}}
var Baloon=Class.create(Sprite,{x:0,y:0,initialize:function(num){this.parent=$('gameElements');this.div=document.createElement('div');this.div.setOpacity(0.7)
var divIdName='baloon';this.div.setAttribute('id',divIdName);this.div.style.position='absolute';var img=Element.clone(Loader.images.game["baloon"+num+".png"]);this.text=document.createElement("div");this.text.style.position="absolute"
this.text.style.fontSize="11"
this.text.style.fontWeight="bold"
this.text.style.paddingTop="2"
this.text.style.textAlign="center"
img.style.position="relative"
this.text.style.top=5;this.text.style.left=3
img.style.top=0;img.style.left=0
this.div.appendChild(img)
this.div.appendChild(this.text)
this.parent.appendChild(this.div);},render:function(ctx){this.div.style.left=this.x
this.div.style.top=this.y},destroy:function($super){$super()
if(this.div)
this.parent.removeChild(this.div)}})
var Sounds={turret:{fire:[],reload:[],rocketPrepare:[],rocketLaunch:[],patriotLaunch:[]},doubleTurret:{fire:[]},boom:{unit:[]},plane:{move:[]},superWeapons:{weak:[],heal:[],nuke:[],hyper:[]},gameSounds:{},channels:[],maxChannels:10,mute:function(){soundManager.mute()
$$('.sound').first().stopObserving('click')
$$('.sound').first().removeClassName('on')
$$('.sound').first().addClassName('off')
$$('.sound').first().observe('click',Sounds.soundOn)},soundOn:function(){soundManager.unmute()
$$('.sound').first().stopObserving('click')
$$('.sound').first().removeClassName('off')
$$('.sound').first().addClassName('on')
$$('.sound').first().observe('click',Sounds.mute)},garbageCollect:function(){newChannels=[]
time=new Date
Sounds.channels.each(function(sound){if(sound[0][0].duration<=time-sound[1]){sound[0][2]--}else{newChannels.push(sound)}})
Sounds.channels=newChannels},play:function(store,direct){if(direct){store[0].play()
return}else{this.garbageCollect();if(Sounds.channels.length>=Sounds.channelsMax){return}else if(store[2]>=store[1]){return}else{Sounds.channels.push([store,new Date])
store[2]++
store[0].play()}}},checkFinishedAudio:function(){var notFinished=[]
Sounds.channels.each(function(channel){if(channel.audio.ended){channel.audio.load()
channel.store.push(channel.audio)}else{notFinished.push(channel)}})
Sounds.channels=notFinished},path:function(){return'sounds/sfx/'},format:'mp3'}
var soundNames=['accept','pause','wash','add_item','plane','add_money','rank_promotion','win','lose','reject','wrong_tower','click','correct_tower']
function createSounds(){createAudioElements(5,Sounds.turret.fire,"bullet")
createAudioElements(5,Sounds.turret.rocketLaunch,"rocket");createAudioElements(5,Sounds.turret.patriotLaunch,"patriot");createAudioElements(5,Sounds.boom.unit,"explosion")
createAudioElements(1,Sounds.superWeapons.heal,"heal")
createAudioElements(1,Sounds.superWeapons.hyper,"hyper")
createAudioElements(1,Sounds.superWeapons.nuke,"nuke")
createAudioElements(1,Sounds.superWeapons.weak,"weak")
for(var i=0;i<soundNames.size();i++){Sounds.gameSounds[soundNames[i]]=[]
createAudioElements(3,Sounds.gameSounds[soundNames[i]],soundNames[i])}}
function createAudioElements(count,store,url){if(!store)store=[]
var sound=soundManager.createSound({id:url,url:'sounds/sfx/mp3/'+url+'.mp3',autoLoad:true,autoPlay:false,volume:50});store.push(sound)
store.push(count)
store.push(0)}
soundManager.onready(function(){if(soundManager.supported()){createSounds()}});var Loader={callbacks:{},initialize:function(){this.toLoad=["animations.html","intro.html","user.html","background.html","game.html","english.html","arabic.html","french.html"]},notify:function(win,resources){for(var i=0;i<resources.length-1;i++){var image=new Image
var resource=resources[i]
var id=resource[0]
var parts=id.split('#')
if(!Loader[parts[0]][parts[1]])Loader[parts[0]][parts[1]]={}
image.setAttribute('data',resource[1])
image.src=resource[1]
Loader[parts[0]][parts[1]][parts[2]]=image;}
if(this.index==this.toLoad.length-1){this.index++
if(development){city_defender_start()
onFinish()}else{Loader.doneLoading=true;Intro.start();}}else if(this.index<this.toLoad.length-1){var found=false
this.toLoad.each(function(url){if(win.document.URL.indexOf(url.split('?')[0])>=0){found=true}})
if(found){this.index++
window.setTimeout(function(){$('iframe').src=Loader.toLoad[Loader.index]},100)}}
var callbackKey=win.document.URL.split('/').pop();if(this.callbacks[callbackKey]){this.callbacks[callbackKey]();this.callbacks[callbackKey]=null;}},loadPage:function(page,callback){this.callbacks[page+".html"]=callback;$('pages').src="html_resources/"+page+".html"}}
Loader.initialize()
Loader.images={}
Loader.sounds={}
Loader.animations={}
Loader.challenges={}
Loader.resourceTypes=['images','sounds','animations']
Loader.index=0
var HealthSprite=Class.create(Sprite,{layer:null,initialize:function(hp,maxHp){this.hp=hp
this.maxHp=maxHp},render:function(ctx){if(!this.visible)return
ctx.save()
if(this.rotation!=0){ctx.rotate(this.rotation)}
ctx.translate(Math.round(this.x),Math.round(this.y))
ctx.fillStyle='red'
ctx.fillRect(-16,-22,32,3)
ctx.fillStyle='green'
ctx.fillRect(-16,-22,32*this.hp/this.maxHp,3)
ctx.restore()}})
var CompositeUnitSprite=Class.create(Sprite,{rotation:0,visible:true,layer:null,cannonRotation:0,initialize:function(images,hp,maxHp,properties){this.healthSprite=new HealthSprite(hp,maxHp)
this.maxHp=maxHp
this.hp=hp
Object.extend(this,properties)
this.images=images;},setHp:function(hp){this.hp=hp},render:function(ctx){try{ctx.save();ctx.translate(Math.round(this.x),Math.round(this.y))
ctx.rotate(Math.PI/180*this.rotation)
ctx.drawImage(this.images.base,-48,-16)
ctx.fillStyle='red'
ctx.fillRect(-22,10,3,-20)
ctx.fillStyle='green'
ctx.fillRect(-22,10,3,-20*this.hp/this.maxHp)
ctx.translate(-4,0)
ctx.rotate(Math.PI/180*this.cannonRotation)
if(this.currentFrame==0)ctx.drawImage(this.images.cannon,-44,-16)
else ctx.drawImage(this.images.fire,-44,-16)
ctx.restore();}catch(e){console.log(e)}},destroy:function($super){this.healthSprite.destroy()
$super()}})
var CityDefenderScene=Class.create(Scene,{fistCreep:false,startGame:false,firstHit:false,nukeCount:2,healCount:2,weakCount:2,splashCount:2,hyperCount:2,promoted:true,initialize:function($super,config,delay,baseCtx,upperCtx){this.creeps=[]
this.turrets=[]
this.objects=[]
this.towerMutators=[]
this.creepMutators=[]
this.animations=[]
this.rockets=[]
this.events=[]
this.selectedTower=null
this.stats={towersCreated:0,towersDestroyed:0,creepsDestroyed:0}
this.waveNumber=1
$super(delay);this.config=Nezal.clone_obj(config)
this.usedWeapons={}
var self=this;this.config.superWeapons.each(function(weapon){self.usedWeapons[weapon.capitalize()]=0;});this.exp=this.config.exp
this.wavesCount=this.config.waves.length
if(!development){this.minExp=Intro.ranks[this.config.rank][0]
this.maxExp=Intro.ranks[this.config.rank][1]}else{this.minExp=this.maxExp=0}
this.baseCtx=baseCtx;this.upperCtx=upperCtx;this.scenario=new Scenario(this)
this.scenario.start()
this.nuke=new Nuke(this,{count:2,type:'nuke'})
this.heal=new Heal(this,{count:2,type:'heal'})
this.weak=new Weak(this,{count:2,type:'weak'})
this.splash=new Splash(this,{count:2,type:'splash'})
this.hyper=new Hyper(this,{count:2,type:'hyper'})
this.templates={}
this.templates['towerInfo']=TrimPath.parseTemplate($('towerInfoTemplate').value)
this.templates['stats']=TrimPath.parseTemplate($('statsTemplate').value)
IncomingWaves.init("container","wavesTemplate","incomingWaves",this.reactor)},init:function(){this.rank=Config.rank
this.skipFrames=0
this.creepsLayer=new Layer(this.upperCtx);this.creepsLayer.clear=true
this.layers.push(this.creepsLayer);this.basesLayer=new Layer(this.baseCtx)
this.rangesLayer=new Layer(this.baseCtx)
this.rangesLayer.clear=true
this.towerCannonLayer=new Layer(this.upperCtx)
this.rocketsLayer=new Layer(this.upperCtx)
this.towerHealthLayer=new Layer(this.upperCtx)
this.rankLayer=new Layer(this.upperCtx)
this.layers.push(this.rangesLayer)
this.layers.push(this.basesLayer)
this.layers.push(this.towerCannonLayer)
this.layers.push(this.towerHealthLayer)
this.layers.push(this.rocketsLayer)
this.layers.push(this.rankLayer)
var self=this
this.config.superWeapons.each(function(weapon){weapon=weapon.toLowerCase()
var div=$$('#gameElements .superWeapons div.'+weapon)[0].setOpacity(1)})
this.renderData()
this.checkStatus()
return this},addTurret:function(turret){this.towerMutators.each(function(mutator){mutator.action(turret)})
this.turrets.push(turret)
Map.grid[turret.gridX][turret.gridY].tower=turret
this.rangesLayer.attach(turret.rangeSprite)
this.basesLayer.attach(turret.baseSprite)
this.towerCannonLayer.attach(turret.cannonSprite)
this.towerHealthLayer.attach(turret.healthSprite)
if(turret.rocketSprite)this.towerHealthLayer.attach(turret.rocketSprite)
this.rankLayer.attach(turret.rankSprite)
return this},addCreep:function(creep){creep.range+=1
creep.maxHp=creep.maxHp/2
creep.hp=creep.maxHp
creep.price=creep.price+0.25*this.waveNumber
this.scenario.notify({name:"creepEntered",method:false,unit:creep})
if(this.turrets[0])this.scenario.notify({name:"creepEnteredTower",method:false,unit:this.turrets[0]})
creep.hp=Math.round(creep.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
creep.power=Math.round(creep.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
creep.maxHp=creep.hp
if(creep){if(!this.firstCreep){this.firstCreep=true}
this.creepsLayer.attach(creep.sprite)
this.creeps.push(creep)}
return this},addPlane:function(plane){plane.range+=1
plane.maxHp=plane.maxHp/2
plane.hp=plane.maxHp
plane.price=plane.price+0.25*this.waveNumber
plane.hp=Math.round(plane.hp*Math.pow(this.creepMultiplier[this.config.level-1],this.waveNumber))
plane.power=Math.round(plane.power*Math.pow(this.creepPowerMultiplier[this.config.level-1],this.waveNumber))
plane.maxHp=plane.hp
if(plane){this.rocketsLayer.attach(plane.shadowSprite);this.rocketsLayer.attach(plane.cannonSprite);this.rocketsLayer.attach(plane.healthSprite);this.creeps.push(plane)}
return this},render:function($super){if(this.skipFrames==0){var startTime=new Date
$super()
if(GhostTurret&&GhostTurret.selected&&GhostTurret.isIn){GhostTurret.render(this.upperCtx)}
var delay=new Date-startTime
this.fps=Math.round(1000/(delay))
if(delay>this.delay){this.skipFrames=Math.ceil(delay/this.delay)}}else{this.skipFrames--;}},renderData:function(){this.currentExp=Math.round(this.exp+this.score/50)
if(this.currentExp>this.maxExp){this.minExp=this.maxExp
this.maxExp=this.maxExp*2}
$('statusBarFill').style.width=((this.currentExp-this.minExp)/(this.maxExp-this.minExp))*100+"%"
$('money').innerHTML=this.money;$('lives').innerHTML="Lives "+Math.max(this.maxEscaped-this.escaped,0);$('score').innerHTML="Score "+this.score;var self=this
$('waves').innerHTML="Wave "+this.wave+'/'+this.wavesCount;$('towerInfo').show()
$('towerInfo').innerHTML=this.templates['towerInfo'].process({tower:this.selectedTower})
if(this.selectedTower&&this.selectedTower.healthSprite){$('upgradeTower').observe('mouseenter',function(){self.updateMeters(self.selectedTower)}).observe('mouseover',function(){self.updateMeters(self.selectedTower)})}
var self=this
this.push(500,function(){self.renderData()})},tick:function(){this.objects=this.invokeTick(this.objects);this.turrets=this.invokeTick(this.turrets);this.creeps=this.invokeTick(this.creeps);this.rockets=this.invokeTick(this.rockets);return this},invokeTick:function(arr){var newArr=[]
arr.each(function(obj){if(!obj.dead){obj.tick()
newArr.push(obj)}})
return newArr},fire:function(name){try{this[name].fire()
this.usedWeapons[name.capitalize()]++;}catch(e){}},startAttack:function(){this.sendWaves(this.config)
this.renderStartAttack()},renderStartAttack:function(){var self=this
$$('#gameElements .superWeapons div').each(function(div){if(Config.superWeapons.indexOf(div.className.capitalize())!=-1){self[div.className].active=true
div.observe('click',function(){self.fire(div.className)})}})
var startDev=$$('#gameElements .start').first()
startDev.addClassName('resumed')
$$(".startText").first().innerHTML=T.pause
startDev.stopObserving('click')
$$(".start").first().observe('click',function(){self.pause()})},renderPause:function(){$('pauseWindow').show()
Sounds.play(Sounds.gameSounds.pause)
var pauseDev=$$('#gameElements .resumed').first()
$$(".startText").first().innerHTML=T.resume
pauseDev.removeClassName('resumed')
pauseDev.addClassName('paused')
$$(".start").first().stopObserving('click')
var self=this
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.stopObserving('click')}})
$$(".start").first().observe('click',function(){self.resume()})},renderResume:function(){$('pauseWindow').hide()
Sounds.play(Sounds.gameSounds.pause)
var resumeDev=$$('#gameElements .paused').first()
$$(".startText").first().innerHTML=T.pause
resumeDev.removeClassName('paused')
resumeDev.addClassName('resumed')
$$(".start").first().stopObserving('click')
var self=this
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.observe('click',function(){self.fire(div.className)})}})
$$(".start").first().observe('click',function(){self.pause()})},displayStats:function(){$$('#score #scoreValue').first().innerHTML=this.score},checkStatus:function(){var self=game.scene
if(this.running&&this.escaped>=this.maxEscaped){this.uploadScore(false,function(){self.end("lose")})
return}else if(this.config&&this.playing){if(this.config.waves.length==0&&this.creeps.length==0&&this.waitingCreeps==0){this.uploadScore(true,function(){self.end("win");})
return}else if(this.creeps.length==0&&this.waitingCreeps==0&&this.config.waves.length>0&&!this.wavePending&&this.running){this.waveNumber++
IncomingWaves.nextWave()
var score=10*(this.waveNumber+5-Math.round((new Date()-this.startTime)/1000))
if(score>0)
this.score+=score
this.startTime=new Date()
this.push(2000,function(){this.sendWave(this.config.waves.pop())},this)
var oldMoney=this.money
this.money=Math.round(this.money*this.moneyMultiplier[this.config.level-1])
if((this.money-oldMoney)>0)this.objects.push(new MoneyAnimation(695,100,this.money-oldMoney))
this.wavePending=true}}
var self=this
this.push(50,function(){self.checkStatus()})},end:function(state){var self=game.scene
self.push(2000,function(){game.scene.running=false
$("result").addClassName(state);if(state=="win"){function win(){$('pauseWindow').style.zIndex=299
$('pauseWindow').hide()
$('popup').hide()
$$('#result #lose').first().hide()
$$('#result #win').first().show()
new Effect.Appear("static")
$('droppingGround').addClassName('off')
new Effect.SwitchOff('static');new Effect.Appear("result",{delay:3.0})
game.scene.push(3000,function(){Sounds.play(Sounds.gameSounds[state])})
game.scene.push(3000,function(){self.displayStats()})
game.scene.push(4000,function(){FBDefender.publishMissionCompletion({name:GameConfigs.missionPath,score:self.score});});}
if(game.scene.rank!=Config.rank){Sounds.play(Sounds.gameSounds.rank_promotion)
$('pauseWindow').style.zIndex=302
$('pauseWindow').show()
$('popup').show()
$$('#popup #congratsContent').first().innerHTML="Congratulations"
$$('#popup #promotedContent').first().innerHTML="You have been promoted, you are now a "+Config.rank
game.scene.rank=Config.rank
var img=document.createElement("IMG");img.src="images/intro/ranks/"+Config.rank+".png";$$('#popup #rankImg').first().appendChild(img)
$$('#rank img')[0].src="images/intro/ranks/"+Config.rank+".png";$('popupClose').observe('click',win)
$('popupOk').observe('click',win)
FBDefender.publishRankPromotion({name:Config.rank,image:"fb-"+Config.rank+'.png'});}else{win()}}
else{$$('#result #win').first().hide()
$$('#result #lose').first().show()
new Effect.Appear("static")
$('droppingGround').addClassName('off')
new Effect.SwitchOff('static');new Effect.Appear("result",{delay:3.0})
game.scene.push(3000,function(){Sounds.play(Sounds.gameSounds[state])})
game.scene.push(3000,function(){self.displayStats()})}})},sendWave:function(wave){this.wave++
var slots=[]
for(var i=0;i<Map.height;i++){slots[i]=i;}
var canvas=$('gameForeground')
var delay=0
var entry=Map.entry[0]
var theta=0
var x=0;var y=0;if(entry[0]==0){theta=0
x=0}else if(entry[0]==Map.width-1){theta=180
x=map.width-1}else if(entry[1]==0){theta=90
y=0}else if(entry[1]==Map.height-1){theta=270
y=Map.height-1}
var self=this
wave.each(function(creep){var creepCat=eval(creep.category)
for(var i=0;i<creep.count;i++){self.creepsCount++
var entry=Map.entry[Math.round(Math.random()*(Map.entry.length-1))]
if(creepCat==Plane||creepCat==RedPlane){var arr=[0,90,180,270]
theta=arr[0]
creep.theta=theta
self.issueCreep(creep,(theta==90||theta==270)?Math.round(Math.random()*(Map.width-1)):x,(theta==0||theta==180)?(Math.round(Math.random()*(Map.height-2))+1):y,delay)}else{self.issueCreep(creep,entry[0],entry[1],delay)}
delay+=70*(32/creepCat.prototype.speed)+10
self.waitingCreeps++;}
self.push(delay+(32/creepCat.prototype.speed),function(){self.wavePending=false;})})},sendWaves:function(config){if(this.playing)return;this.playing=true;this.wave=0
this.startTime=new Date()
var wave=config.waves.pop()
if(wave){this.sendWave(wave);this.wavePending=true}else{}},issueCreep:function(creep,x,y,delay){var self=this
var creepCat=eval(creep.category)
this.push(delay,function()
{try{var obj=new creepCat(x,y,self,creep.values)
if(creepCat==Plane||creepCat==RedPlane){self.addPlane(obj)}
else{self.addCreep(obj)}
self.creepMutators.each(function(mutator){mutator.action(obj)})
self.waitingCreeps--}catch(e){console.log(e)}})},uploadScore:function(win,callback){if(development)callback()
else{var currRank=Config.rank;onSuccess=function(){$$('#rank img')[0].src="images/intro/ranks/"+Config.rank+".png";$$('.rankName')[0].innerHTML=Config.rank;callback();}
Intro.sendScore(this.score,win,onSuccess);}},sellSelectedTower:function(){this.money+=Math.round(this.selectedTower.price*0.75*this.selectedTower.hp/this.selectedTower.maxHp)
Map.grid[this.selectedTower.gridX][this.selectedTower.gridY].tower=null
this.selectedTower.destroySprites()
this.selectedTower=null},upgradeSelectedTower:function(){this.selectedTower.upgrade()},updateMeters:function(tower){if(tower.upgrades[tower.rank]){if(tower.upgrades[tower.rank].power)
$('powerMeter').style.borderRight=(tower.upgrades[tower.rank].power-tower.power)*65/450+"px solid red"
if(tower.upgrades[tower.rank].rate)
$('rateMeter').style.borderRight=(tower.upgrades[tower.rank].rate-tower.rate)*65/1+"px solid red"
if(tower.upgrades[tower.rank].range)
$('rangeMeter').style.borderRight=(tower.upgrades[tower.rank].range-tower.range)*65/6+"px solid red"
if(tower.upgrades[tower.rank].maxHp)
$('shieldsMeter').style.borderRight=(tower.upgrades[tower.rank].maxHp-tower.maxHp)*65/3100+"px solid red"}},waitingCreeps:0,wavePending:false,escaped:0,ctx:null,topCtx:null,maxEscaped:20,money:200,delay:25,fps:0,score:0,moneyMultiplier:[1.2,1.1,1.05],creepMultiplier:[1.05,1.1,1.15],creepPowerMultiplier:[1.1,1.15,1.2],wave:0,sound:true,wavesCount:0,skipFrames:0})
var TutorialScene=Class.create(CityDefenderScene,{initialize:function($super,config,delay,baseCtx,upperCtx){$super(config,delay,baseCtx,upperCtx)
$$('#gameElements .superWeapons div').each(function(div){})},addCreep:function($super,creep){if(this.waveNumber==2){creep.hp=creep.maxHp=80}else{creep.hp=creep.maxHp=20}
$super(creep)},addPlane:function($super,plane){plane.hp=plane.maxHp=20
$super(plane)},sendWave:function($super,wave){if(this.waveNumber==1){}
else if(this.waveNumber==2){this.push(6000,function(){game.tutorial.initiateSuperWeapon()})}
else if(this.waveNumber==3){}
else if(this.waveNumber==4){game.tutorial.planesAttack()}
else if(this.waveNumber==5){}
$super(wave)},end:function(status){game.tutorial.wishLuck()},uploadScore:function(win,callback){callback()}})
var Map={pitch:32,width:20,height:15,grid:[],tiles:[new Image(),new Image()],bgGrid:[[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,0,1,1,1,1,1,0,1,1,1,1],[0,0,1,1,0,1,1,1,1,1,0,1,1,1,1],[0,0,1,1,0,1,1,0,1,1,0,1,1,0,0],[0,0,1,1,0,1,1,0,1,1,0,1,1,0,0],[0,0,1,1,0,1,1,0,1,1,0,1,1,0,0],[0,0,1,1,0,1,1,0,1,1,1,1,1,0,0],[0,0,1,1,0,1,1,0,1,1,1,1,1,0,0],[0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],[0,0,1,1,0,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,0,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,0,0,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,1,1,1,1,1,0,1,1,0,0],[0,0,1,1,0,1,1,1,1,1,0,1,1,0,0],[0,0,1,1,0,1,1,0,1,1,0,1,1,0,0],[0,0,1,1,1,1,1,0,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,0,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],entry:[[0,2],[0,3]],init:function(){for(var i=0;i<this.width;i++){this.grid[i]=[]
for(var j=0;j<this.height;j++){this.grid[i][j]=[]
this.grid[i][j].tower=null}}},value:function(x,y){return Map.bgGrid[Math.floor(x/Map.pitch)][Math.floor(y/Map.pitch)]},findTile:function(x,y){return[Math.floor(x/this.pitch),Math.floor(y/this.pitch)]},transform:function(x){return Math.floor(x/this.pitch)*this.pitch},empty:function(x,y){if(!this.grid[x])return false;if(!this.grid[x][y])return true;return this.grid[x][y].tower==null}}
var tutorialConfig={campaign:"tunisia",exp:29,level:3,mapImage:"challenges/tunisia/sfax/images/path.png",superWeapons:["Splash","Hyper","Nuke","Weak","Heal"],towers:["Turret"],weaponUpgrades:{"Splash":1,"Hyper":1,"Weak":1,"Heal":1,"Nuke":1},towerUpgrades:{"Turret":1},upgrades:["Bullets","Shields"],waves:[[{category:"Tank",count:"5"}],[{category:"Tank",count:"10"}],[{category:"Tank",count:"10"}],[{category:"Plane",count:"3"}]],rank:"PVT"}
var T={start:"start",resume:"resume",pause:"pause"}
var Game=Class.create({initialize:function(delay){},start:function(){Map.init();if(Intro.userData.newbie)Config=tutorialConfig
else Config=GameConfigs
this.prepareConfig()
this.config=Nezal.clone_obj(Config)
this.config.waves.reverse()
$('scores').show()
if(Intro.userData.newbie){$('modalWindow').show()
this.scene=new TutorialScene(this.config,50,this.ctx,this.topCtx);this.tutorial=new Tutorial(this.scene,this.tutorialCtx)}
else{this.scene=new CityDefenderScene(this.config,50,this.ctx,this.topCtx);this.registerHandlers();if(Config.map)Map.bgGrid=Config.map
if(Config.mapEntry)Map.entry=Config.mapEntry}
GhostTurret=new Turret(0,0,this.scene,ghostTurretFeatures)
$$('.startText').first().innerHTML=T.start
var arr=['Splash','Heal','Hyper','Weak','Nuke']
arr.each(function(weapon){if(Config.superWeapons.indexOf(weapon)==-1){game.scene[weapon.toLowerCase()].deactivate()}})
this.scene.start();},prepareConfig:function(){var inputNames=["Belcher","Reaper","Exploder","Patriot"]
var replacement=["Turret","DoubleTurret","RocketLauncher","Patriot"]
var upgradeValues=["maxHp","power","range","rate","price"]
for(var i=0;i<inputNames.length;i++){var ind=Config.towers.indexOf(inputNames[i])
if(ind!=-1){Config.towers[ind]=replacement[i]
var values=Intro.gameData.towers[inputNames[i]].upgrades
var upgrades=[]
upgradeValues.each(function(upgradeValue){eval(replacement[i]).prototype[upgradeValue]=values[0][upgradeValue]})
eval(replacement[i]).prototype.maxRank=Config.towerUpgrades[inputNames[i]]-1
for(var j=1;j<values.length;j++){var value=values[j]
var upgrade={}
upgradeValues.each(function(upgradeValue){upgrade[upgradeValue]=value[upgradeValue]})
upgrades.push(upgrade)}
eval(replacement[i]).prototype.upgrades=upgrades}}
var weaponValues=Intro.gameData.weapons
Config.superWeapons.each(function(weapon){eval(weapon).prototype.factor1=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor1
eval(weapon).prototype.factor2=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].factor2
eval(weapon).prototype.cooldown=weaponValues[weapon].upgrades[Config.weaponUpgrades[weapon]-1].cooldown})
if(Config.superWeapons.indexOf('Splash')!=-1&&Config.superWeapons[0]!="Splash"){var x=Config.superWeapons[0]
var y=Config.superWeapons.indexOf("Splash")
Config.superWeapons[0]="Splash"
Config.superWeapons[y]=x}},setGameImages:function(){if(Intro.userData.newbie)Config=tutorialConfig
else Config=GameConfigs
game.prepareConfig()
Config.towers.each(function(tower){var div=document.createElement("div");div.style.cursor="pointer"
div.setAttribute('class',tower);$$(".towers").first().appendChild(div)})
for(var i=0;i<10-Config.towers.length;i++){var div=document.createElement("div");$$(".towers").first().appendChild(div)}
var arr=['Splash','Heal','Hyper','Weak','Nuke']
arr.each(function(weapon){var wCapital=weapon
weapon=weapon.toLowerCase()
var div=document.createElement("div");div.style.cursor="pointer"
div.setAttribute('class',weapon);$$(".superWeapons").first().appendChild(div)
var div2=document.createElement("div");div2.setAttribute('class',weapon);$$(".superWeaponsOff").first().appendChild(div2)})
$$('.start').first().appendChild(Loader.images.background['start.png'])
$('gameElements').appendChild(Loader.images.background['l_shape.png'])
if(Intro.userData.newbie)$('canvasContainer').appendChild(Loader.images.background['path.png'])
else $('canvasContainer').appendChild(Loader.challenges[Config.campaign]['images/'+Config.missionPath+'/path.png'])
Config.towers.each(function(turret){$$('.'+turret).first().appendChild(Loader.images.background[turret.toLowerCase()+'_button.png'])})
var img8=Loader.images.background['character.png']
$$('#modalWindow #character').first().appendChild(img8)
var img9=document.createElement("IMG");$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.appendChild(Loader.images.background[div.className+'_button.png'])}})
$$('#gameElements .superWeaponsOff div').each(function(div){if(div.className!=''){div.appendChild(Loader.images.background[div.className+'_button_off.png'])}})
var image1=new Image()
var image2=new Image()
image1.src=Loader.images.background['exit_restart_button.png'].src
image2.src=Loader.images.background['exit_restart_button.png'].src
$('gameReset').appendChild(image1)
$('gameExit').appendChild(image2)
$$('#rank img')[0].src="images/intro/ranks/"+Config.rank+".png";$$('.rankName')[0].innerHTML=Config.rank;},registerHandlers:function(){var self=this
$$('.towers div').invoke('observe','click',function(){Sounds.play(Sounds.gameSounds.click);GhostTurret.select(this)})
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.observe('click',function(){self.scene.fire(div.className)})
self.scene[div.className].active=false}})
$$('#gameElements .start').first().observe('click',function(){self.scene.startAttack()})
$('playAgain').observe('click',game.reset)
$('exit').observe('click',game.exit)
$('gameExit').observe('click',game.exit)
$('gameReset').observe('click',game.reset)
$$('.bookmark').first().observe('click',FBConnect.bookmark)
$$('.sound').first().observe('click',Sounds.mute)},reset:function(){game.scene.reactor.stop()
new Effect.Fade('static')
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .start').first().removeClassName('resumed')
$$('#gameElements .start').first().removeClassName('paused')
game.unRegisterHandlers()
$('droppingGround').removeClassName('off')
$('result').hide()
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.stopObserving('click')}})
game.start()},exit:function(){game.scene.reactor.stop()
Intro.enablePauseScreen();$('gameStart').hide()
$("gameStart").innerHTML=Intro.templates['game'];Intro.replay();onFinish()},unRegisterHandlers:function(){$$('.towers div').invoke('stopObserving','click')
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .superWeapons div').each(function(div){if(div.className!=''){div.stopObserving('click')}})
$('playAgain').stopObserving('click')
$('exit').stopObserving('click')
$('gameExit').stopObserving('click')
$('gameReset').stopObserving('click')
$$('.bookmark').first().stopObserving('click')
$$('.sound').first().stopObserving('click')}});var game=new Game()
function city_defender_start(){$$("canvas").each(function(canvas){canvas.width=Map.width*Map.pitch
canvas.height=Map.height*Map.pitch})
game.setGameImages()
Upgrades.init();var fg=$('gameBackground');var top=$('gameForeground')
top.getContext('2d')
var tutorialg=$('droppingGround')
var totorialTop=tutorialg.getContext('2d')
game.tutorialCtx=totorialTop
game.canvas=fg
game.ctx=fg.getContext('2d')
game.topCtx=top.getContext('2d')
game.start();Upgrades.selectDefault();}
function onFinish(){$('gameElements').style.visibility='visible'
$('canvasContainer').style.visibility='visible'
window.setTimeout(function(){$('gameElements').show();$('canvasContainer').show();$('static').show();$('waitScreen').hide()
Effect.Fade('static',{duration:1.0})},100)}
var Unit=Class.create({initialize:function(x,y,scene,extension){this.gridX=x
this.gridY=y
this.x=Map.pitch*(x+0.5)
this.y=Map.pitch*(y+0.5)
if(extension){Object.extend(this,extension)}
this.scene=scene
this.maxHp=this.hp
return this},createBaloon:function(num){this.baloon=new Baloon(num)
this.scene.creepsLayer.attach(this.baloon)},destroyBaloon:function(){this.baloon.destroy()
this.baloon=null},target:function(){if(this.dead)return
if(!this.reloaded){this.toFire+=this.rate;if(this.toFire>=1){this.reloaded=true;this.toFire-=1}}
var targets=[]
for(var i=this.gridX-this.range;i<this.gridX+this.range+1;i++){for(var j=this.gridY-this.range;j<this.gridY+this.range+1;j++){if(Map.grid[i]&&Map.grid[i][j]){this.getTargetfromCell(Map.grid[i][j],targets)}}}
if(targets.length>=1){this.pickTarget(targets)}else{this.targetUnit=null}
return this;},getTargetfromCell:function(cell,targets){},pickTarget:function(targets){},takeHit:function(power){if(this.dead)return
this.hp-=power
if(this.hp<=0){var anim=new CreepBoom(this.x,this.y)
game.scene.rankLayer.attach(anim)
game.scene.objects.push(anim)
this.dead=true;this.die();Sounds.play(Sounds.boom.unit)}
return this;},die:function(){alert('die not implemented')},hp:100,maxHp:100,rate:0.2,toFire:0,reloded:true,fired:false,power:2.5,range:2,x:0,y:0,gridX:0,gridY:0})
var Creep=Class.create(Unit,{parent:"creep",speeds:[0,1.08,2.245,4.852,6.023,7.945,11.71,22.625],angles:[0,3.75,7.5,15,18,22.5,30,45],cannonTheta:0,olderTheta:0,oldestTheta:0,hp:100,maxHp:100,speed:4,price:4,evading:false,direction:0,rate:0.1,power:1.0,cannonDisplacement:[-4,0],turningPoint:[0,0],range:1,initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
Map.grid[x][y].push(this)
this.initImages()
this.createSprites()
if(x==0){this.rotation=0
this.top=this.y-Map.entry[0][1]*Map.pitch
this.bottom=(Map.entry[1][1]+1)*Map.pitch-this.y}else if(y==0){this.rotation=90
this.top=(Map.entry[1][0]+1)*Map.pitch-this.x
this.bottom=this.x-Map.entry[0][0]*Map.pitch}else if(x==(Map.width-1)){this.rotation=180
this.top=Map.entry[1][1]*Map.pitch-this.y
this.bottom=this.y-(Map.entry[0][1]+1)*Map.pitch}else if(y==Map.height-1){this.rotation=270
this.top=this.x-Map.entry[0][0]*Map.pitch
this.bottom=(Map.entry[1][0]+1)*Map.pitch-this.x}},initImages:function(){},createSprites:function(){this.sprite=new CompositeUnitSprite(this.images,this.hp,this.maxHp)
this.sprite.moveTo(this.x,this.y);},modifySprites:function(){this.sprite.x=this.x
this.sprite.y=this.y
this.sprite.rotation=this.rotation
this.sprite.cannonRotation=this.cannonTheta
if(this.baloon)this.baloon.moveTo(this.x,this.y-70)
this.sprite.setHp(this.hp)
this.sprite.maxHp=this.maxHp
if(this.fired){this.sprite.currentFrame=1
this.fired=false}
else this.sprite.currentFrame=0},topBottomValues:function(){if(this.rotation==0){return[Map.value(this.x,this.y-this.top-1),Map.value(this.x,this.y+this.bottom+1)]}else if(this.rotation==90){return[Map.value(this.x+this.top+1,this.y),Map.value(this.x-this.bottom-1,this.y)]}else if(this.rotation==180){return[Map.value(this.x-1,this.y+this.top+1),Map.value(this.x-1,this.y-this.bottom-1)]}else if(this.rotation==270){return[Map.value(this.x-this.top-1,this.y-1),Map.value(this.x+this.bottom+1,this.y-1)]}},shouldNotTurn:function(ref){if(this.rotation==0){return this.x<(this.turningPoint[0]+ref-16)}else if(this.rotation==90){return this.y<(this.turningPoint[1]+ref-16)}else if(this.rotation==180){return this.x>(this.turningPoint[0]-ref+16)}else if(this.rotation==270){return this.y>(this.turningPoint[1]-ref+16)}},tick:function(){if(this.dead)return
var move=false
if(!this.rotating){var values=this.topBottomValues()
var top=values[0]
var bottom=values[1]
if(top==0&&bottom==0){move=true
this.turningPoint=[0,0]}else{if(this.turningPoint[0]==0&&this.turningPoint[1]==0){this.turningPoint=[this.x,this.y]}else if(bottom==1&&(this.shouldNotTurn(this.bottom))){move=true}else if(top==1&&(this.shouldNotTurn(this.top))){move=true}else{this.direction=bottom-top
this.rotating=true
this.oldTheta=this.rotation
this.oldSpeed=this.speed
var self=this
this.index=this.speeds.collect(function(speed,index){return[Math.abs(self.speed-speed),index];}).select(function(t){if(t[0]<=self.speed)return true}).sort(function(a,b){return a[0]-b[0];})[0][1]
this.speed=this.speeds[this.index]}}}else{this.rotation+=this.direction*this.angles[this.index]
move=false;this.x+=this.speed*Math.cos(this.rotation*Math.PI/180);this.y+=this.speed*Math.sin(this.rotation*Math.PI/180);if(Math.abs(this.rotation-this.oldTheta)>=90){this.rotation=this.oldTheta+this.direction*90
if(this.rotation<0)this.rotation+=360;if(this.rotation>=360)this.rotation-=360;this.speed=this.oldSpeed
this.rotating=false
this.x=Math.round((this.x/4))*4
this.y=Math.round((this.y/4))*4
this.turningPoint=[0,0]}}
if(move){if(this.rotation==0){this.x+=this.speed}else if(this.rotation==90){this.y+=this.speed}else if(this.rotation==180){this.x-=this.speed}else if(this.rotation==270){this.y-=this.speed}}
var newGridX=Math.floor(this.x/Map.pitch)
var newGridY=Math.floor(this.y/Map.pitch)
if(newGridX>=Map.width||newGridY>=Map.height||newGridX<0||newGridY<0){this.scene.escaped+=1
this.destroySprites()}else if(this.gridX!=newGridX||this.gridY!=newGridY){var oldArr=Map.grid[this.gridX][this.gridY]
oldArr.splice(oldArr.indexOf(this),1);this.gridX=newGridX
this.gridY=newGridY
if(newGridX<Map.width){Map.grid[newGridX][newGridY].push(this);}else{}}
this.target();this.modifySprites()},target:function(){if(this.dead)return
if(!this.reloaded){this.toFire+=this.rate;if(this.toFire>=1){this.reloaded=true;this.toFire-=1}}
var targets=[]
for(var i=this.gridX-this.range;i<this.gridX+this.range+1;i++){for(var j=this.gridY-this.range;j<this.gridY+this.range+1;j++){if(Map.grid[i]&&Map.grid[i][j]){this.getTargetfromCell(Map.grid[i][j],targets)}}}
if(targets.length>=1){this.pickTarget(targets)}else{this.targetUnit=null}
return this;},getTargetfromCell:function(cell,targets){if(cell.tower){targets.push(cell.tower)}},pickTarget:function(targets){if(this.dead)return
targets.sort(function(a,b){return a.hp-b.hp})
var target=targets[0]
var dx=this.x-target.x
var dy=this.y-target.y
var theta=Math.atan(dy/dx)*180/Math.PI
if(dx<0){this.cannonTheta=theta-this.rotation}else{this.cannonTheta=theta-this.rotation+180}
if(this.reloaded){target.takeHit(this.power)
if(target.dead)this.scene.scenario.notify({name:"creepDestroyedTower",method:false,unit:this})
this.reloaded=false;this.fired=true;}},die:function(){var anim=new CoinsAnimation(this.x,this.y-40)
this.scene.towerHealthLayer.attach(anim)
this.scene.objects.push(anim)
this.destroySprites()
var moneyAnim=new MoneyAnimation(this.x-10,this.y-5,Math.floor(this.price))
this.scene.objects.push(moneyAnim)
this.scene.money+=Math.floor(this.price);this.scene.stats.creepsDestroyed++
this.scene.score+=Math.round(this.maxHp/100)*this.scene.config.level},destroySprites:function(){var cell=Map.grid[this.gridX][this.gridY];cell.splice(cell.indexOf(this),1);this.sprite.destroy()
if(this.baloon)this.baloon.destroy()
this.dead=true}})
var Turret=Class.create(Unit,{theta:0,cannonTheta:0,rank:0,fireSound:Sounds.turret.fire,canHitFlying:true,canHitGround:true,name:'Belcher',targets:'Air &<br/>Ground',facilities:'Fires Bullets',cssClass:'tower',hp:500,maxHp:500,power:10,rate:0.2,price:15,range:2,upgradeValues:['maxHp','power','rate','range'],upgrades:[{maxHp:1100,power:18,price:3},{maxHp:1300,power:22,price:8,range:3},{maxHp:1600,power:26,rate:0.3,price:21,range:4}],initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
this.initImages()
this.createSprites()},upgrade:function(){if(this.rank==this.maxRank)return
var upgrade=this.upgrades[this.rank]
if(this.scene.money<upgrade.price)return false
this.rank+=1
var self=this
var oldHp=this.maxHp
this.upgradeValues.each(function(v){if(upgrade[v])self[v]=upgrade[v]})
this.price+=upgrade.price
this.hp*=this.maxHp/oldHp
this.scene.money-=upgrade.price
return this},createSprites:function(){this.rangeSprite=new RangeSprite(this.range)
this.baseSprite=new Sprite(this.images.base)
this.cannonSprite=new Sprite(this.images.cannon.concat(this.images.fire))
this.rankSprite=new Sprite(this.images.ranks)
this.healthSprite=new HealthSprite(this.hp,this.maxHp)
this.baseSprite.moveTo(this.x,this.y)
this.baseSprite.moveTo(this.x,this.y)
this.cannonSprite.moveTo(this.x,this.y)
this.rankSprite.moveTo(this.x+50,this.y-5)
this.healthSprite.moveTo(this.x,this.y)
this.rangeSprite.moveTo(this.x,this.y)},initImages:function(){this.images={}
this.images.base=[Loader.images.game['tower_base.png']]
this.images.cannon=[Loader.images.game['cannon_1.png']]
this.images.fire=[Loader.images.game['cannon_1_in_action.png']]
this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},getTargetfromCell:function(cell,targets){cell.each(function(obj){targets.push(obj)})},tick:function(){this.target()
this.modifySprites()},modifySprites:function(){this.cannonSprite.rotation=Nezal.degToRad(this.cannonTheta)
this.changeFireState()
this.healthSprite.hp=this.hp
this.healthSprite.maxHp=this.maxHp
this.rankSprite.currentFrame=this.rank
if(this.baloon)this.baloon.moveTo(this.x,this.y-70)
this.rangeSprite.range=this.range},changeFireState:function(){if(this.fired){this.fired=false
this.cannonSprite.currentFrame=1}
else{this.cannonSprite.currentFrame=0}},pickTarget:function(targets){targets.sort(function(a,b){return a.hp-b.hp})
if(!this.canHitFlying){targets=targets.select(function(t){return!t.flying})}
if(!this.canHitGround){targets=targets.select(function(t){return t.flying})}
if(targets.length==0)return
var target=targets[0]
var dx=this.x-target.x
var dy=this.y-target.y
var distance=Math.sqrt(dx*dx+dy*dy)
var theta=Math.acos(dx/distance)*180/Math.PI
if(dy>=0){this.cannonTheta=theta-this.theta}else{this.cannonTheta=this.theta-theta}
if(dy==0&&dx==0){this.cannonTheta=this.theta}
if(this.reloaded){this.fire(target)
this.reloaded=false;this.fired=true;}
this.targetUnit=target},fire:function(target){Sounds.play(this.fireSound)
var power=this.power
target.takeHit(power)
if(target.dead){this.scene.scenario.notify({name:"towerDestroyedCreep",method:false,unit:this})}},die:function(){this.destroySprites()
Map.grid[this.gridX][this.gridY]=[];this.scene.stats.towersDestroyed++;},destroySprites:function(){this.dead=true
this.baseSprite.destroy()
this.cannonSprite.destroy()
this.healthSprite.destroy()
this.rankSprite.destroy()
if(this.scene.selectedTower.gridX==this.gridX&&this.scene.selectedTower.gridY==this.gridY)this.scene.selectedTower=null
if(this.baloon)this.baloon.destroy()
this.rangeSprite.destroy()}})
var DoubleTurret=Class.create(Turret,{name:'Reaper',cssClass:'doubleTower',fireSound:Sounds.turret.fire,firing_turn:0,hp:900,power:15,rate:0.4,price:30,range:2,upgrades:[{maxHp:1550,power:18,price:5},{maxHp:1875,power:22,price:10,rate:0.5},{maxHp:1600,power:26,rate:0.6,price:30,range:3}],initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)},initImages:function($super){$super()
this.images.cannon=[Loader.images.game['cannon_2.png']]
this.images.fire=[Loader.images.game['cannon_2_in_action_right.png'],Loader.images.game['cannon_2_in_action_left.png']]},changeFireState:function(){if(this.fired){this.fired=false
this.firing_turn=1-this.firing_turn
this.cannonSprite.currentFrame=this.firing_turn+1}
else{this.cannonSprite.currentFrame=0}}})
var RocketLauncher=Class.create(Turret,{name:'Exploder',targets:'Ground<br/>Only',facilities:'Fires Rockets',cssClass:'rocketLauncher',reloaded:true,canHitFlying:false,canHitGround:true,hp:1700,power:150,rate:0.05,price:40,range:3,maxHp:1200,upgrades:[{maxHp:2100,power:200,price:13},{maxHp:2500,power:300,price:17},{maxHp:3000,power:410,range:4,price:45}],initialize:function($super,x,y,scene,extension){this.initImages()
$super(x,y,scene,extension)},createSprites:function(){this.rangeSprite=new RangeSprite(this.range)
this.rocketSprite=new Sprite(this.images.rocket)
this.baseSprite=new Sprite(this.images.base)
this.cannonSprite=new Sprite(this.images.pad)
this.rankSprite=new Sprite(this.images.ranks)
this.healthSprite=new HealthSprite(this.hp,this.maxHp)
this.baseSprite.moveTo(this.x,this.y)
this.cannonSprite.moveTo(this.x,this.y)
this.rankSprite.moveTo(this.x+50,this.y-5)
this.healthSprite.moveTo(this.x,this.y)
this.rocketSprite.moveTo(this.x,this.y)
this.rangeSprite.moveTo(this.x,this.y)},initImages:function(){this.images={}
this.images.base=[Loader.images.game['tower_base.png']],this.images.pad=[Loader.images.game['rocket_launcher.png']],this.images.rocket=[Loader.images.game['rocket.png']],this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},tick:function($super){$super()
this.rocketSprite.rotation=this.cannonSprite.rotation},changeFireState:function(){if(this.reloaded){this.rocketSprite.draw=true}
else this.rocketSprite.draw=false
if(this.fired){this.fired=false
var power=this.power
this.scene.rockets.push(new Rocket(this.x,this.y,this.scene,{parent:this,theta:this.cannonTheta,targetUnit:this.targetUnit,x:this.x,y:this.y,power:this.power}))}},fire:function(){Sounds.play(Sounds.turret.rocketLaunch)},destroySprites:function($super){$super()
this.rocketSprite.destroy()}})
var Patriot=Class.create(Turret,{name:'Patriot',targets:'Air<br/>Only',facilities:'Fires Rockets',cssClass:'patriot',firing_turn:0,canHitFlying:true,canHitGround:false,hp:1200,power:40,rate:0.3,price:60,range:4,maxHp:1200,upgrades:[{maxHp:1450,power:50,price:12},{maxHp:1730,power:60,price:30,range:5},{maxHp:2075,power:70,rate:0.4,price:55}],initialize:function($super,x,y,scene,extension){this.initImages()
$super(x,y,scene,extension)},initImages:function(){this.images={}
this.images.base=[Loader.images.game['tower_base.png']],this.images.cannon=[Loader.images.game['patriot_launcher.png']],this.images.fire=[Loader.images.game['patriot_launcher_in_action_right.png'],Loader.images.game['patriot_launcher_in_action_left.png']],this.images.ranks=[null,Loader.images.game['rank_1.png'],Loader.images.game['rank_2.png'],Loader.images.game['rank_3.png']]},changeFireState:function(){if(this.fired){this.fired=false
this.firing_turn=1-this.firing_turn
this.cannonSprite.currentFrame=this.firing_turn+1
var rocketX=this.x
var rocketY=this.y+(this.firing_turn==0?(5):(-5))
var power=this.power
this.scene.rockets.push(new PatriotRocket(this.x,this.y,this.scene,{parent:this,theta:this.cannonTheta,targetUnit:this.targetUnit,x:rocketX,y:rocketY,power:this.power}))}else{this.cannonSprite.currentFrame=0}},fire:function(target){Sounds.play(Sounds.turret.patriotLaunch)}})
var Rocket=Class.create(Unit,{speed:12,step:0,power:20,lastTargetX:0,lastTargerY:0,initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
this.rocketSprite=new Sprite([Loader.images.game['rocket_in_action.png']])
this.rocketSprite.moveTo(this.x,this.y)
this.scene.towerHealthLayer.attach(this.rocketSprite)
this.dead=false},tick:function(){if(this.targetUnit){this.lastTargetX=this.targetUnit.x
this.lastTargetY=this.targetUnit.y}
var dx=this.x-this.lastTargetX;var dy=this.y-this.lastTargetY;var distance=Math.sqrt(dx*dx+dy*dy);var theta=Math.acos(dx/distance)*180/Math.PI;if(dy>=0){this.theta=theta;}else{this.theta=-theta;}
this.step++;if(distance-(this.speed*this.step)<=this.speed){if(!this.targetUnit.dead){this.targetUnit.takeHit(this.power);if(this.targetUnit.dead){if(this.parent&&!this.parent.dead){var moneyAnim=new MoneyAnimation(this.targetUnit.x-10,this.targetUnit.y-5,Math.round(this.targetUnit.price))
this.scene.objects.push(moneyAnim)
this.scene.scenario.notify({name:"towerDestroyedCreep",method:false,unit:this.parent})}}}
this.die();}
this.modifySprites()},modifySprites:function(){this.rocketSprite.rotation=Nezal.degToRad(this.theta)
this.rocketSprite.transitionX=-(this.step*this.speed)},die:function(){this.rocketSprite.destroy()
this.dead=true}})
var PatriotRocket=Class.create(Rocket,{initialize:function($super,x,y,scene,extension){$super(x,y,scene,extension)
this.rocketSprite.images=[Loader.images.game['patriot_rocket.png']]
this.scene.basesLayer.attach(this.rocketSprite)
this.rocketSprite.rotation=Nezal.degToRad(this.theta)
this.rocketSprite.moveTo(this.x,this.y)},modifySprites:function(){this.rocketSprite.rotation=Nezal.degToRad(this.theta)
this.rocketSprite.transitionX=-(this.step*this.speed)},speed:10})
var ghostTurretFeatures={validate:function(){this.valid=true
try{if(Map.grid[this.xGrid]&&Map.grid[this.xGrid][this.yGrid])
if(this.xGrid==Map.bgGrid.length-1||Map.grid[this.xGrid][this.yGrid].tower||Map.bgGrid[this.xGrid][this.yGrid]>0||game.scene.money<this.tower.prototype.price){this.valid=false}}
catch(e){console.log("error in map in ",x,y,e)}
game.scene.push(1000,this.validate,this)},checkMap:function(x,y){if(!Map.empty(x,y-1)||!Map.empty(x,y)||!Map.empty(x,y+1)){this.valid=false;}},droppingGroundClick:function(e){var x=0,y=0
var self=GhostTurret
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.xGrid=Math.floor(x/32)
self.yGrid=Math.floor(y/32)
self.validate();if(self.valid&&self.selected){self.selected=true
Sounds.play(Sounds.gameSounds.correct_tower)
var turret=new self.tower(Math.floor(x/32),Math.floor(y/32),game.scene)
game.scene.towerMutators.each(function(mutator){mutator.action(turret)})
game.scene.addTurret(turret)
game.scene.stats.towersCreated++
game.scene.money-=self.tower.prototype.price}
else if(Map.grid[self.xGrid][self.yGrid].tower){self.selected=false
if(game.scene.selectedTower){if(game.scene.selectedTower.rangeSprite){game.scene.selectedTower.rangeSprite.visible=false}}
game.scene.selectedTower=Map.grid[self.xGrid][self.yGrid].tower
game.scene.selectedTower.rangeSprite.visible=true}
else{Sounds.play(Sounds.gameSounds.wrong_tower)}},select:function(div){$('droppingGround').stopObserving("mouseenter")
var self=GhostTurret
if(game.scene.selectedTower){if(game.scene.selectedTower.rangeSprite){game.scene.selectedTower.rangeSprite.visible=false}}
var tower=game.config.towers.find(function(tower){return tower==div.className})
if(tower==null){return;}
var towerCategory=eval(tower)
game.scene.selectedTower=towerCategory.prototype
self.images=towerCategory.prototype.images
self.initImages=towerCategory.prototype.initImages
self.range=towerCategory.prototype.range
self.initImages()
self.selected=true;$('droppingGround').observe("mouseenter",function(e){self.isIn=true
var x=0,y=0
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.x=x
self.y=y
this.observe("mousemove",function(e){var x=0,y=0
if(e.layerX){x=e.layerX;y=e.layerY}
else{x=e.x;y=e.y}
self.x=x
self.y=y
self.xGrid=Math.floor(x/32)
self.yGrid=Math.floor(y/32)
self.tower=towerCategory
self.validate()}).observe("click",function(e){GhostTurret.droppingGroundClick(e)})}).observe("mouseleave",function(e){self.isIn=false
this.stopObserving("mousemove").stopObserving("click")}).addClassName('turret')},showInfo:function(){},clear:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},render:function(ctx){ctx.save()
ctx.translate(Map.transform(this.x)-Map.pitch,Map.transform(this.y))
ctx.drawImage(this.images.base[0],0,0)
if(this.images.cannon){ctx.drawImage(this.images.cannon[0],0,0)}else{ctx.drawImage(this.images.pad[0],0,0)
ctx.drawImage(this.images.rocket[0],0,0)}
if(this.valid){ctx.fillStyle='rgba(255,255,255,0.5)'
ctx.beginPath();ctx.arc(Map.pitch+16,Map.pitch-16,this.range*Map.pitch,0,Math.PI*2,false)
ctx.closePath();ctx.fill();}else{ctx.fillStyle='rgba(255,0,0,0.0)'
ctx.beginPath();ctx.arc(0,0,128,0,Math.PI*2,false)
ctx.closePath();ctx.fill();ctx.fillStyle='rgba(255,0,0,0.9)'
ctx.fillRect(32,0,32,32)}
ctx.restore();}}
var Humvee=Class.create(Creep,{name:'Humvee',hp:275,maxHp:275,speed:4,price:2,cannonDisplacement:[-1,1],images:{},initImages:function(){this.images={base:Loader.images.game['humvee_body.png'],cannon:Loader.images.game['humvee_tower.png'],fire:Loader.images.game['humvee_tower_in_action.png']}}})
var Tank=Class.create(Creep,{name:'Tank',images:{},price:1,power:1,initImages:function(){this.images={base:Loader.images.game['tank_body.png'],cannon:Loader.images.game['tank_tower.png'],fire:Loader.images.game['tank_tower_in_action.png']}}})
var TankI=Class.create(Creep,{images:{},name:'TankI',price:1,hp:225,maxHp:225,initImages:function(){this.images={base:Loader.images.game['tank_1_body.png'],cannon:Loader.images.game['tank_1_tower.png'],fire:Loader.images.game['tank_1_tower_in_action.png']}}})
var TankII=Class.create(Creep,{images:{},name:'TankII',price:2,speed:8,hp:225,maxHp:225,initImages:function(){this.images={base:Loader.images.game['tank_2_body.png'],cannon:Loader.images.game['tank_2_tower.png'],fire:Loader.images.game['tank_2_tower_in_action.png']}}})
var BlackTank=Class.create(Creep,{images:{},name:'BlackTank',price:50,hp:2000,maxHp:2000,speed:2,power:3,initImages:function(){this.images={base:Loader.images.game['black_tank_body.png'],cannon:Loader.images.game['black_tank_tower.png'],fire:Loader.images.game['black_tank_tower_in_action.png']}}})
var RedTank=Class.create(Creep,{images:{},name:'RedTank',price:3,power:2,hp:125,maxHp:125,initImages:function(){this.images={base:Loader.images.game['red_tank_body.png'],cannon:Loader.images.game['red_tank_tower.png'],fire:Loader.images.game['red_tank_tower_in_action.png']}}})
var Plane=Class.create(Creep,{name:'Plane',parent:'Plane',flying:true,hp:125,maxHp:125,speed:4,power:1,rate:0.1,range:2,price:2,initialize:function($super,x,y,extension){$super(x,y,extension)
this.theta=0},initImages:function(){this.images={base:Loader.images.game['air_craft.png'],fire:Loader.images.game['air_craft_in_action.png'],shadow:Loader.images.game['air_craft_shade.png']}},createSprites:function(){this.cannonSprite=new Sprite([this.images.base,this.images.fire])
this.shadowSprite=new Sprite([this.images.shadow])
this.healthSprite=new HealthSprite(this.hp,this.maxHp)
this.cannonSprite.moveTo(this.x,this.y)
this.shadowSprite.moveTo(this.x,this.y)
this.healthSprite.moveTo(this.x,this.y)},modifySprites:function(){this.cannonSprite.moveTo(this.x+30,this.y)
this.shadowSprite.moveTo(this.x+30,this.y)
this.healthSprite.moveTo(this.x,this.y)
this.healthSprite.hp=this.hp
this.healthSprite.maxHp=this.maxHp
if(this.fired){this.cannonSprite.currentFrame=1
this.fired=false}else{this.cannonSprite.currentFrame=0}},tick:function(){this.x+=this.speed*Math.cos(this.theta*Math.PI/180)
this.y+=this.speed*Math.sin(this.theta*Math.PI/180)
var newGridX=Math.floor((this.x)/Map.pitch)
if(this.gridX>=Map.width){if(this.x>=(Map.width*Map.pitch+Map.pitch/2)){this.scene.escaped+=1
this.destroySprites()}}else if(this.gridX!=newGridX){var oldArr=Map.grid[this.gridX][this.gridY]
oldArr.splice(oldArr.indexOf(this),1);this.gridX=newGridX
if(newGridX<Map.width){Map.grid[newGridX][this.gridY].push(this);}else{}}
this.target();this.modifySprites()},die:function(){this.destroySprites()
var anim=new CoinsAnimation(this.x,this.y-40)
this.scene.towerHealthLayer.attach(anim)
this.scene.objects.push(anim)
var moneyAnim=new MoneyAnimation(this.x-10,this.y-5,Math.floor(this.price))
this.scene.objects.push(moneyAnim)
if(Map.grid[this.gridX]&&Map.grid[this.gridX][this.gridY]){var cell=Map.grid[this.gridX][this.gridY];var res=cell.splice(cell.indexOf(this),1);}
this.scene.money+=Math.floor(this.price);this.scene.stats.creepsDestroyed++
this.scene.score+=Math.round(this.maxHp/100)*this.scene.config.level},destroySprites:function(){this.dead=true
this.cannonSprite.destroy()
this.shadowSprite.destroy()
this.healthSprite.destroy()}})
var RedPlane=Class.create(Plane,{hp:125,maxHp:125,speed:6,power:1,rate:0.1,range:2,price:3,initImages:function(){this.images={base:Loader.images.game['red_air_craft.png'],fire:Loader.images.game['red_air_craft_in_action.png'],shadow:Loader.images.game['air_craft_shade.png']}}})
var Animation=Class.create({x:0,y:0,dead:false,currentFrame:0,delay:1,delayIndex:0,dx:20,dy:20,fps:0,score:0,initialize:function(x,y){this.visible=true
this.frames=[]
this.x=x;this.y=y;this.initImages()},initImages:function(){},tick:function(){this.delayIndex++
if(this.delayIndex>=this.delay){this.delayIndex=0
this.currentFrame++}
if(!this.frames[this.currentFrame+'.png']){this.finish();}},render:function(ctx){if(this.frames[this.currentFrame+'.png'])
ctx.drawImage(this.frames[this.currentFrame+'.png'],this.x-this.dx/2,this.y-this.dy/2)},finish:function(){this.dead=true
this.layer=null}})
var CreepBoom=Class.create(Animation,{dx:32,dy:32,initImages:function(){this.frames=Loader.animations.creep_boom}})
var NukeBoom=Class.create(Animation,{dx:640,dy:480,initImages:function(){this.frames=Loader.animations.nuke_boom}})
var CoinsAnimation=Class.create(Animation,{dx:16,dy:30,initImages:function(){this.frames=Loader.animations.coins}})
var HealAnimation=Class.create(Animation,{dx:22,dy:44,initImages:function(){this.frames=Loader.animations.health_point}})
var ArrowAnimation=Class.create(Animation,{dx:0,dy:0,increment:0,initImages:function(){this.frames=Loader.animations.arrow},tick:function(){if(this.increment==60){this.increment=0;this.x-=60}
this.x+=3
this.increment+=3
this.currentFrame=1}})
var VerticalArrowAnimation=Class.create(Animation,{dx:0,dy:0,increment:0,initImages:function(){this.frames=Loader.animations.vertical_arrow},tick:function(){if(this.increment==60){this.increment=0;this.y-=60}
this.y+=3
this.increment+=3
this.currentFrame=1}})
var WeakAnimation=Class.create(Animation,{type:'weak',tick:function(){},render:function(ctx){game.scene.creeps.each(function(creep){ctx.drawImage(Loader.images.game['weak.png'],creep.x-16,creep.y-16)})}})
var MoneyAnimation=Class.create(Animation,{increment:0,initialize:function($super,x,y,money){this.money=money
$super(x,y)
this.frames=Loader.animations.coins},initImages:function(){this.parent=$('gameElements');this.div=document.createElement('div');this.div.innerHTML="+"+this.money
var divIdName='moneyAnimation';this.div.setAttribute('id',divIdName);this.div.style.position="absolute"
this.div.style.top=this.y
this.div.style.left=this.x
this.image=Loader.animations.coins[this.currentFrame+'.png']
this.parent.appendChild(this.div);},tick:function(){if(this.increment==30)this.finish()
this.increment+=3
this.y-=3
this.div.style.top=this.y},finish:function($super){$super()
this.parent.removeChild(this.div)}})
var SuperWeapon=Class.create({factor1:0,factor2:0,cooldown:15,initialize:function(scene,options){this.scene=scene
var options=options||{}
this.active=true
this.count=options.count||0
this.progressInterval=options.progressInterval||1
this.type=options.type},fire:function(){if(!this.active)return
try{this.action()
this.clockEffect($$('#gameElements .superWeapons .'+this.type+' img').first(),this.cooldown)}catch(e){}},render:function(){},action:function(){},activate:function(){this.active=true
this.renderActivate()},progressTick:function(){this.progress++
this.notify(this.progress)
if(this.progress==this.coolDown){if(this.count>0)this.activate()}else{var self=this
this.scene.reactor.push(this.progressInterval,function(){self.progressTick()})}},clockEffect:function(img,delay){this.active=false
var image=img
var canvas=document.createElement('canvas')
canvas.width=image.width
canvas.height=image.height
canvas.style.position='absolute'
canvas.style.left='0px'
var ctx=canvas.getContext('2d')
var angle=0
image.parentNode.appendChild(canvas)
var self=this
function tick(){ctx.clearRect(0,0,300,300)
ctx.drawImage(overlay,0,0)
ctx.save()
ctx.globalCompositeOperation='destination-out'
ctx.fillStyle="white";ctx.translate(image.width/2,image.height/2)
ctx.rotate(-(Math.PI/180)*90)
ctx.beginPath();ctx.arc(0,0,(image.width>image.height?image.width:image.height)+5,0,(Math.PI/180)*angle,false);ctx.lineTo(0,0)
ctx.closePath();ctx.fill()
ctx.restore()
angle=angle+(360/(delay*1000/50))
if(angle>360){self.active=true
image.parentNode.removeChild(canvas)
return}
self.scene.push(50,tick)}
var overlay=Loader.images.background[this.type+'_button_off.png']
tick()},notify:function(progress){},deactivate:function(){this.active=false
this.renderDeactivate()},renderActivate:function(){var div=$$('#gameElements .superWeapons div.'+this.type)[0]
div.setOpacity(div.getOpacity()+0.05)
if(div.getOpacity()==0.7){var self=this
div.observe('click',function(){self.scene.fire(div.className)})
div.setOpacity(1)}else{var self=this
this.scene.push(this.progressInterval,function(){self.activate()})}},renderDeactivate:function(){var div=$$('#gameElements .superWeapons div.'+this.type)[0]
div.stopObserving('click')
div.setOpacity(0);}})
var Weak=Class.create(SuperWeapon,{action:function(){Sounds.play(Sounds.superWeapons.weak,true)
var anim=new WeakAnimation()
this.scene.scenario.notify({name:"superWeaponsNuke",method:false,unit:this.scene.creeps.random()})
this.scene.objects.push(anim)
this.scene.rocketsLayer.attach(anim)
var self=this
this.weak(0)},weak:function(count){var self=this
this.scene.creeps.each(function(creep){creep.takeHit(Math.floor(creep.hp*self.factor1));})
count++
var self=this
if(count<self.factor2){this.scene.push(1000,function(){self.weak(count);})}
else self.unWeak()},unWeak:function(){var index=-1
this.scene.objects.each(function(obj,i){if(index==-1&&obj.constructor==WeakAnimation){index=i}})
var anim=this.scene.objects.splice(index,1)[0]
anim.layer=null}})
var Splash=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsSplash",method:false,unit:this.scene.creeps.random()})
var x=[0,Map.width*Map.pitch-1][Math.round(Math.random())]
var y=[0,Map.height*Map.pitch-1][Math.round(Math.random())]
Sounds.play(Sounds.turret.rocketLaunch,true)
Sounds.play(Sounds.turret.rocketLaunch,true)
var self=this
this.scene.creeps.sort(function(a,b){return b.hp-a.hp}).slice(0,self.factor2).each(function(creep){self.scene.rockets.push(new PatriotRocket(0,0,self.scene,{theta:0,targetUnit:creep,x:x,y:y,power:creep.maxHp*self.factor1,speed:15}))})}})
var Nuke=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsNuke",method:false,unit:this.scene.creeps.random()})
Sounds.play(Sounds.superWeapons.nuke,true)
function startNuke(){this.scene.creeps.each(function(creep){creep.takeHit(Math.round(creep.hp*1));})
var anim=new NukeBoom(320,240)
this.scene.objects.push(anim)
this.scene.rocketsLayer.attach(anim)}
this.scene.push(1000,startNuke,this)}})
var Heal=Class.create(SuperWeapon,{action:function(){this.scene.scenario.notify({name:"superWeaponsHeal",method:false,unit:this.scene.turrets.random()})
Sounds.play(Sounds.superWeapons.heal,true)
var self=this
self.scene.turrets.each(function(tower){tower.hp=Math.min(tower.maxHp,tower.hp+tower.maxHp*self.factor1)
var anim=new HealAnimation(tower.x,tower.y-43)
self.scene.objects.push(anim)
self.scene.rocketsLayer.attach(anim)})}})
var Hyper=Class.create(SuperWeapon,{action:function(){var self=this
this.scene.scenario.notify({name:"superWeaponsHyper",method:false,unit:this.scene.turrets.random()})
Sounds.play(Sounds.superWeapons.hyper,true)
var hyper=function(tower){tower.rate*=self.factor1;}
this.scene.turrets.each(hyper)
this.scene.push(self.factor2*1000,function(){self.unHyper();})
this.scene.towerMutators.push({name:'hyper',action:hyper})},unHyper:function(){var self=this
self.scene.turrets.each(function(tower){tower.rate/=2;});var index=-1
this.scene.towerMutators.splice(index,1)}})
var UpgradeData={selectedUpgrade:null,bullets:{affects:[Turret,DoubleTurret],list:[{price:0,classes:['bullets_1'],effect:{}},{price:120,classes:['bullets_2'],effect:{rate:1.5}}]},rockets:{affects:[RocketLauncher,Patriot],list:[{price:0,classes:['rockets_1'],effect:{}},{price:120,classes:['rockets_2'],effect:{rate:1.5}}]},shields:{affects:[Turret,DoubleTurret,RocketLauncher,Patriot],list:[{price:0,classes:['shields_1'],effect:{}},{price:120,classes:['shields_2'],effect:{maxHp:1.5,hp:1.5}}]}}
var Upgrades={init:function(){this.data=Nezal.clone_obj(UpgradeData)
this.selectDefault()},selectDefault:function(){if($$('#gameElements .upgrades .upgradeItem.bullets')[0]){$$('#gameElements .upgrades .upgradeItem.bullets')[0].addClassName('selected');Upgrades.data.selectedUpgrade=Upgrades.data['bullets']}},select:function(){if(this.id==null||this.id=='')return
$$('#gameElements .upgrades .upgradeItem').invoke('removeClassName','selected')
this.addClassName('selected')
Upgrades.data.selectedUpgrade=Upgrades.data[this.id]},upgrade:function(){var item=Upgrades.data.selectedUpgrade
if(!item.list[1])return
if(!item||game.scene.money<item.list[1].price)return
item.list.shift()
game.scene.money-=item.list[0].price
item.affects.each(function(tower){var values=eval(game.config.towers.find(function(t){return eval(t)==tower})).prototype
for(p in item.list[0].effect){if(values[p]){values[p]=Math.round(values[p]*item.list[0].effect[p]*100)/100
game.scene.turrets.each(function(t){if(t.constructor==tower){t[p]=Math.round(t[p]*item.list[0].effect[p]*100)/100}})}}})
$('towerInfo').innerHTML=''},render:function(){if(Upgrades.data.selectedUpgrade){var item=Upgrades.data.selectedUpgrade
$('currentUpgrade').className="upgrade current active "+item.list[0].classes[0]
if(item.list[1]){if(game.scene.money<item.list[1].price){$('nextUpgrade').className="upgrade next "+item.list[1].classes[0]+" off"}else{$('nextUpgrade').className="upgrade next "+item.list[1].classes[0]}
$('upgradePrice').innerHTML='$'+item.list[1].price}else{$('nextUpgrade').className="upgrade next blocked"
$('upgradePrice').innerHTML=''}}}}
var Tutorial=Class.create({count:0,initialize:function(scene,ctx){this.scene=scene
this.scene.money=30
this.tutorialScene=new Scene(50)
this.tutorialLayer=new Layer(ctx);this.tutorialLayer.clear=true
this.tutorialScene.layers.push(this.tutorialLayer)
var self=this
var arr=['Splash','Heal','Hyper','Weak','Nuke']
this.tutorialScene.start()
$$('#gameElements .superWeapons div').each(function(div){div.hide()})
this.content=$$('#modalWindow .content').first()
this.ok=$$('#modalWindow #ok').first()
this.step1()},hide:function(){$('modalWindow').hide()},step1:function(){$('modalWindow').show()
this.viewMessage(0)
var self=this
this.ok.observe('click',function(){self.ok.stopObserving('click')
self.viewMessage(1)
self.ok.observe('click',function(){self.ok.stopObserving('click')
self.viewMessage(2)
self.ok.observe('click',function(){self.viewMessage(3)
self.ok.stopObserving('click')
self.ok.observe('click',self.hide)
self.placeTower()})})})},viewMessage:function(num){$('modalWindow').hide();Effect.Appear('modalWindow',{duration:0.5});this.content.innerHTML=window.Text.game.tutorial['msg'+(num+1)]},placeTower:function(){this.ok.hide()
this.validate=GhostTurret.validate
GhostTurret.validate=function(){GhostTurret.valid=true
if((this.xGrid!=4||this.yGrid!=4)){GhostTurret.valid=false}}
var anim=this.addArrowAnim(505,130)
anim2=this.addArrowAnim(500,400)
var self=this
$$('.towers .Turret').invoke('observe','click',function(){self.step2(this,anim,anim2)})},step2:function(div,anim,anim2){$$('.towers .Turret').first().stopObserving('click')
$('modalWindow').show()
anim.finish()
anim2.finish()
GhostTurret.select(div)
var self=this
self.ok.stopObserving('click')
self.ok.observe('click',self.hide)
self.viewMessage(4)
anim.finish()
anim=self.addVerticalArrowAnim(120,40)
self.droppingGroundClick=GhostTurret.droppingGroundClick
GhostTurret.droppingGroundClick=tutorialGroundClicked
function tutorialGroundClicked(e){if(e.x){var x=Math.floor(e.layerX/32)
var y=Math.floor(e.layerY/32)}else{var x=Math.floor(e.x/32)
var y=Math.floor(e.y/32)}
GhostTurret.validate(x,y);if(GhostTurret.valid){anim2=self.addVerticalArrowAnim(50,350)
GhostTurret.droppingGroundClick=self.droppingGroundClick
self.droppingGroundClick(e)
GhostTurret.validate=self.validate
anim.finish()
self.viewMessage(5)}}
$$('#gameElements .start').first().observe('click',function(){self.startAttack(anim,anim2)})},startAttack:function(anim,anim2){this.ok.show()
anim.finish()
anim2.finish()
$('modalWindow').hide()
$$('#gameElements .start').first().stopObserving('click')
$$('#gameElements .startText').first().innerHTML="Playing"
this.scene.sendWaves(this.scene.config)},initiateSuperWeapon:function(){var anim=this.addArrowAnim(440,130)
var self=this
this.scene.reactor.pause()
$('modalWindow').show()
this.viewMessage(6)
this.ok.hide()
$$('#gameElements .superWeapons .splash').first().show()
$$('#gameElements .superWeapons .splash').first().observe('click',function(){self.fireSuperWeapon("splash",anim)})},fireSuperWeapon:function(weapon,anim){$('modalWindow').hide()
this.scene.reactor.resume()
anim.finish()
this.scene.fire(weapon)
var self=this},planesAttack:function(){this.ok.show()
$('modalWindow').show()
var self=this
self.viewMessage(8)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()})},wishLuck:function(){this.ok.show()
$('modalWindow').show()
var self=this
self.viewMessage(9)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.pause()
self.hide();Intro.newbieNoMore()
$("gameStart").innerHTML=Intro.templates['game'];})},waveEffect:function(){$('modalWindow').show()
var self=this
self.viewMessage(10)
self.scene.reactor.pause()
self.ok.stopObserving('click')
self.ok.observe('click',function(){self.scene.reactor.resume();self.hide()
self.scene.push(6000,function(){game.tutorial.initiateSuperWeapon()})})},addArrowAnim:function(x,y){var anim=new ArrowAnimation(x,y)
this.tutorialLayer.attach(anim)
this.tutorialScene.objects.push(anim)
return anim},addVerticalArrowAnim:function(x,y){var anim=new VerticalArrowAnimation(x,y)
this.tutorialLayer.attach(anim)
this.tutorialScene.objects.push(anim)
return anim},messages:["Welcome to the academy of defense.</br>"
+"</br>During this training period, you will get all the required information, and gain the basic skills that are needed to defend your city against any hostile activities. </br>","</br>Your goal is to kill all coming waves of enemy units and prevent them from passing to your city </br>","You can always see your current rank at the top right of the map </br>"
+"</br>The upper bar indicates your rank progress, the wave number, your score in this game and the remaining enemy units to escape that indicate your loss</br>","Now it is time to place some towers. Click on the Belcher tower in the towers box.</br>"
+"Notice that the tower information will be visible in the information box.","Click on the highlighted area to place the tower. ","Place more towers as long as you have enough gold. then press start to begin the battle","You can always use super weapons on demand. ","click on a tower to see it's abilities, sell or upgrade it","Finally, there is an important hint you need to know before finishing this training. Air units do not respect any path, they simply fly over anything.","That is it soldier, you are now ready to defend your city against any hostile activities. I am sure you will do your best to complete all missions assigned to you."
+"</br>Do not forget to like us and bookmark  us to get a nice reward. Good Luck.","After each wave enemies get stronger, so prepare yourself well"]})
var Scenario=Class.create({events:[],currentEvent:null,scenario:{},eventNames:{},eventRunning:false,firstTick:0,initialize:function(scene){this.scene=scene
this.formScenario()},notify:function(event){var x=Math.random()
if(x<0.1&&event.unit){event['tick']=0
event['created']=false
event['finished']=false
this.events.push(event)
this.eventNames[event.name]=true}},start:function(){this._speak()},_speak:function(){try{for(var i=0;i<this.events.size();i++){var event=this.events[i]
if(event.tick<4){if(event.created)
event.tick++
else{if(event.unit.baloon){event.finished=true}
else if(event.unit&&!event.unit.dead){var baloonNum=2
if(event.unit.parent=="creep")baloonNum=1
event.unit.createBaloon(baloonNum)
event.created=true
event.unit.baloon.text.innerHTML=this.scenario[event.name].random()
if(event.method)this[event.name]()}}}else{if(event.unit&&!event.unit.dead&&event.unit.baloon)event.unit.destroyBaloon()
event.finished=true}}
var arr=[]
for(var i=0;i<this.events.size();i++){if(!this.events[i].finished){arr.push(this.events[i])}}
this.events=arr
var self=this
this.scene.push(500,function(){self._speak()})}catch(e){console.log(e)}},formScenario:function(){this.scenario['creepDestroyed']=["ARRGGHH!","NOOO!!!","SEE YOU IN HELLLL!","I AM DYING!!","OUCH!!","#3aaaa!","TEEET!","#^$?!"]
this.scenario['towerDestroyedCreep']=["Who's next?!","BRING IT ON!!!","Die, Die, Die","Did it hurt?","Take that!"]
this.scenario['towerDestroyed']=["ARRGGHH!","NOOO!!!","I DIE IN HONOR!","I AM DYING!!","OUCH!!","#3aaaa!","TEEET!","#^$?!"]
this.scenario['creepDestroyedTower']=["Oops, was that a tower?","WE WILL CRUSH'em!!!","Die, Die, Die","Hurray!","Take that!","FATALITY!"]
this.scenario['superWeaponsHeal']=["Just in time!","Thanks Man!","Feels Better!"]
this.scenario['superWeaponsWeak']=["I AM BLIND!","Cough, cough!","I feel s l e e p y!"]
this.scenario['superWeaponsSplash']=["What is this?!","Run!!","Rockets, Run!"]
this.scenario['superWeaponsNuke']=["Wha..","Ru...","I see a ...","Lights ...","#3aaaa.."]
this.scenario['superWeaponsHyper']=["COFFEE!!","GOOD STUFF!!","I AM HYPER!!","WEEHAAAA!"]
this.scenario['creepEntered']=["Born to destroy!!","ATTAAACK!!","RUN THEM OVER!!","CRUSH THEM!"]
this.scenario['creepEnteredTower']=["BRING IT ON!!","HOLD!!","STAND YOUR GROUND!!","That's all you got?"]}})
var RangeSprite=Class.create(Sprite,{initialize:function(range){this.range=range
this.visible=false},render:function(ctx){ctx.save()
ctx.translate(Map.transform(this.x)-Map.pitch,Map.transform(this.y))
ctx.fillStyle='rgba(255,255,255,0.5)'
ctx.beginPath();ctx.arc(Map.pitch*1.5,Map.pitch*0.5,this.range*Map.pitch,0,Math.PI*2,false)
ctx.closePath();ctx.fill();ctx.restore()}})
var IncomingWaves={init:function(container,template,divId,reactor){this.reactor=reactor
this.divId=divId
this.wave=0
this.step=5
this.waveWidth=154
$(container).innerHTML=TrimPath.parseTemplate($(template).value).process()
this.div=$(this.divId)
this.div.style.width=Config.waves.length*this.waveWidth
this.div.style.left=-154*(Config.waves.length-3)
this.div.children[this.wave].addClassName('active')},nextWave:function(){this.div.children[this.wave].removeClassName('active')
this.div.children[this.wave].addClassName('passed')
this.wave++
this.div.children[this.wave].addClassName('active')
this.div=$(this.divId)
this.moved=0;this.reactor.push(0,this.advance,this)},advance:function(){this.div.style.left=Number(this.div.style.left.gsub('px',''))+this.step+'px'
this.moved+=this.step
if(this.moved>=this.waveWidth){this.div.style.left=Number(this.div.style.left.gsub('px',''))-this.moved+this.waveWidth+'px'
return}
this.reactor.push(1,this.advance,this)}}