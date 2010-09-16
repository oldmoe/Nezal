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
			<div class="diagram ${tower.cssClass}"></div>
			<div id="towerData">
			<h4>$${values.price}</h4>
			<b>${tower.targets}<br/>${tower.facilities}</b>
			<table>
				<tr>
					<td><div class='meter' style="width:${Math.round(65 * values.power / 300)}px;backgroundColor:blue">Power</div>
					<div class='meterExtension'></div>
</td>
				</tr>
				<tr>
					<td><div class='meter' style="width:${Math.round(65 * values.hp / 2500)}px;backgroundColor:blue">Shields</div></td>
				</tr>
				<tr>
					<td><div class='meter' style="width:${Math.round(65 * values.rate / 1)}px;backgroundColor:blue">Rate</div></td>
				</tr>
				<tr>
					<td><div class='meter' style="width:${Math.round(65 * values.range / 6)}px;backgroundColor:blue">Range</div></td>
				</tr>
			</table>
			</div>
		</table>
		</textarea>
		<div id="gameContainer">
			<div id="modalWindow" style="display:none">
				<div id="character">
				</div>
				<div class="content" style="overflow:auto"> 
				
				</div>
				<div id = "ok">
				<img src="images/tutorial/ok.png"></img>
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
				<img src="images/background/interface.png"></img>
				<div class="loading_bar_bg">
					<img src="images/background/loading_bar_down.png"></img>
					<div id="loading_bar">
					<img src="images/background/loading_bar_up.png"></img>
					</div>
				</div>
			</div>
			<div id="waitScreen"></div>
		</div>		
