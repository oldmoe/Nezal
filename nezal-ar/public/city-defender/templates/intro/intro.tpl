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


<textarea id='campaignTemplate' style="display:none">
    <img src="images/intro/campaign/campaign-bg.png"/>
    <div class="camp-details">
      <div class="name">
        ${camp['name']}
      </div>
      <div class="desc">
        ${camp['description']}
      </div>
    </div>
    <img id="camp-map" src="challenges/current/images/camp-map.png"/>
    <div id="missions">
      {for mission in Intro.campaignInfo.camp_data.metadata }
          {if (Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1]) }  
            <div class="mission clickable">
              <div>
                <img id="${mission['path']}" path="${mission['path']}" src="challenges/current/${mission['path']}/images/mission_active.png" 
                          onclick="Intro.selectMission(this); Intro.next();"/>
              </div>
              <div class="missionName">
                ${mission['name']}
              </div>
            </div>
          {else}
            <div class="mission">
              <img id="${mission['path']}" src="challenges/current/${mission['path']}/images/mission_inactive.png"/>
              <div class="missionName">
                ${mission['name']}
              </div>
            </div>
          {/if}
      {/for}
    </div>
</textarea>


<textarea id='missionTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
      <img src="images/intro/mission/float-bg.png"></img>
      <div id="close" onclick="Intro.hideFloatBg();"></div>
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
    </div>
    <img id="missionBackground" src="images/intro/mission/mission-bg.png"></img>
    <div id="cityName">
        ${city.name}
    </div>
    <div id="cityDesc">
        ${city.summary}
    </div>
    <div id="cityImage">
        <img src="${path}/images/city.png">
    </div>
    <div id="fullDesc">
        ${city.description}    
    </div>
    <div id="cityMap">       
      <img src="${path}/images/map.png">
    </div>
    <div id="accept" onclick="Intro.next();">
      <img src="images/intro/mission/accept.png">
    </div>
    <div id="reject" onclick="Intro.previous();">
      <img src="images/intro/mission/reject.png">
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
    		          <li creepid="${creep}" onclick="Intro.showFloatBg(this)">
    		            <img src="images/intro/creeps/${creepConfig[creep]['image']}" > </img>
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
      <img src="images/intro/mission/confidintial-stamp.png"> </img>
    </div>
</textarea>


<textarea id='marketItemDetailsTemplate' style="display:none">
    <img src="images/intro/market/float-bg.png"></img>
    <div id="close" onclick="Intro.hideFloatBg();"></div>
    <div class="content"> 
      <div class="spans">
        <div class="name">  ${data.configs[data.itemid]['name']} </div>
        <div class="desc">  
          ${data.configs[data.itemid]['desc']} 
          <img src="images/intro/market/rank.png"></img>
          <span style="color:{if (data.rank[0] > data.exp)} red; {else} green; {/if}">
          ${data.rank[1]}
          </span>
        </div>
      </div>
      <div class="image">
        <img src="${Intro.images.path}${data.type}/${data.configs[data.itemid]['skeleton']}"></img>
        <div>
            <img src="images/intro/market/coin.png"></img>
            ${data.cost}  
        </div>
      </div>
    </div>
    <div class="actions">
      {if ((Intro.gameData[data.type][data.itemid]['unlocked'] == true) || (Intro.userData.metadata[data.type].indexOf(data.itemid) >= 0 ) )}
        {if (Intro.userData.metadata.added[data.type].indexOf(data.itemid) >= 0 ) }
            <img itemid="${data.itemid}" type="${data.type}" src="images/intro/market/remove-big.png" class="action" onclick="Intro.removeItem(this);"></img> 
        {else}
            <img itemid="${data.itemid}" type="${data.type}" src="images/intro/market/add.png" class="action" onclick="Intro.addItem(this);"> </img> 
        {/if}
      {else}
        {if ((data.cost > data.coins) && ( data.rank[0] <= data.exp))}
          <img src="images/intro/market/inactive-unlock.png" class="action"> </img>
          {if (data.cost < data.coins)}
            <img src="images/intro/market/inactive-unlock.png"> </img>
          {/if}
        {else}
          <img itemid="${data.itemid}" type="${data.type}" src="images/intro/market/unlock.png" class="action" onclick="Intro.unlockItem(this);"> </img>
        {/if}
      {/if}
    </div>
</textarea>


<textarea id='marketItemsTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
    </div>
    <img src="images/intro/market/${type}-bg.png"> </img>  
    <div class="coins">
        ${data.userData['coins']}
    </div>
    <div id="${type}Display">
      {for item in data.gameData[type] }
          <div class="item clickable">
            <div itemid="${item}" >
              <img itemid="${item}" type="${type}" src="images/intro/${type}/${itemConfig[item]['image']}" onclick="Intro.showFloatBg(this)" ></img>
              {if ((Intro.gameData[type][item]['unlocked'] == true) || (data.userData.metadata[type].indexOf(item) >= 0 ) )}
                  {if (data.userData.metadata.added[type].indexOf(item) >= 0) }
                      <span class="label"> ${itemConfig[item]['model']} </span>
                  {else}
                      <img  itemid="${item}" type="${type}" src="images/intro/market/add.png" class="action" onclick="Intro.addItem(this);"> </img> 
                      <span class="label"> ${itemConfig[item]['model']} </span>
                  {/if}
              {else}
                <img itemid="${item}" type="${type}" src="images/intro/market/unlock.png" class="action" onclick="Intro.showFloatBg(this);"> </img>
                <img src="images/intro/market/locked.png" class="label"> </img>  
              {/if}
            </div>
            <img src="images/intro/market/shown-lamp.png"> </img> 
          </div>
      {/for}
      {for x in data.gameData.empty[type]}
          <div class="item">
            <div>
              <img src="images/intro/market/q-box.png"></img>
            </div>
            <img src="images/intro/market/hidden-lamp.png"> </img> 
          </div>
      {/for}
    </div>
    <div id="addedItems">
      {for item in data.userData.metadata.added[type] }
          <div  class="addedItem clickable" itemid="${item}">
            <div>
                <img itemid="${item}" type="${type}" src="images/intro/${type}/${itemConfig[item]['smallImage']}" onclick="Intro.showFloatBg(this)" ></img>
            </div>
            <img itemid="${item}" type="${type}" src="images/intro/market/remove.png" class="action" onclick="Intro.removeItem(this);"> </img>
          </div>
      {/for}
      {for item in data.userData.empty[type] }
          <div  class="emptyItem">
              <img src="images/intro/market/q-mark.png"></img>
          </div>
      {/for}
    </div>
</textarea>
