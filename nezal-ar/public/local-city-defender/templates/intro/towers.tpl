<img src="images/intro/market/towers-bg.png"> </img>
<div id="floatBg" style="display : none;">
  <img src="images/intro/market/float-bg.png"></img>
  <div id="close" onclick="Intro.hideFloatBg();"></div>
  <div class="content"> 
    <div class="spans">
      <span class="name">   </span>
      <span class="desc">   </span>
    </div>
    <img src=""></img>
  </div>
</div>
<div class="coins">
    ${data.userData['coins']}
</div>
<div id="towerDisplay">
  {for tower in data.gameData.towers }
      <div class="tower">
        <div towerid="${tower}">
          <img towerid="${tower}" src="images/intro/towers/${towerConfig[tower]['image']}" onclick="Intro.showFloatBg(this)" ></img>
          {if (data.userData.added.towers.indexOf(tower) >= 0) } 
            <img src="images/intro/market/added.png" class="action"> </img> 
            <span class="label"> ${towerConfig[tower]['model']} </span>
          {elseif (data.userData.towers.indexOf(tower) >= 0) }
            <img src="images/intro/market/add.png" class="action" onclick="alert('hi');"> </img> 
            <span class="label"> ${towerConfig[tower]['model']} </span>
          {else}
            <img src="images/intro/market/unlock.png" class="action"> </img>
            <img src="images/intro/market/locked.png" class="label"> </img>  
          {/if}
        </div>
        <img src="images/intro/market/shown-lamp.png" class="action"> </img> 
      </div>
  {/for}
  {for x in data.gameData.emptyTowers}
      <div class="tower">
        <div>
          <img src="images/intro/market/q-box.png"></img>
        </div>
        <img src="images/intro/market/hidden-lamp.png" class="action"> </img> 
      </div>
  {/for}
</div>
