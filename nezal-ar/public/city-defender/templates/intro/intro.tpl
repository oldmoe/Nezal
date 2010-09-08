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
    <img id="camp-map" src="challenges/${GameConfigs.campaign}/images/camp-map.png"/>
    <div id="missions">
      {for mission in Intro.campaignInfo.camp_data.metadata }
          {if (Intro.campaignInfo.user_data.metadata.missions[mission['order'] - 1]) }  
            <div class="mission clickableButton">
              <div>
                <img id="${mission['path']}" path="${mission['path']}" src="challenges/${GameConfigs.campaign}/${mission['path']}/images/mission_active.png" 
                          onclick="Intro.selectMission(this); Intro.next();"/>
              </div>
              <div class="missionName">
                ${mission['name']}
              </div>
            </div>
          {else}
            <div class="mission">
              <img id="${mission['path']}" src="challenges/${GameConfigs.campaign}/${mission['path']}/images/mission_inactive.png"/>
              <div class="missionName">
                ${mission['name']}
              </div>
            </div>
          {/if}
      {/for}
    </div>
    <div id="back" onclick="Intro.previous();" class="clickableButton">
      <img src="images/intro/back.png"/>
      <div class="text buttonText">
        Back
      </div>
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
        <img src="challenges/${GameConfigs.campaign}/images/camp-map.png">
    </div>
    <div id="fullDesc">
        ${city.description}    
    </div>
    <div id="cityMap">       
      <img src="${path}/images/map.png">
    </div>
    <div id="accept" onclick="Intro.next();" class="clickableButton">
      <img src="images/intro/mission/accept.png" >
      <div class="text buttonText">
        Accept
      </div>
    </div>
    <div id="reject" onclick="Intro.previous();" class="clickableButton">
      <span style="color : #550000; font-size: 12px;">or</span> go back to campaign
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
        </div>
      </div>
      <div class="image">
        <div class="skeleton">
          <img src="${Intro.images.path}${data.type}/${data.configs[data.itemid]['skeleton']}"></img>
        </div>
        <div class="cost">
            <div class="img">
              <img src="images/intro/market/coin.png"></img>
            </div>
            <div class="value">
              ${data.cost}  
            </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class='rank'>
        Required Rank : 
        <span {if (data.rank[0] > data.exp)} "style="color:red;" {/if}>
          ${data.rank[1]}
        </span>
      </div>
      <div class="action  clickableButton">
          {if ((Intro.gameData[data.type][data.itemid]['unlocked'] == false) && (Intro.userData.metadata[data.type].indexOf(data.itemid) < 0 ) )}
            {if ((data.cost > data.coins) || ( data.rank[0] > data.exp))}
              <span class="inactive"> unlock </span>
              {if (data.cost > data.coins)}
                <div class="addMoney" >
                  <img src="images/intro/market/money.png" > </img>
                </div>
              {/if}
            {else}
              <span class="active" itemid="${data.itemid}" type="${data.type}" class="action" onclick="Intro.unlockItem(this);"> unlock </span>
            {/if}
          {/if}
      </div>
    </div>
</textarea>


<textarea id='marketItemsTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
    </div>
    <img src="images/intro/market/background.png"> </img>  
    <div class="coins">
        ${data.userData['coins']}
    </div>
    <div class="msg">
        Select ${data['name']} to add them to your next mission army
    </div>
    <div id="${type}Display">
      {for item in data.gameData[type] }
      <div class="item">
        <div itemid="${item}" class="clickable">
          <div itemid="${item}" type="${type}" onclick="Intro.showFloatBg(this)" class="itemImage">
            <img src="images/intro/${type}/${itemConfig[item]['image']}"></img>
            {if ((Intro.gameData[type][item]['unlocked'] == false) && (data.userData.metadata[type].indexOf(item) < 0 ) )}
              <img src="images/intro/market/locked.png" class="label"> </img>   
            {/if}
          </div>
          {if ((Intro.gameData[type][item]['unlocked'] == true) || (data.userData.metadata[type].indexOf(item) >= 0 ) )}
            {if (data.userData.metadata.added[type].indexOf(item) < 0) }
              <div class="action" itemid="${item}" type="${type}"  onclick="Intro.addItem(this);" style="height:20px;" >
                <img   src="images/intro/market/add.png" > </img> 
                <div class="text buttonText">
                  Add
                </div>
              </div>
            {/if}
          {else}
            <div class="action" itemid="${item}" type="${type}"  onclick="Intro.showFloatBg(this);" style="height:20px;" >
              <img src="images/intro/market/unlock.png"> </img>
              <div class="text buttonText">
                unlock
              </div>
            </div>
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
    <div class='background'>
        {if type == 'towers'}
          <img src="images/intro/market/added-towers.png"> </img>  
        {else}
          <img src="images/intro/market/added-items.png"> </img>  
        {/if}
    </div>
    <div id="addedItems">
      {for item in data.userData.metadata.added[type] }
          <div  class="addedItem clickable" itemid="${item}" onmouseover="this.select('.action')[0].show();" onmouseout="this.select('.action')[0].hide();">
            <div class="addedItemImg">
                <img itemid="${item}" type="${type}" src="images/intro/${type}/${itemConfig[item]['smallImage']}" onclick="Intro.showFloatBg(this)" ></img>
            </div>
            <div class="action" style="display:none;">
              <img itemid="${item}" type="${type}" src="images/intro/market/remove.png"  onclick="Intro.removeItem(this);"> </img>
            </div>
          </div>
      {/for}
      {for item in data.userData.empty[type] }
          <div  class="emptyItem">
              <img src="images/intro/market/q-mark.png"></img>
          </div>
      {/for}
    </div>
    
    <div id="back" onclick="Intro.previous();" class="buttonText clickableButton" >
      <div id="backText">
        Back
      </div>
    </div>
    <div id="next" onclick="Intro.next();" class="buttonText clickableButton">
      <div id="nextText">
        Next
      </div>
    </div>
    <div id="finish" onclick="Intro.finish();" class="buttonText clickableButton">
      <div id="finishText">
        Finish
      </div>
    </div>
</textarea>
