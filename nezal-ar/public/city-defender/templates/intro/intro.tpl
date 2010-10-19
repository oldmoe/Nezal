<textarea id='congratesTemplate' style="display:none">
  <div id="character">
	  <img class="congratesBg" src="${Loader.images.intro['character.png'].getAttribute('data')}"/>
  </div>
  <div class="content"> 
	  <div class="msg">
	    ${msg}
	  </div>
  </div>
  <div class="ok">
    <div style="display:inline-block; height : 10px; width : 140px;">
    </div>
    <div style="display:inline-block;" onclick="Intro.hideCongrates()" class="clickableButton clickSound">
        {if ($('intro').getStyle('direction')=='ltr') }
          <img src="${Loader.images.intro['ready.png'].getAttribute('data')}" style="width:80px;"/>
        {else}
          <img src="${Loader.images.intro['back.png'].getAttribute('data')}" style="width:80px;"/>
        {/if}
	    <div id='rogerText'>${Text.game.controls.roger}</div>
    </div>
  </div>
</textarea>
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

<textarea id='prevChallengesTemplate' style="display:none">
	<div id="background">
	  <img src="${Loader.images.intro['background.png'].getAttribute('data')}"/>
      <img id="paper" src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
	 </div>
	  <ul id="campaigns">
		  {for camp in campaigns}
			<li id="prevCampaign">
				<a href='#' onclick="
				GameConfigs.campaign='${camp.path}';
				Sounds.play(Sounds.gameSounds.click)
				$('extraLevels').show()
				return false;">
					<img src='challenges/${camp.path}/images/flag_small.png'/>${camp['name_'+GameConfigs.language].replace("\"","").replace("\"","")}
				</a>
			</li>
		  {/for}
	  </ul>
	  <div id="extraLevels" style="display : none;" class="levels">
			<div id="floatBgLevel" >
				<div id="close" onclick="$('extraLevels').hide()">x</div>
				<a id="easy" href='javascript:void(0);' onclick="GameConfigs.level=1; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="${Loader.images.intro['levels/easy_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">1x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['easy.png'].getAttribute('data')}"/>
				</a>
				<a id="medium" href='javascript:void(0);' onclick="GameConfigs.level=2; Intro.next(); return false;" class="difficultyItem clickSound" >
					<img src="${Loader.images.intro['levels/medium_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">2x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['medium.png'].getAttribute('data')}"/>
				</a>
				<a id="hard" href='javascript:void(0);' onclick="GameConfigs.level=3; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="${Loader.images.intro['levels/hard_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">3x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['hard.png'].getAttribute('data')}"/>
				</a>
			</div>
		</div>
		<div id="backContainer">
			<div id="back" onclick="Intro.showLevelSelection();
			Sounds.play(Sounds.gameSounds.click);" class="clickableButton clickSound">
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
            <div class="selectedLangContainer">
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
		<div id = "msg" class="msgSize"> ${Text.intro.levelSelection.msg} </div>
		<div id="tutorial"> 
		  <div style="width : 70%; display:inline-block; height:10px;"></div>
		  <div class="clickableButton clickSound tutorialText" onclick="Intro.displayTutorial(); return false;">
  		  ${Text.intro.levelSelection.tutorial} 
		  </div>
	  </div>
		<div id = "challengesText" class="title titleSize clickableButton clickSound"
	       onclick="if(this.hasClassName('clickSound'))
            	      Sounds.play(Sounds.gameSounds.click);
					  GameConfigs.campaign = GameConfigs.currentCampaign;
          	      $$('#levels')[0].show(); return false;"> ${Text.intro.levelSelection.title} </div>
		<div id="extraMap" class="title titleSize clickableButton clickSound" 
		      onclick="if(this.hasClassName('clickSound'))
            	      Sounds.play(Sounds.gameSounds.click);
          	      Intro.retrievePrevCampaigns(); return false;"> ${Text.intro.levelSelection.extraMaps} 
		</div>
		<div id="levels" style="display : none;" class="levels">
			<div id="floatBgLevel" >
				<div id="close" onclick="$('levels').hide()">x</div>
				<a id="easy" href='javascript:void(0);' onclick="GameConfigs.level=1; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="${Loader.images.intro['levels/easy_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">1x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['easy.png'].getAttribute('data')}"/>
				</a>
				<a id="medium" href='javascript:void(0);' onclick="GameConfigs.level=2; Intro.next(); return false;" class="difficultyItem clickSound" >
					<img src="${Loader.images.intro['levels/medium_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">2x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['medium.png'].getAttribute('data')}"/>
				</a>
				<a id="hard" href='javascript:void(0);' onclick="GameConfigs.level=3; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="${Loader.images.intro['levels/hard_icon.png'].getAttribute('data')}"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">3x</span>
						<span class="scoreWord">${Text.game.upperBar.score}</span>
					</div>
					<img class="difficultyLevel" src="${Loader.images[GameConfigs.language]['hard.png'].getAttribute('data')}"/>
				</a>
			</div>
		</div>
</textarea>
<textarea id='difficultyTemplate' style="display:none">
	<div id="levels">
			<div id="floatBgLevel" >
				<a id="easy" href='javascript:void(0);' onclick="GameConfigs.level=1; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="images/intro/levels/easy_icon.png"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">1x</span>
						<span class="scoreWord">score</span>
					</div>
					<img class="difficultyLevel" src="images/english/easy.png"/>
				</a>
				<a id="medium" href='javascript:void(0);' onclick="GameConfigs.level=2; Intro.next(); return false;" class="difficultyItem clickSound" >
					<img src="images/intro/levels/medium_icon.png"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">2x</span>
						<span class="scoreWord">score</span>
					</div>
					<img class="difficultyLevel" src="images/english/medium.png"/>
				</a>
				<a id="hard" href='javascript:void(0);' onclick="GameConfigs.level=3; Intro.next(); return false;" class="difficultyItem clickSound">
					<img src="images/intro/levels/hard_icon.png"/>
					<div class="scoreEffect">
						<span class="scoreMultiplier">3x</span>
						<span class="scoreWord">score</span>
					</div>
					<img class="difficultyLevel" src="images/english/hard.png"/>
				</a>
			</div>
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
          {if ( (Intro.campaignData.user_data.metadata.levels[(GameConfigs.level).toString()] >= mission['order']) && 
                 (Intro.campaignData.user_data.metadata.missions[[mission.order]-1]) ) }  
            <div class="mission clickableButton">
              <div path="${mission['path']}" onclick="Intro.selectMission(this); Intro.next();" class="clickSound" >
                <img id="${mission['path']}" 
                   src="${Loader.challenges[GameConfigs.campaign]['images/'+mission.path+'/mission_active.png'].getAttribute('data')}"/>
              </div>
              <div class="missionScore">
                ${Intro.campaignData.user_data.metadata.missions[[mission.order]-1].score}
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
    <div id="cityDesc" class="desc">
        ${city.summary}
    </div>
    <div id="cityImage">
        <img src="${Loader.challenges[GameConfigs.campaign]['images/flag.png'].getAttribute('data')}">
    </div>
    <div id="fullDesc" class="desc">
        ${city.description}    
    </div>
    <div id="cityMap">       
      <img src="${Loader.challenges[GameConfigs.campaign]['images'+path+'/path.png'].getAttribute('data')}"
           style="width:222px;">
    </div>
    <div id="accept" onclick="Intro.next();" class="clickableButton acceptSound">
      <img src="${Loader.images.intro['mission/accept.png'].getAttribute('data')}" >
      <div class="text buttonText">
        ${Text.intro.mission.accept}
      </div>
    </div>
    <div id="reject" onclick="Intro.previous();" class="clickableButton rejectSound">
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
        <div class="name">  ${Text.intro[data.translateName][data.itemid]['name']} </div>
        <div class="desc">  
          ${Text.intro[data.translateName][data.itemid]['desc']} 
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
                        style="width : ${Math.round(data.currUpgrade.power * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().power)}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${Math.round((data.nextUpgrade.power-data.currUpgrade.power) * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().power)}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.power} </div>
                </div>
                {if ( data.nextUpgrade != data.currUpgrade ) }
                  <span class="towerText">
                    ${data.nextUpgrade.power}
                  </span>
                {/if}
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.range}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${Math.round(data.currUpgrade.range * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().range)}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${Math.round((data.nextUpgrade.range-data.currUpgrade.range) * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().range)}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.range} </div>
                </div>
                {if ( data.nextUpgrade != data.currUpgrade ) }
                  <span class="towerText">
                    ${data.nextUpgrade.range}
                  </span>
                {/if}
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.maxHp}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${Math.round(data.currUpgrade.maxHp * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().maxHp)}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${Math.round((data.nextUpgrade.maxHp-data.currUpgrade.maxHp) * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().maxHp)}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.maxHp} </div>
                </div>
                {if ( data.nextUpgrade != data.currUpgrade ) }
                  <span class="towerText">
                    ${data.nextUpgrade.maxHp}
                  </span>
                {/if}
            </div>
            <div class="parent"> 
                <span class="towerText beforeText">
                  ${data.currUpgrade.rate*100}
                </span>
                <div class="bar">
                  <div class="barRed" 
                        style="width : ${Math.round(data.currUpgrade.rate * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().rate)}%;">
                  </div>
                  <div class="barYellow"
                        style="width : ${Math.round((data.nextUpgrade.rate-data.currUpgrade.rate) * 100 / Intro.gameData[data.type][data.itemid].upgrades.last().rate)}%;">
                  </div>
                  <div class="optionName"> ${Text.intro.upgrades.rate} </div>
                </div>
                {if ( data.nextUpgrade != data.currUpgrade ) }
                  <span class="towerText">
                    ${data.nextUpgrade.rate*100}
                  </span>
                {/if}
            </div>
        </div>
      {/if}
      {if (data.upgrade && data.type=='weapons')}
        <div class="upgradeInfo">
          <div class="desc currUpgrade">
            ${Text.intro.upgrades[data.itemid][Intro.userData.metadata[data.type][data.itemid]['upgrades']-1]}
          </div>
          {if ( data.nextUpgrade != data.currentUpgrade ) }
            <div class="desc newUpgrade">
              ${Text.intro.upgrades[data.itemid][Intro.userData.metadata[data.type][data.itemid]['upgrades']]}
            </div>
          {/if}
        </div>
      {/if}
      <div class="image">
        <div>
          <div style="width:88px; display : inline-block; height : 5px;"> </div>
          <div id="close" onclick="Intro.hideFloatBg();" class="clickSound">x</div>
        </div>
        <div class="skeleton">
          <img src="${Loader.images.intro[data.type+'/'+data.configs[data.itemid]['skeleton']].getAttribute('data')}" 
            {if (data.type=='weapons')}
              style="padding-top : 20px;"
            {/if}
           />
        </div>
        {if ( !( data.upgrade && (data.nextUpgrade == data.currUpgrade))  ) }
          <div class="cost">
              <div class="img">
                <img src="${Loader.images.intro['market/coin.png'].getAttribute('data')}"></img>
              </div>
              <div class="value">
                ${data.cost}  
              </div>
          </div>
        {/if}
      </div>
    </div>
    {if ( !( data.upgrade && (data.nextUpgrade == data.currUpgrade))  ) }
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
              <span style="margin:0 44px;"></span>
              <a id="addMoneyAnchor" class="clickSound" href="javascript:void(0);" onclick="Intro.showPaymentBg();">
                <div class="addMoney" >
                  <img src="${Loader.images.intro['market/money.png'].getAttribute('data')}" > </img>
                </div>
              </a>
              
          </div>
        </div>
    {/if}
{if (data.upgrade)}
  </div>
{/if}
</textarea>

<textarea id="payment-options-template" style="display:none;">
  <a href="javascript:void(0);" class="pay clickSound" id="middle-selection">
    <div>
      <img id="daopay-logo" src="${Loader.images.payments['daopay_logo.png'].getAttribute('data')}"></img>
      <span id="daopay-description">
        ${Text.payments['daopay']['description']}
      </span>
      <span id="daopay-command">
      </span>
    </div>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-left-selection">
    <span class="package-info package-price">
      ${payment.packages['left']['price']} EUR
    </span>
    <span class="package-info package-coins">
      ${payment.packages['left']['coins']} ${Text.game.result.coins}
    </span>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-middle-selection">
    <span id="best-value" class="package-info">
    </span>
    <span id="middle-package-price" class="package-info">
      ${payment.packages['middle']['price']} EUR
    </span>
    <span id="middle-package-coins" class="package-info">
      ${payment.packages['middle']['coins']} ${Text.game.result.coins}
    </span>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-right-selection">
    <span class="package-info package-price">
      ${payment.packages['right']['price']} EUR
    </span>
    <span class="package-info package-coins">
      ${payment.packages['right']['coins']} ${Text.game.result.coins}
    </span>
  </a>
  <div id="contact-us-message"> ${Text.payments.contactUsMessage}
    <a class="clickSound" href="javascript:void(0);" id="contact-us-trigger" onclick="Intro.showContactUsForm();"> ${Text.payments.contactUsTrigger} </a> 
  </div>

</textarea>

<textarea id='payment-success' style="display:none">
  <div id="paymentSuccessModalWindow">
    <img id="paymentSuccessCharacter" src="${Loader.images.intro['character.png'].getAttribute('data')}"/>
    <div class="content">
      ${Text.payments.success.replace('*coins*', coins)}
    </div>
    <div id="paymentSuccessImage">
      <img src="${Loader.images.intro['market/money.png'].getAttribute('data')}" />
    </div>
    <div id="paymentSuccessOk" onclick="Intro.hidePaymentSuccess();" class="clickSound">
      <img src="images/intro/ready.png"/>
      <span id='paymentOkText'>OK</span>
    </div>
  </div>
</textarea>

<textarea id='contactUsTemplate' style="display:none">
  <div id="contactUsClose" onclick="Intro.hideContactUsBg();" class="clickSound"> X </div>
  <span id="contact-us-post-submission"></span>
  <form id="contact-us-form" method="POST" action="payment_issues">
    <span id="contact-us-form-title">${Text.payments.contactUsFormTitle}</span>
    <br/>
    ${'<'}textarea name="body">${'<'}/textarea>
    <div id="contact-us-submit-container">
      <span onclick="Intro.submitContactUsForm();" id="contact-us-submit-button-text">${Text.payments.contactUsFormSend}</span>
      <img onclick="Intro.submitContactUsForm();" id="contact-us-submit-button" src="${Loader.images.intro['mission/accept.png'].getAttribute('data')}" />
    </div>
  </form>
</textarea>

<textarea id='marketItemsTemplate' style="display:none">
    <div id="floatBg" style="display : none;">
    </div>
    
    <div id="paymentSuccessContainer" style="display : none;">
    </div>
    
    <div id="contactUsFloatBg" style="display: none;">
    </div>
  
    <div id="paymentFloatBg" style="display : none;">
      <div class="pay">
        <img id="pay-left-image" src="${Loader.images.payments['pay_left.png'].getAttribute('data')}" />
        <img id="pay-middle-image" src="${Loader.images.payments['pay_middle.png'].getAttribute('data')}" />
        <img id="pay-right-image" src="${Loader.images.payments['pay_right.png'].getAttribute('data')}" />
      </div>
      
      <div id="payments-container">
      </div>
      
      <div id="paymentClose" onclick="Intro.hidePaymentBg();" class="clickSound"> X </div>
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
        <a class="clickSound" href="javascript:void(0);" onclick="Intro.showPaymentBg();">
          <div class="addMoney">
            <span class="addText">
              ${Text.intro.marketPlace.add}
            </span>
            <img src="${Loader.images.intro['market/money.png'].getAttribute('data')}" > </img>
            <span class="moneyText">
              ${Text.intro.marketPlace.money}
            </span>
          </div>
        </a>
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
        <div style="width : 28px; height : 10px;display:inline-block;"></div>
        <div id="backText">
          ${Text.intro.marketPlace.back}
        </div>
      </div>
      <div style="width : 448px; height : 10px;display:inline-block;"></div>
      <div id="ready" onclick="Intro.next();" class="buttonText clickableButton clickSound">
        {if ($('intro').getStyle('direction')=='rtl') }
          <img src="${Loader.images.intro['back.png'].getAttribute('data')}"/>
        {else}
          <img src="${Loader.images.intro['ready.png'].getAttribute('data')}"/>
        {/if}
        <div id="readyText">
          ${Text.intro.marketPlace.ready}
        </div>
        <div style="width : 28px; height : 10px;display:inline-block;"></div>
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
                {if (!Intro.userData.metadata[type][item])}   
		                <img class="coinImage" 
		                      src="${Loader.images.intro['market/coin.png'].getAttribute('data')}"> </img>
                    <div class="itemPrice">
                        ${Intro.gameData[type][item].cost}
                    </div>
                {else}  
                    {if (Intro.gameData[type][item]['upgrades'][Intro.userData.metadata[type][item]['upgrades']])}
                    <img class="coinImage" 
		                      src="${Loader.images.intro['market/coin.png'].getAttribute('data')}"> </img>
                    <div class="itemPrice">
                        ${Intro.gameData[type][item]['upgrades'][Intro.userData.metadata[type][item]['upgrades']].cost}
                    </div>  
                    {else}
                    <div style="width:20px;height:23px;"></div>
                    {/if}
                {/if}
		            <img class="itemImage" 
		                  src="${Loader.images.intro[type+'/'+itemConfig[item]['image']].getAttribute('data')}"> </img>
                {if (!Intro.userData.metadata[type][item])}
                  <div class="lockImage">
  		                <img 
		                    src="${Loader.images.intro['market/lock.png'].getAttribute('data')}"> </img>
                  </div>
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
    		            <img class="infoImage clickSound"  
		                  src="${Loader.images.intro['market/info.png'].getAttribute('data')}"
		                  type="${type}" itemid="${item}" onclick="Intro.showFloatBg(this)"/>
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
    		            <img class="infoImage clickSound"
		                  src="${Loader.images.intro['market/info.png'].getAttribute('data')}"
		                  type="${type}" itemid="${item}" upgrade="true" onclick="Intro.showFloatBg(this)"/>
                  {/if}
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
