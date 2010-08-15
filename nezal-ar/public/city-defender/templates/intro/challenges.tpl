{for challenge in challenges}
<div class="challenge" title="${challenge["campaign"]['path']}" id="challenge_${challenge["campaign"]['name']}" style="lefts: ${36*challenge_index}px">
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


