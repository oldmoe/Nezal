<div id="floatBg" style="display : none;">
  <img src="images/intro/city/float-bg.png"></img>
  <div id="close" onclick="Intro.hideFloatBg();"></div>
  <div class="content"> 
    <div class="spans">
      <span class="name">   </span>
      <span class="desc">   </span>
    </div>
  </div>
  <img src=""></img>
</div>

  <img id="cityInfoBackground" src="images/intro/city/city-info.png"></img>
  <div id="cityName">
      ${city.name}
  </div>
  <div id="cityDesc">
      ${city.summary}
  </div>
  <div id="cityImage">
      <img src="challenges/${path}/images/city.png">
  </div>
  <div id="fullDesc">
      ${city.description}    
  </div>
  <div id="cityMap">       
    <img src="challenges/${path}/images/map.png">
  </div>
  <div id="accept" onclick="Intro.next();">
    <img src="images/intro/city/accept.png">
  </div>
  <div id="reject" onclick="Intro.previous();">
    <img src="images/intro/city/reject.png">
  </div>
  <div id="creeps">
	    <div id="creeps-scroll">
	        <div class="left">
            <img src="" style="display : block;  vertical-align: middle; margin:0 auto; padding-top : 12px;">
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
            <img src="" style="display : block;  vertical-align: middle; margin:0 auto; padding-top : 12px;">
            </img>
	        </div> 
      </div>
	</div>
  <div id="creepBar">
  </div>
  <div id="stamp">
    <img src="images/intro/city/confidintial-stamp.png"> </img>
  </div>
