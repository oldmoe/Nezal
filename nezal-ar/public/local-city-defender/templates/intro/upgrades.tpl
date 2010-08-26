<img src="images/intro/market/upgrades-bg.png"/>
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
<div id="upgradeDisplay">
  {for item in data.gameData[type] }
      <div class="item">
        <div itemid="${item}">
          <img itemid="${item}" type="${type}" src="images/intro/${type}/${itemConfig[item]['image']}" onclick="Intro.showFloatBg(this)" ></img>
          {if ((Intro.gameData[type][item]['unlocked'] == true) || (data.userData[type].indexOf(item) >= 0 ) )}
              {if (data.userData.added[type].indexOf(item) >= 0) }
                  <span class="label"> ${itemConfig[item]['model']} </span>
              {else}
                  <img  itemid="${item}" type="${type}" src="images/intro/market/add.png" class="action" onclick="Intro.addItem(this);"> </img> 
                  <span class="label"> ${itemConfig[item]['model']} </span>
              {/if}
          {else}
            <img itemid="${item}" type="${type}" src="images/intro/market/unlock.png" class="action" onclick="Intro.unlockItem(this);"> </img>
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
  {for item in data.userData.added[type] }
      <div  class="addedItem" itemid="${item}">
        <img itemid="${item}" src="images/intro/${type}/${itemConfig[item]['image']}" onclick="Intro.showFloatBg(this)" ></img>
        <img itemid="${item}" type="${type}" src="images/intro/market/remove.png" class="action" onclick="Intro.removeItem(this);"> </img>
      </div>
  {/for}
</div>
