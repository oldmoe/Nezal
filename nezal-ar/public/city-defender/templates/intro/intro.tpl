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
		<div id = "msg"> ${Text.intro.levelSelection.msg} </div>
		<div id = "challengesText"> ${Text.intro.levelSelection.title} </div>
    <div id="background">
      <img id="paper" src="${Loader.images.intro['paper.png'].src}"/>
      <img id="introText" src="${Loader.images.intro['text.png'].src}"/>
      <img id="logo" src="${Loader.images.intro['logo.png'].src}"/>
      <img id="title" src="${Loader.images.intro['title.png'].src}"/>
      <img id="blank" src="${Loader.images.intro['blank.png'].src}"/>
      <img id="titleAr" src="${Loader.images.intro['title-ar.png'].src}"/>
    </div>
    <div id="language">
      {for lang in Language.langsNames}
        {if (lang[0]==Language.userLanguage)}
          <div  id="selectedLang">
            <img id="selected" src="${Loader.images.intro['language.png'].src}"/>
            <div style="position : relative; top : -40px" >
              ${lang[1]}  
            </div>
          </div>
        {/if}
      {/for}
      {for lang in Language.langsNames}
        {if !(lang[0]==Language.userLanguage)}
          <div style="height : 25px;" language="${lang[0]}"
                onclick="Intro.selectLanguage(this)">
            ${lang[1]}
          </div>
        {/if}
      {/for}
    </div>
    <div id="levels">
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
      <img src="${Loader.images.intro['background.png'].src}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].src}"/>
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
      <img id="camp-map" src="${Loader.challenges[GameConfigs.campaign]['images/camp-map.png'].src}"/>
    </div>  
    <div id="missions">
      {for mission in Intro.campaignData.camp_data.metadata }
          {if (Intro.campaignData.user_data.metadata.missions[mission['order'] - 1]) }  
            <div class="mission clickableButton">
              <div path="${mission['path']}" onclick="Intro.selectMission(this); Intro.next();" class="clickSound" >
                <img id="${mission['path']}" 
                   src="${Loader.challenges[GameConfigs.campaign]['images/'+mission.path+'/mission_active.png'].src}"/>
              </div>
              <div class="missionName">
                ${Intro.campaignData.missionsInfo[mission.path]['name']}
              </div>
            </div>
          {else}
            <div class="mission">
              <img id="${mission['path']}" 
                 src="${Loader.challenges[GameConfigs.campaign]['images/'+mission.path+'/mission_inactive.png'].src}"/>
              <div class="missionName">
                ${Intro.campaignData.missionsInfo[mission.path]['name']}
              </div>
            </div>
          {/if}
      {/for}
    </div>
    <div id="backContainer">
      <div id="back" onclick="Intro.previous();" class="clickableButton clickSound">
        <img src="${Loader.images.intro['back.png'].src}" style="margin-left : -30px;"/>
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
      <img src="${Loader.images.intro['background.png'].src}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].src}"/>
      <img id="character" src="${Loader.images.intro['mission/character.png'].src}"/>
      <img id="buble" src="${Loader.images.intro['mission/buble.png'].src}"/>
      <img id="mapBackground" src="${Loader.images.intro['mission/map.png'].src}"/>
      <img id="creepBackground" src="${Loader.images.intro['mission/creep.png'].src}"/>
    </div>
    <div id="cityName">
        ${city.name}
    </div>
    <div id="cityDesc">
        ${city.summary}
    </div>
    <div id="cityImage">
        <img src="${Loader.challenges[GameConfigs.campaign]['images/camp-map.png'].src}">
    </div>
    <div id="fullDesc">
        ${city.description}    
    </div>
    <div id="cityMap">       
      <img src="${Loader.challenges[GameConfigs.campaign]['images'+path+'/path.png'].src}"
           style="width:222px;">
    </div>
    <div id="accept" onclick="Intro.next();" class="clickableButton clickSound">
      <img src="${Loader.images.intro['mission/accept.png'].src}" >
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
    		            <img src="${Loader.images.intro['creeps/'+creepConfig[creep]['image']].src}" > </img>
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
      <img src="${Loader.images[GameConfigs.language]['confidintial-stamp.png'].src}"> </img>
    </div>
</textarea>


<textarea id='marketItemDetailsTemplate' style="display:none">
    <div class="content"> 
      <div class="spans">
        <div class="name">  ${data.configs[data.itemid]['name']} </div>
        <div class="desc">  
          ${data.configs[data.itemid]['desc']} 
        </div>
      </div>
      <div class="image">
        <div>
          <div style="width:90px; display : inline-block; height : 5px;"> </div>
          <div id="close" onclick="Intro.hideFloatBg();" class="clickSound">x</div>
        </div>
        <div class="skeleton">
          <img src="${Loader.images.intro[data.type+'/'+data.configs[data.itemid]['skeleton']].src}" 
            {if (data.type=='weapons')}
              style="padding-top : 20px;"
            {/if}
           />
        </div>
        <div class="cost">
            <div class="img">
              <img src="${Loader.images.intro['market/coin.png'].src}"></img>
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
          Required Rank : 
        </span>
        <img src="${Loader.images.intro['ranks/'+data.rank[1]+'.png'].src}"> </img>
      </div>
      <div class="action  clickableButton">
          {if (!Intro.userData.metadata[data.type][data.itemid])}
            {if ((data.cost > data.coins) || ( data.rank[0] > data.exp))}
              <div class="addMoney" >
              {if (data.cost > data.coins)}
                  <img src="${Loader.images.intro['market/money.png'].src}" > </img>
              {/if}
              </div>
              <span class="inactive"> unlock </span>
            {else}
              <div class="addMoney" >
              </div>
              <span class="active action clickSound" itemid="${data.itemid}" 
                    type="${data.type}" onclick="Intro.unlockItem(this);"> unlock </span>
            {/if}
          {/if}
      </div>
    </div>
</textarea>

<textarea id='marketItemsTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
    </div>
    <div id="background">
      <img src="${Loader.images.intro['background.png'].src}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].src}"/>
    </div>
    <div id="upperPart">
        <img src="${Loader.images.intro['market/upper.png'].src}"/>
        <div class="rank">
          <img class="rankImg" src="${Loader.images.intro['ranks/'+Intro.userData.rank +'.png'].src}"/>
          <div class="rankText">
            ${data.userData['rank']}
          </div>
        </div>
        <img class="titleImg" src="${Loader.images.intro['title.png'].src}"/>
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
      <img  src="${Loader.images.intro['market/scroller.png'].src}"/>
      <div class="msg">
          ${Text.intro.marketPlace.addWeapon}
      </div>
      <div id="weaponsDisplay">
      </div>
    </div>
    
    <div id="towers">
      <img  src="${Loader.images.intro['market/scroller.png'].src}"/>
      <div class="msg">
          ${Text.intro.marketPlace.addTower}
      </div>
      <div id="towersDisplay">
      </div>
    </div>
    
    <div id="back" onclick="Intro.previous();" class="buttonText clickableButton clickSound" >
      <div id="backText">
        ${Text.intro.marketPlace.back}
      </div>
      <img  src="${Loader.images.intro['back.png'].src}"/>
    </div>
    <div id="ready" onclick="Intro.next();" class="buttonText clickableButton clickSound">
      <div id="readyText">
        ${Text.intro.marketPlace.ready}
      </div>
      <img  src="${Loader.images.intro['ready.png'].src}"/>
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
		                  src="${Loader.images.intro['market/coin.png'].src}"> </img>
                <div class="itemPrice">${Intro.gameData[type][item].cost}</div>
		            <img class="itemImage" 
		                  src="${Loader.images.intro[type+'/'+itemConfig[item]['image']].src}"> </img>
                {if (!Intro.userData.metadata[type][item])}
  		            <img class="lockImage"  
		                    src="${Loader.images.intro['market/lock.png'].src}"> </img>
                {/if}
                <div id="info" style="display : none;">
                  {if (!Intro.userData.metadata[type][item])}
                    <div>
                      <div class="unlockText" type="${type}" itemid="${item}"
                            onclick="Intro.showFloatBg(this)">
                          ${Text.intro.marketPlace.unlock}
                      </div>
      		            <img class="unlockImage"  
  		                      src="${Loader.images.intro['market/unlock.png'].src}"/>
                    </div>
                  {else}
                    {if (Intro.userData.metadata[type][item]['upgrades'] < 
                         Intro.gameData[type][item]['upgrades'].length )}
                      <div>
                        <div class="unlockText clickableButton">
                          ${Text.intro.marketPlace.upgrade}
                        </div>
        		            <img class="unlockImage"  
        		                  src="${Loader.images.intro['market/unlock.png'].src}"/>
                      </div>
                    {/if}
                  {/if}
  		            <img class="infoImage"  
		                  src="${Loader.images.intro['market/info.png'].src}"
		                  type="${type}" itemid="${item}" onclick="Intro.showFloatBg(this)"/>
                </div>
		          </li>
            {/for}
		        {for item in data.gameData.empty[type] }  
  		        <li>
		            <img class="qBoxImage" 
		                  src="${Loader.images.intro['market/q-box.png'].src}"> </img>
		          </li>
		        {/for}
          </ul>
        </div>
        <div class="right"><img src=""/></div> 
    </div>
</textarea>
