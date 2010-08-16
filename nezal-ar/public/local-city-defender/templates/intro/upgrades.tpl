<img src="images/intro/market/upgrades-bg.png"/>
<div id="floatBg" style="display : none;">
  <img src="images/intro/market/float-bg.png"></img>
  <div id="close" onclick="Intro.hideFloatBg();"></div>
  <div class="content"> 
    <div class="spans">
      <span class="name">   </span>
      <span class="desc">   </span>
    </div>
    <img src="images/intro/market/float-bg.png" style="float:right;"></img>
  </div>
</div>

<div class="coins">
    ${data.userData['coins']}
</div>
<div id="upgradeDisplay">
  {for upgrade in data.gameData.upgrades }
      <div class="upgrade">
        <div upgradeid="${upgrade}" onclick="Intro.showFloatBg(this)">
          <img src="images/intro/upgrades/${upgradeConfig[upgrade]['image']}"></img>
          {if (data.userData.added.upgrades.indexOf(upgrade) >= 0) } 
            <img src="images/intro/market/added.png" class="action"> </img> 
          {elseif (data.userData.upgrades.indexOf(upgrade) >= 0) }
            <img src="images/intro/market/add.png" class="action" onclick="alert('hi');"> </img> 
          {else}
            <img src="images/intro/market/unlock.png" class="action"> </img>
            <img src="images/intro/market/locked.png" class="label"> </img>  
          {/if}
        </div>
        <img src="images/intro/market/shown-lamp.png" class="action"> </img> 
      </div>
  {/for}
  {for x in data.gameData.emptyUpgrades}
      <div class="upgrade">
        <div>
          <img src="images/intro/market/q-box.png"></img>
        </div>
        <img src="images/intro/market/hidden-lamp.png" class="action"> </img> 
      </div>
  {/for}
</div>
