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
			<h4>${tower.name}</h4>
			<b>${tower.targets}<br/>${tower.facilities}</b>
			<table>
				<tr>
					<th>Power</th>
					<td>: ${values.power}</td>
				</tr>
				<tr>
					<th>HP</th>
					<td>: ${values.hp}</td>
				</tr>
				<tr>
					<th>Rate</th>
					<td>: ${values.rate}</td>
				</tr>
				<tr>
					<th>Range</th>
					<td>: ${values.range}</td>
				</tr>
				<tr>
					<th>Price</th>
					<td>: $${values.price}</td>
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
			<div id= "popup">
					<img src='images/background/pop_up.png'/>
					<div id = "content"></div>
					<div id = "rankImg"> </div>
					<div id = "popupClose" onclick = "$('popup').hide()"> </div>
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
				<div class="upgrades">
					<div class="upgradesBar">
						<div id="nextUpgrade" class="upgrade next">
							<div id="upgradePrice"></div>						
						</div>
						<div id="currentUpgrade" class="upgrade current">
							<div class="purchased"></div>
						</div>
						<div class="arrow"></div>
					</div>
					<div class="upgradeItems">
					</div>
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
