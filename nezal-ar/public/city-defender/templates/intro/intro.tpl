<textarea id='challengesTemplate' style="display:none">
    {for challenge in challenges}
    <div class="challenge" title="${challenge["campaign"]['path']}" id="challenge_${challenge["campaign"]['name']}">
      <a href="" onclick="challenge_on_click(this); return false;" path="${challenge['campaign']['path']}">
        ${challenge["campaign"]['name']}
      </a>
      {eval} 
        challenge_on_click = function(element) {
          ChallengeSelector.select(element.getAttribute("path"));
        }
      {/eval}
    </div>
    {/for}
</textarea>

<textarea id='levelSelectionTemplate' style="display:none">
    <div id="background">
      <img id="paper" src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
      <img id="introText" src="${Loader.images.intro['text.png'].getAttribute('data')}"/>
      <img id="logo" src="${Loader.images.intro['logo.png'].getAttribute('data')}"/>
      <img id="title" src="${Loader.images.intro['title.png'].getAttribute('data')}"/>
      <img id="blank" src="${Loader.images.intro['blank.png'].getAttribute('data')}"/>
      <img id="titleAr" src="${Loader.images.intro['title-ar.png'].getAttribute('data')}"/>
    </div>
    {for lang in Language.langsNames}
      {if (lang[0]==Language.userLanguage)}
          <div  id="selectedLang" class="clickableButton clickSound" 
                onclick="$$('#levelSelection #language')[0].toggle(); return false;">
            <img id="selected" src="${Loader.images.intro['language.png'].getAttribute('data')}"/>
            <div style="position : relative; top : -33px" >
              ${lang[1]}  
            </div>
          </div>
      {/if}
    {/for}
    <div id="language" style="display:none;">
      {for lang in Language.langsNames}
        {if !(lang[0]==Language.userLanguage)}
          <div style="height : 25px;" language="${lang[0]}" class="clickSound clickableButton"
                onclick="Intro.selectLanguage(this)">
            ${lang[1]}
          </div>
        {/if}
      {/for}
    </div>
		<div id = "msg"> ${Text.intro.levelSelection.msg} </div>
		<div id="tutorial"> 
		  <div style="width : 70%; display:inline-block; height:10px;"></div>
		  <div class="clickableButton clickSound tutorialText" onclick="Intro.displayTutorial(); return false;">
  		  ${Text.intro.levelSelection.tutorial} 
		  </div>
	  </div>
		<div id = "challengesText" class="title clickableButton clickSound"
	       onclick="this.removeClassName('clickableButton');
          	      this.addClassName('clicked');
          	      if(this.hasClassName('clickSound'))
            	      Sounds.play(Sounds.gameSounds.click);
          	      this.removeClassName('clickSound');
          	      this.stopObserving('click');
          	      $$('#levelSelection #levels')[0].show(); return false;"> ${Text.intro.levelSelection.title} </div>
    <div id="levels" style="display : none;">
        <span id="easy" onclick="GameConfigs.level=1; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.easy}
          <span style="font-size:14px;text-transform:lowercase;"> 1 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
        <span id="medium" onclick="GameConfigs.level=2; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.medium}
          <span style="font-size:14px;text-transform:lowercase;"> 2 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
        <span id="hard" onclick="GameConfigs.level=3; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.hard}
          <span style="font-size:14px;text-transform:lowercase;"> 3 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
    </div>
		<div id="extraMap" class="title clickableButton clickSound" style="display : none;"
		      onclick="this.removeClassName('clickableButton');
          	      this.addClassName('clicked');
          	      if(this.hasClassName('clickSound'))
            	      Sounds.play(Sounds.gameSounds.click);
          	      this.removeClassName('clickSound');
          	      this.stopObserving('click');
          	      $$('#levelSelection #extraLevels')[0].show(); return false;"> ${Text.intro.levelSelection.extraMaps} </div>
    <div id="extraLevels" style="display : none;">
        <span id="easy" onclick="GameConfigs.level=1; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.easy}
          <span style="font-size:14px;text-transform:lowercase;"> 1 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
        <span id="medium" onclick="GameConfigs.level=2; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.medium}
          <span style="font-size:14px;text-transform:lowercase;"> 2 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
        <span id="hard" onclick="GameConfigs.level=3; Intro.next(); return false;" class="clickSound">
          ${Text.intro.levelSelection.hard}
          <span style="font-size:14px;text-transform:lowercase;"> 3 </span>
          <span style="font-size:14px;text-transform:lowercase;"> ${Text.intro.levelSelection.score} </span>
        </span>
    </div>
</textarea>


<textarea id='campaignTemplate' style="display:none">
    <div id="background">
      <img src="${Loader.images.intro['background.png'].getAttribute('data')}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
    </div>
    <div class="camp-info">
      <div class="camp-details">
        <div class="name">
          ${camp['name']}
        </div>
        <div class="desc">
          ${camp['description']}
        </div>
      </div>
      <img id="camp-map" src="${Loader.challenges[GameConfigs.campaign]['images/flag.png'].getAttribute('data')}"/>
    </div>  
    <div id="missions">
      {for mission in Intro.campaignData.camp_data.metadata }
          {if (Intro.campaignData.user_data.metadata.missions[mission['order'] - 1]) }  
            <div class="mission clickableButton">
              <div path="${mission['path']}" onclick="Intro.selectMission(this); Intro.next();" class="clickSound" >
                <img id="${mission['path']}" 
                   src="${Loader.challenges[GameConfigs.campaign]['images/'+mission.path+'/mission_active.png'].getAttribute('data')}"/>
              </div>
              <div class="missionName">
                ${Intro.campaignData.missionsInfo[mission.path]['name']}
              </div>
            </div>
          {else}
            <div class="mission">
              <img id="${mission['path']}" 
                 src="${Loader.challenges[GameConfigs.campaign]['images/'+mission.path+'/mission_inactive.png'].getAttribute('data')}"/>
              <div class="missionName">
                ${Intro.campaignData.missionsInfo[mission.path]['name']}
              </div>
            </div>
          {/if}
      {/for}
    </div>
    <div id="backContainer">
      <div id="back" onclick="Intro.previous();" class="clickableButton clickSound">
        {if ($('intro').getStyle('direction')=='rtl') }
          <img src="${Loader.images.intro['ready.png'].getAttribute('data')}"/>
        {else}
          <img src="${Loader.images.intro['back.png'].getAttribute('data')}"/>
        {/if}
        <div class="text buttonText">
            ${Text.intro.campaign.back}
        </div>
      </div>
    </div>
</textarea>


<textarea id='missionTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
      <div class="content"> 
        <div class="spans">
          <span class="name">   </span>
          :
          <span class="desc">   </span>
        </div>
        <div class="skeleton">
          <img src=""></img>
        </div>
      </div>
      <div id="close" onclick="Intro.hideFloatBg();" class="clickSound"> X </div>
    </div>
    <div id="background">
      <img src="${Loader.images.intro['background.png'].getAttribute('data')}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
      <img id="character" src="${Loader.images.intro['mission/character.png'].getAttribute('data')}"/>
      <img id="buble" src="${Loader.images.intro['mission/buble.png'].getAttribute('data')}"/>
      <img id="mapBackground" src="${Loader.images.intro['mission/map.png'].getAttribute('data')}"/>
      <img id="creepBackground" src="${Loader.images.intro['mission/creep.png'].getAttribute('data')}"/>
    </div>
    <div id="cityName">
        ${city.name}
    </div>
    <div id="cityDesc">
        ${city.summary}
    </div>
    <div id="cityImage">
        <img src="${Loader.challenges[GameConfigs.campaign]['images/flag.png'].getAttribute('data')}">
    </div>
    <div id="fullDesc">
        ${city.description}    
    </div>
    <div id="cityMap">       
      <img src="${Loader.challenges[GameConfigs.campaign]['images'+path+'/path.png'].getAttribute('data')}"
           style="width:222px;">
    </div>
    <div id="accept" onclick="Intro.next();" class="clickableButton clickSound">
      <img src="${Loader.images.intro['mission/accept.png'].getAttribute('data')}" >
      <div class="text buttonText">
        ${Text.intro.mission.accept}
      </div>
    </div>
    <div id="reject" onclick="Intro.previous();" class="clickableButton clickSound">
      <span style="color : #550000; font-size: 12px;">${Text.intro.mission.or}</span> ${Text.intro.mission.goBack}
    </div>
    <div class="creepsHeadline">
      ${Text.intro.mission.msg}
    </div>
    <div id="creeps">
	      <div id="creeps-scroll">
	          <div class="left">
              <img src="">
	            </img>
            </div> 
	          <div id="creeps-container" class="container">
		          <ul id='creeps-ul'>
    		        {for creep in city.creeps }
    		          <li creepid="${creep}" onclick="Intro.showFloatBg(this)" class="clickSound">
    		            <img src="${Loader.images.intro['creeps/'+creepConfig[creep]['image']].getAttribute('data')}" > </img>
    		          </li>
		            {/for}
		          </ul>
	          </div>
	          <div class="right">
              <img src="">
              </img>
	          </div> 
        </div>
	  </div>
    <div id="creepBar">
    </div>
    <div id="stamp">
      <img src="${Loader.images[GameConfigs.language]['confidintial-stamp.png'].getAttribute('data')}"> </img>
    </div>
</textarea>


<textarea id='marketItemDetailsTemplate' style="display:none">
{if (data.upgrade)}
  <div id="upgrade">
{/if}
    <div class="content"> 
      <div class="spans">
        <div class="name">  ${data.configs[data.itemid]['name']} </div>
        <div class="desc">  
          ${data.configs[data.itemid]['desc']} 
        </div>
      </div>
      {if (data.upgrade && data.type=='towers')}
        <div class="upgradeInfo">
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.power}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${data.currUpgrade.power * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().power}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${(data.upgrade.power-data.currUpgrade.power) * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().power}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.power} </div>
                </div>
                <span class="towerText">
                  ${data.upgrade.power}
                </span>
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.range}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${data.currUpgrade.range * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().range}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${(data.upgrade.range-data.currUpgrade.range) * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().range}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.range} </div>
                </div>
                <span class="towerText">
                  ${data.upgrade.range}
                </span>
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.maxHp}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${data.currUpgrade.maxHp * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().maxHp}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${(data.upgrade.maxHp-data.currUpgrade.maxHp) * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().maxHp}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.maxHp} </div>
                </div>
                <span class="towerText">
                  ${data.upgrade.maxHp}
                </span>
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.rate*100}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${data.currUpgrade.rate * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().rate}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${(data.upgrade.rate-data.currUpgrade.rate) * 95 / Intro.gameData[data.type][data.itemid].upgrades.last().rate}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.rate} </div>
                </div>
                <span class="towerText">
                  ${data.upgrade.rate*100}
                </span>
            </div>
        </div>
      {/if}
      {if (data.upgrade && data.type=='weapons')}
        <div class="upgradeInfo">
          <div class="currUpgrade">
            ${Text.intro.upgrades[data.itemid][Intro.userData.metadata[data.type][data.itemid]['upgrades']-1]}
          </div>
          <div class="newUpgrade">
            ${Text.intro.upgrades[data.itemid][Intro.userData.metadata[data.type][data.itemid]['upgrades']]}
          </div>
        </div>
      {/if}
      <div class="image">
        <div>
          <div style="width:90px; display : inline-block; height : 5px;"> </div>
          <div id="close" onclick="Intro.hideFloatBg();" class="clickSound">x</div>
        </div>
        <div class="skeleton">
          <img src="${Loader.images.intro[data.type+'/'+data.configs[data.itemid]['skeleton']].getAttribute('data')}" 
            {if (data.type=='weapons')}
              style="padding-top : 20px;"
            {/if}
           />
        </div>
        <div class="cost">
            <div class="img">
              <img src="${Loader.images.intro['market/coin.png'].getAttribute('data')}"></img>
            </div>
            <div class="value">
              ${data.cost}  
            </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class='rank'>
        <span {if (data.rank[0] > data.exp)} "style="color:red;" {/if}>
          ${Text.intro.marketPlace.requiredRank} :
        </span>
        <img src="${Loader.images.intro['ranks/'+data.rank[1]+'.png'].getAttribute('data')}"> </img>
      </div>
      <div class="action">
          {if (!Intro.userData.metadata[data.type][data.itemid])}
            {if ((data.cost > data.coins) || ( data.rank[0] > data.exp))}
            <div  class="inactive">
              <span> ${Text.intro.marketPlace.unlock} </span>
            </div>
            {else}
            <div class="active">
              <span class="clickableButton clickSound" itemid="${data.itemid}" 
                    type="${data.type}" onclick="Intro.unlockItem(this);"> 
                  ${Text.intro.marketPlace.unlock}
              </span>
            </div>
            {/if}
          {else}
            {if (data.upgrade)}
                {if (Intro.userData.metadata[data.type][data.itemid]['upgrades'] < 
                         Intro.gameData[data.type][data.itemid]['upgrades'].length )}
               
                    {if ((data.cost > data.coins) || ( data.rank[0] > data.exp))}
                      <div  class="inactive">
                        <span> ${Text.intro.marketPlace.upgrade} </span>
                      </div>
                    {else}
                      <div class="active">
                        <span class="clickableButton clickSound" itemid="${data.itemid}" 
                              type="${data.type}" onclick="Intro.upgradeItem(this);"> 
                            ${Text.intro.marketPlace.upgrade}
                        </span>
                      </div>
                    {/if}
                {/if}
            {else}
                <div  class="inactive"></div>
            {/if}
          {/if}
          <div class="addMoney" >
            <img src="${Loader.images.intro['market/money.png'].getAttribute('data')}" > </img>
          </div>
      </div>
    </div>
{if (data.upgrade)}
  </div>
{/if}
</textarea>

<textarea id='marketItemsTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
    </div>
    <div id="background">
      <img src="${Loader.images.intro['background.png'].getAttribute('data')}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
    </div>
    <div id="upperPart">
        <img src="${Loader.images.intro['market/upper.png'].getAttribute('data')}"/>
        <div class="rank">
          <img class="rankImg" src="${Loader.images.intro['ranks/'+Intro.userData.rank +'.png'].getAttribute('data')}"/>
          <div class="rankText">
            ${Text.game.ranks[data.userData['rank']]['abbr']}
          </div>
        </div>
        <img class="titleImg" src="${Loader.images.intro['title.png'].getAttribute('data')}"/>
        <div class="coins">
          ${data.userData['coins']}
        </div>
        <div class="addMoney">
          <span class="addText">
            ${Text.intro.marketPlace.add}
          </span>
          <span class="moneyText">
            ${Text.intro.marketPlace.money}
          </span>
        </div>
    </div>
    <div id="weapons">
      <img  src="${Loader.images.intro['market/scroller.png'].getAttribute('data')}"/>
      <div class="msg">
          ${Text.intro.marketPlace.addWeapon}
      </div>
      <div id="weaponsDisplay">
      </div>
    </div>
    
    <div id="towers">
      <img  src="${Loader.images.intro['market/scroller.png'].getAttribute('data')}"/>
      <div class="msg">
          ${Text.intro.marketPlace.addTower}
      </div>
      <div id="towersDisplay">
      </div>
    </div>
    
    <div id="actionContainer">
      <div id="back" onclick="Intro.previous();" class="buttonText clickableButton clickSound" >
        {if ($('intro').getStyle('direction')=='rtl') }
          <img src="${Loader.images.intro['ready.png'].getAttribute('data')}"/>
        {else}
          <img src="${Loader.images.intro['back.png'].getAttribute('data')}"/>
        {/if}
        <div style="width : 30px; height : 10px;display:inline-block;"></div>
        <div id="backText">
          ${Text.intro.marketPlace.back}
        </div>
      </div>
      <div style="width : 450px; height : 10px;display:inline-block;"></div>
      <div id="ready" onclick="Intro.next();" class="buttonText clickableButton clickSound">
        {if ($('intro').getStyle('direction')=='rtl') }
          <img src="${Loader.images.intro['back.png'].getAttribute('data')}"/>
        {else}
          <img src="${Loader.images.intro['ready.png'].getAttribute('data')}"/>
        {/if}
        <div id="readyText">
          ${Text.intro.marketPlace.ready}
        </div>
        <div style="width : 30px; height : 10px;display:inline-block;"></div>
      </div>
    </div>
</textarea>

<textarea id='marketScrollerTemplate' style="display:none">
    <div id="${type}-scroll">
        <div class="left"><img src=""/></div> 
        <div id="${type}-container" class="container">
          <ul id="${type}-ul">
		        {for item in data.gameData[type] }
		          <li itemid="${item}" class="clickSound" 
	                onmouseover="this.select('#info')[0].show();"
	                onmouseout="this.select('#info')[0].hide();">
		            <img class="coinImage" 
		                  src="${Loader.images.intro['market/coin.png'].getAttribute('data')}"> </img>
                <div class="itemPrice">${Intro.gameData[type][item].cost}</div>
		            <img class="itemImage" 
		                  src="${Loader.images.intro[type+'/'+itemConfig[item]['image']].getAttribute('data')}"> </img>
                {if (!Intro.userData.metadata[type][item])}
  		            <img class="lockImage"  
		                    src="${Loader.images.intro['market/lock.png'].getAttribute('data')}"> </img>
                {else}
                  <div class="upgradeLevel">
                      ${Intro.userData.metadata[type][item]['upgrades']}
                  </div>
                {/if}
                <div id="info" style="display : none;">
                  {if (!Intro.userData.metadata[type][item])}
                    <div style="float:left; margin-left:5px;">
                      <div class="unlockText clickSound" type="${type}" itemid="${item}"
                            onclick="Intro.showFloatBg(this)">
                          ${Text.intro.marketPlace.unlock}
                      </div>
      		            <img class="unlockImage"  
  		                      src="${Loader.images.intro['market/unlock.png'].getAttribute('data')}"/>
                    </div>
                  {else}
                    {if (Intro.userData.metadata[type][item]['upgrades'] < 
                         Intro.gameData[type][item]['upgrades'].length )}
                      <div style="float:left; margin-left:5px;">
                        <div class="unlockText clickableButton clickSound" type="${type}"
                            itemid="${item}" upgrade="true"
                            onclick="Intro.showFloatBg(this)">
                          ${Text.intro.marketPlace.upgrade}
                        </div>
        		            <img class="unlockImage"  
        		                  src="${Loader.images.intro['market/unlock.png'].getAttribute('data')}"/>
                      </div>
                    {/if}
                  {/if}
  		            <img class="infoImage clickSound"  
		                  src="${Loader.images.intro['market/info.png'].getAttribute('data')}"
		                  type="${type}" itemid="${item}" onclick="Intro.showFloatBg(this)"/>
                </div>
		          </li>
            {/for}
		        {for item in data.gameData.empty[type] }  
  		        <li>
		            <img class="qBoxImage" 
		                  src="${Loader.images.intro['market/q-box.png'].getAttribute('data')}"> </img>
		          </li>
		        {/for}
          </ul>
        </div>
        <div class="right"><img src=""/></div> 
    </div>
</textarea>