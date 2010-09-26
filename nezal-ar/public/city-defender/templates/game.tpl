	<div id="preload" style="display:none">
		</div>
		<textarea id='statsTemplate' style="display:none">
		Score : ${game.scene.score}
		Towers Built : ${game.scene.stats.towersCreated}
		Towers Lost : ${game.scene.stats.towersDestroyed}
		Units Destroyed : ${game.scene.stats.creepsDestroyed}
		Escaped Units : ${game.scene.escaped}
		</textarea>
		<textarea id='towerInfoTemplate' style="display:none">
			{if tower!=null}
			<div class="diagram ${tower.cssClass}">
				{if tower.rank > 0}
					<div id="diagramRank"><img src="${Loader.images.game['rank_'+tower.rank+'.png'].src}" /></div>				
				{/if}			
			</div>
			<div id="towerData">
			<h4>{if tower.healthSprite !=null }
					<div id = "sellTower" onmousedown = "game.scene.sellSelectedTower()">Sell<hr/>$${Math.round(tower.price*0.75*tower.hp/tower.maxHp)}</div>
					{else}
						$${tower.price}
					{/if}
			</h4>
				<h4>${tower.name}</h4>
			<table>
				<tr>
					<td><div class='meter' id = 'powerMeter' style="width:${Math.round(65 * tower.power / 420)}px;backgroundColor:blue">Power</div>
					<div class='meterExtension'></div>
				</td>
				</tr>
				<tr>
					<td><div class='meter' id = 'shieldsMeter' style="width:${Math.round(65 * tower.hp / 3000)}px;backgroundColor:blue">Shields</div></td>
				</tr>
				<tr>
					<td><div class='meter' id = 'rateMeter' style="width:${Math.round(65 * tower.rate / 1)}px;backgroundColor:blue">Rate</div></td>
				</tr>
				<tr>
					<td><div class='meter' id = 'rangeMeter' style="width:${Math.round(65 * tower.range / 6)}px;backgroundColor:blue">Range</div></td>
				</tr>
			</table>
				{if tower.healthSprite !=null }
					{if tower.rank < tower.maxRank}
					<div id = "upgradeTower" onmousedown = "game.scene.upgradeSelectedTower()">Upgrade<hr/>
						$${tower.upgrades[tower.rank].price}&nbsp; &nbsp;<img src="${Loader.images.game['rank_'+(tower.rank+1)+'.png'].src}" /> 
					</div>
					{else}
					<div id = "upgradeTower" >
						<div id = "maxUpgrade" style = "paddingTop:10px">Max upgrade</div>
					</div>
					{/if}
				{/if}
			</div>
		</table>
		{else}
				select tower to view tower info
		{/if}
		</textarea>
		<div id="gameContainer">
			<div id="modalWindow" style="display:none">
				<div id="character">
		
				</div>
				<div class="content" style="overflow:auto"> 
				
				</div>
				<div id = "ok">
				<img src="images/background/ok.png"></img>
				</div>
			</div>
			<div id= "pauseWindow" style="display:none">	</div>
			<div id= "popup" style="display:none">
					<img src='images/background/pop_up.png'/>
					<div id = "congratsContent"></div>
					<div id = "promotedContent"></div>
					<div id = "rankImg"> </div>
					<div id = "popupClose" onclick = "$('popup').hide()"> </div>
					<div id="popupOk" class="clickableButton" ">
						<img src="images/intro/mission/accept.png"/>
						<div class="text"> Ok </div>
					</div>
			</div>
			<div id="canvasContainer" style="display:none">
				<canvas id="gameBackground" width="736" height="480"></canvas>
				<canvas id="gameForeground" width="736" height="480""></canvas>
			</div>
			<div id="gameElements" style="display:none">
				<div id="money">
					0
				</div>
				<div class="status">
					<div id="score" class="score">0</div>
					<div id="lives" class="lives">0</div>
					<div id="waves" class="waves">0/0</div>
					<div id="statusBarEmpty"><div id="statusBarLeft"> </div><div id="statusBarFill"> </div><div id="statusBarRight"> </div></div>
				</div>
				<div class="fps"></div>
				
			  <div class="rank" id="rank">
			    <img src=""/>
			  </div>
			  <div class="rankName" id = "rankName">${Config.rank}</div>
				
				<div class="start">	<div class = "startText"> </div></div>
				<div class="towers">
				
				</div>
				<div id="towerInfo" class="towerInfo">
					<p>
					<b style="font-size:14px">
					Click on a tower to view its info
					</b>
					</p>
				</div>
				<div class="controls">
					<div class="sound on"></div>
					<div class="like"></div>
					<!--div class="subscribe"></div-->
					<div class="bookmark"></div>
				</div>
					<textarea id='wavesTemplate' style='display:none'>
						<div id="incomingWaves">
						{for wave in Config.waves}
							<div class='wave'>
								{for creep in wave}
									<div class='creep' style ="width :${100/wave.length}%">
										<center><img src='images/intro/creeps/${creep.category.underscore()}.png'></img></center>
									</div>															  
								{/for}
							</div>										
						{/for}		
					</div>
				</textarea>
				<div id =container>	
				</div>

				<div class="superWeapons">
				</div>
				<div class="superWeaponsOff">
				</div>			
			</div>
			<canvas id="droppingGround" width="672" height="480"></canvas>
			<div id="static" style="display:none"></div>
			<div id="result" style="display:none">
			  <div class="statusDiv" id="winDiv">
			    <img src="" id="winImage"/>
  			  <img id="youWin" src="" class="statusImage">
			  </div>
			  <div class="statusDiv" id="loseDiv">
			    <img src="" id="loseImage" />
  			  <img id="youLose" src="" class="statusImage">
			  </div>
				<pre id="stats"></pre>
				<div id="playAgain">
				</div>
				<div id="exit">
				</div>				
			</div>
			<div id="splashScreen" style="display:none">
				<div class="loading_bar_bg">
					<div id="loading_bar">
					</div>
				</div>
			</div>
			<div id="waitScreen"></div>
		</div>		
