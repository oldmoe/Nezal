<textarea id='congratesTemplate' style="display:none">
  <div id="character">
    <img class="congratesBg" src="${Loader.images.intro['publish.png'].getAttribute('data')}"/>
    <img class="logo" src="${Loader.images.intro['intro-logo.png'].getAttribute('data')}"/>
  </div>
  <div class="content"> 
	  <div class="msg">
	    ${msg}
	  </div>
  </div>
  <div class="ok" id="ok">
    <div class="hover">
      <img src="${Loader.images.intro['button_middle_hover.png'].getAttribute('data')}" class="hover"/>
    </div>
    <div style="display:inline-block;" onclick="Intro.hideCongrates()" class="clickableButton clickSound button">
      <img src="${Loader.images.intro['button_middle.png'].getAttribute('data')}"/>
      <img src="${Loader.images.intro['button_middle_click.png'].getAttribute('data')}" style="display:none;"/>
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
          <div style="height : 25px;" language="${lang[0]}" class="clickSound clickableButton languageSelector">
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
					  _gaq.push(['_trackEvent', 'Game Type', 'Weekly challenge', navigator.userAgent]);
					  GameConfigs.campaign = GameConfigs.currentCampaign;
          	      $$('#levels')[0].show(); return false;"> ${Text.intro.levelSelection.title} </div>
		<div id="extraMap" class="title titleSize clickableButton clickSound" 
		      onclick="if(this.hasClassName('clickSound'))
            	      Sounds.play(Sounds.gameSounds.click);
					  _gaq.push(['_trackEvent', 'Game Type', 'Previous Campaigns', navigator.userAgent]);
          	      Intro.retrievePrevCampaigns(); return false;"> ${Text.intro.levelSelection.extraMaps} 
		</div>
		<div id="levels" style="display : none;" class="levels">
			<div id="floatBgLevel" >
				<div id="close" onclick="$('levels').hide()">x</div>
				<a id="easy" href='javascript:void(0);' onclick="GameConfigs.level=1; Intro.next();
				return false;" class="difficultyItem clickSound">
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
      <img id="paper" src="${Loader.images.intro['campaign/cities.png'].getAttribute('data')}"/>
      <img id="map" src="${Loader.images.intro['tunisia-map.png'].getAttribute('data')}"/>
      <img id="name" src="${Loader.images.intro['campaign/map-word.png'].getAttribute('data')}"/>
    </div>
    <div class="wrapper"> </div>
    <div class="camp-header">
      <div class="market-link">
        <img src="${Loader.images.intro['campaign/market-link.png'].getAttribute('data')}"/>
        <div class="button clickSound">
          <img src="${Loader.images.intro['campaign/market-hover.png'].getAttribute('data')}" style="display:none;"/>
          <img src="${Loader.images.intro['campaign/market-button.png'].getAttribute('data')}" class="buttonImg"/>
          <img src="${Loader.images.intro['campaign/market-click.png'].getAttribute('data')}" class="buttonImg" style="display:none;"/>
        </div>
      </div>
      <div class="logo">
        <img src="${Loader.images.intro['intro-logo.png'].getAttribute('data')}"/>
      </div>
    </div>  
    <div id="missions">
      {for mission in Intro.campaignData.camp_data.metadata }
          {if ( (Intro.campaignData.user_data.metadata.levels[(GameConfigs.level).toString()] >= mission['order']) && 
                 (Intro.campaignData.user_data.metadata.missions[[mission.order]-1]) ) }  
            <div class="mission" id="${mission['path']}">
              <div class="mission-hover">
                <img src="${Loader.images.intro['campaign/mission-hover.png'].getAttribute('data')}" style="display:none;"/>
              </div>
              <div path="${mission['path']}" class="clickSound clickableButton">
              </div>
              <div class="mission-normal">
                <img src="${Loader.images.intro['campaign/mission-button.png'].getAttribute('data')}"/>
                <img src="${Loader.images.intro['campaign/mission-clicked.png'].getAttribute('data')}" style="display:none; z-index:5;"/>
              </div>
              <div class="missionScore">
                  ${Intro.campaignData.user_data.metadata.missions[[mission.order]-1].score}
              </div>
              <div class="stars"> 
                <div class="star-img">
                  {for star in $A($R(1,Intro.campaignData.user_data.metadata.missions[[mission.order]-1].stars))}
                  <span style="width:13px;display:inline-block;margin-left:3px;">                
                    <img src="${Loader.images.intro['campaign/star-filled.png'].getAttribute('data')}"/>
                  </span>
                  {/for}
                  {eval}
                    limit = Intro.campaignData.user_data.metadata.missions[[mission.order]-1].stars
                    if(!limit)
                      limit = 0
                  {/eval}
                  {for star in $A($R(0,2-limit))}
                  <span style="width:13px;display:inline-block;margin-left:3px;">                
                    <img src="${Loader.images.intro['campaign/star.png'].getAttribute('data')}"/>
                  </span>
                  {/for}
                </div>
              </div>
            </div>
         {else}
            <div class="mission">
              <img  id="${mission['path']}" class="inactive-mission"
                 src="${Loader.images.intro['campaign/mission-locked.png'].getAttribute('data')}"/>
            </div>
          {/if}
      {/for}
    </div>
  
</textarea>







<textarea id='missionTemplate' style="display:none">
</textarea>


<textarea id='marketItemDetailsTemplate' style="display:none">
{if (data.upgrade)}
  <div id="upgrade">
{/if}
    <img src="${Loader.images.intro['float-bg.png'].getAttribute('data')}" />
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
          </div>
          <div class="action">
              {if (!Intro.userData.metadata[data.type][data.itemid])}
                {if ((data.cost > data.coins) || ( data.rank[0] > data.exp))}
                {else}
                <div class="active">
  		            <img src="${Loader.images.intro['market/unlock.png'].getAttribute('data')}"/>
                  <span class="clickableButton clickSound buttonText" itemid="${data.itemid}" 
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
                        {else}
                          <div class="active">
            		            <img src="${Loader.images.intro['market/unlock.png'].getAttribute('data')}"/>
                            <span class="clickableButton clickSound buttonText" itemid="${data.itemid}" 
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
      <!--img id="daopay-logo" src="${Loader.images.payments['social_gold_logo.png'].getAttribute('data')}"></img-->
      <span id="daopay-description">
        ${Text.payments['daopay']['description']}
      </span>
      <span id="daopay-command">
      </span>
    </div>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-left-selection">
    <span class="package-info package-price">
      ${payment.packages['left']['price']} دولار
    </span>
    <span class="package-info package-coins">
      ${payment.packages['left']['coins']} ${Text.game.result.coins}
    </span>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-middle-selection">
    <span id="best-value" class="package-info">
    </span>
    <span id="middle-package-price" class="package-info">
      ${payment.packages['middle']['price']} دولار
    </span>
    <span id="middle-package-coins" class="package-info">
      ${payment.packages['middle']['coins']} ${Text.game.result.coins}
    </span>
  </a>
  <a href="javascript:void(0);" class="pay clickSound" id="top-right-selection">
    <span class="package-info package-price">
      ${payment.packages['right']['price']} دولار
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
	  <br/><br/>
	  <span style="color:red">${Text.payments.makeSure}</span>
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
  
  <!--div id="paymentFloatBg" style="display : none;">
    <div id="paymentClose" onclick="Intro.hidePaymentBg();" class="clickSound"> X </div>
    <div class="pay" style="width:520px;text-align:center;">
      payment is temporarily disabled, if you have a problem with previous payment please send a message
    </div>
    <div id="contact-us-message"> ${Text.payments.contactUsMessage}
      <a class="clickSound" href="javascript:void(0);" id="contact-us-trigger" onclick="Intro.showContactUsForm();"> ${Text.payments.contactUsTrigger} </a> 
    </div>
  </div-->
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
      <img class="map" src="${Loader.images.intro['tunisia-map.png'].getAttribute('data')}"/>
      <img class="name" src="${Loader.images.intro['market/map-word.png'].getAttribute('data')}"/>
    </div>
    <div id="upperPart">
        <div class="logo">
          <img src="${Loader.images.intro['intro-logo.png'].getAttribute('data')}"/>
        </div>
        <div class="coins">
          <img class="background" src="${Loader.images.intro['market/money-panel.png'].getAttribute('data')}"/>
          <div class="money">          
            <div class="text">
              ${data.userData['coins']}
            </div>
          </div>
        </div>
        {if (!Intro.userData.like)}
          <div id='playerProgressIframeContainer' style='display:none'>
          	<div class="close" onclick="$('playerProgressIframeContainer').hide();FBDefender.isFan()">X</div>
          	<iframe id="playerProgressIframe"  scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>
          </div>
          <div class="like" onclick="$('playerProgressIframe').src='http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fapps%2Fapplication.php%3Fid%3D'+FBConnect.appIds[FBConnect.url()]+'&layout=standard&show_faces=true&width=450&action=like&colorscheme=light&height=80';$('playerProgressIframeContainer').show();">
            <img src="${Loader.images.intro['market/like.png'].getAttribute('data')}" > </img>
          </div>
        {/if}
        <div class="addMoney clickSound">
          <img class="image" src="${Loader.images.intro['market/buy-button.png'].getAttribute('data')}" > </img>
          <img src="${Loader.images.intro['market/buy-clicked.png'].getAttribute('data')}" style="display:none;"> </img>
          <img class="hover" src="${Loader.images.intro['market/buy-hover.png'].getAttribute('data')}" style="display:none;"> </img>
        </div>
    </div>
    <div class="descriptionText">
      <img src="${Loader.images.intro['market/text.png'].getAttribute('data')}" > </img>
    </div>
    <div id="weapons">
      <img  src="${Loader.images.intro['market/scroller.png'].getAttribute('data')}"/>
      <div id="weaponsDisplay">
      </div>
    </div>
    
    <div id="towers">
      <img  src="${Loader.images.intro['market/scroller.png'].getAttribute('data')}"/>
      <div id="towersDisplay">
      </div>
    </div>
    
    <div id="actionContainer">
      <div id="back" onclick="Intro.previous();" class="buttonText clickableButton clickSound" >
        <img src="${Loader.images.intro['market/ready.png'].getAttribute('data')}"/>
        <div style="width : 28px; height : 10px;display:inline-block;"></div>
      </div>
    </div>
</textarea>

<textarea id='oneCardTemplate' style="display:none">
  <!-- form name="onecard" action="http://onecard.n2vsb.com/customer/integratedPayment.html" method="post" /-->
  <form name="onecard" action="https://www.onecard.net/customer/integratedPayment.html" method="post" />
  https://www.onecard.net/customer/integratedPayment.html
    <input type="hidden" id="OneCard_MerchID" name="OneCard_MerchID" value="${merchantID}" />
    <input type="hidden" id="OneCard_TransID" name="OneCard_TransID" value="${transID}" />
    <input type="hidden" id="OneCard_Amount" name="OneCard_Amount" value="${amount}" />
    <input type="hidden" id="OneCard_Currency" name="OneCard_Currency" value="${currency}" />
    <input type="hidden" id="OneCard_Timein" name="OneCard_Timein" value="${timein}" />
    <input type="hidden" id="OneCard_MProd" name="OneCard_MProd" value="${productDesc}" />
    <input type="hidden" id="OneCard_ReturnURL" name="OneCard_ReturnURL" value = "${returnURL}" />
    <input type="hidden" id="OneCard_Field1" name="OneCard_Field1" value="" />
    <input type="hidden" id="OneCard_Field2" name="OneCard_Field2" value="" />
    <input type="hidden" id="OneCard_HashKey" name="OneCard_HashKey" value="${hashKey}" />
    <input id="OneCard_Submit" type="submit" value="submit" />
  </form> 
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
                <img src="${Loader.images.intro['market/panel-unit.png'].getAttribute('data')}"> </img>
                <div class="content">
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
                  <div class="itemImage">
  		              <img 
		                    src="${Loader.images.intro[type+'/'+itemConfig[item]['image']].getAttribute('data')}"> </img>
                  </div>
                </div>
                {if (!Intro.userData.metadata[type][item])}
                  <div class="lockImage">
  		                <img 
		                    src="${Loader.images.intro['market/lock.png'].getAttribute('data')}"> </img>
                  </div>
                {else}
                  <div class="upgradeLevel">
  		                <img 
		                    src="${Loader.images.intro['market/level.png'].getAttribute('data')}"> </img>
                      ${Intro.userData.metadata[type][item]['upgrades']}
                  </div>
                {/if}
                <div id="info" style="display : none;">
                  {if (!Intro.userData.metadata[type][item])}
                    <div style="float:left; margin-left:12px;">
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
                      <div style="float:left; margin-left:12px;">
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
                <img src="${Loader.images.intro['market/panel-unit.png'].getAttribute('data')}"> </img>
                <div class="qBoxImage">
  		            <img src="${Loader.images.intro['market/q-box.png'].getAttribute('data')}"> </img>
                </div>
		          </li>
		        {/for}
          </ul>
        </div>
        <div class="right"><img src=""/></div> 
    </div>
</textarea>



<textarea id="publishConfirmTemplate">
  <div id="publishConfirm">
    <div id="background">
      <img class="background" src="${Loader.images.intro['publish.png'].getAttribute('data')}"/>
      <img class="logo" src="${Loader.images.intro['intro-logo.png'].getAttribute('data')}"/>
    </div>
    <div class="content"> 
	    <div class="msg">
        ${Text.facebook.userPrompt}
	    </div>
    </div>
    <div class="ok" id="ok">
      <div id="right">
        <div class="hover-right">
          <img src="${Loader.images.intro['button_right_hover.png'].getAttribute('data')}"/>
        </div>
        <div id="okButton" style="display:inline-block;" class="clickableButton clickSound button">
          <img src="${Loader.images.intro['button_right.png'].getAttribute('data')}"/>
          <img src="${Loader.images.intro['button_right_click.png'].getAttribute('data')}" style="display:none;"/>
	        <div id='rogerText'>${Text.game.controls.ok}</div>
        </div>
      </div>
      <div id="left">
        <div class="hover-left">
         <img src="${Loader.images.intro['button_left_hover.png'].getAttribute('data')}"/>
        </div>
        <div style="display:inline-block;" onclick="Intro.hidePublishScreen();" class="clickableButton clickSound button">
          <img src="${Loader.images.intro['button_left.png'].getAttribute('data')}"/>
          <img src="${Loader.images.intro['button_left_click.png'].getAttribute('data')}" style="display:none;"/>
	        <div id='rogerText'>${Text.game.controls.cancel}</div>
        </div>
      </div>
    </div>
  </div>
</textarea>
