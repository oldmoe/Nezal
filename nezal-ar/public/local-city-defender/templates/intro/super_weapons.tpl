<img src="images/intro/market/weapons-bg.png"> </img>
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
<div id="weaponDisplay">
  {for weapon in data.gameData.weapons }
      <div class="weapon">
        <div weaponid="${weapon}" onclick="Intro.showFloatBg(this)">
          <img src="images/intro/super-weapons/${weaponConfig[weapon]['image']}"></img>
          {if (data.userData.added.weapons.indexOf(weapon) >= 0) } 
            <img src="images/intro/market/added.png" class="action"> </img> 
          {elseif (data.userData.weapons.indexOf(weapon) >= 0) }
            <img src="images/intro/market/add.png" class="action" onclick="alert('hi');"> </img> 
          {else}
            <img src="images/intro/market/unlock.png" class="action"> </img>
            <img src="images/intro/market/locked.png" class="label"> </img>  
          {/if}
        </div>
        <img src="images/intro/market/shown-lamp.png" class="action"> </img> 
      </div>
  {/for}
  {for x in data.gameData.emptyWeapons}
      <div class="weapon">
        <div>
          <img src="images/intro/market/q-box.png"></img>
        </div>
        <img src="images/intro/market/hidden-lamp.png" class="action"> </img> 
      </div>
  {/for}
</div>
