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
