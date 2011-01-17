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
			{if tower.canHitGround}
				<img id="tankSilhouette" src = ${Loader.images.game['tank_silhouette.png'].getAttribute('data')} />
			{/if}
			{if tower.canHitFlying}
				<img id="planeSilhouette" src=${Loader.images.game['plane_silhouette.png'].getAttribute('data')} />
			{/if}
			</div>
			<div id="towerData">
			{if tower.display !=null }
          <img id="sellImg" src="${Loader.images.background['sell_button.png'].getAttribute('data')}" onmousedown = "game.scene.sellSelectedTower()"/>
					<div id = "sellTower" onmousedown = "game.scene.sellSelectedTower()"><h4>${window.Text.game.towerInfo.sell}</h4><hr/><div id="sellValue">$${Math.round(tower.price*0.75*tower.hp/tower.maxHp)}</div></div>
					{else}
						<div id = "towerPrice">$${tower.price}</div>
					{/if}
				<div id="towerName"><h4>${Text.intro.towers[tower.name].name}</h4></div>
			<table>
				<tr>
					<td><div class='meter' id = 'powerMeter' style="width:${Math.round(60 * tower.power / 420)}px;backgroundColor:blue">${window.Text.game.towerInfo.power}</div>
					<div class='meterExtension'></div>
				</td>
				</tr>
				<tr>
					<td><div class='meter' id = 'shieldsMeter' style="width:${Math.round(60 * tower.hp / 10000)}px;backgroundColor:blue">${window.Text.game.towerInfo.shield}</div></td>
				</tr>
				<tr>
					<td><div class='meter' id = 'rateMeter' style="width:${Math.round(60 * tower.rate / 1)}px;backgroundColor:blue">${window.Text.game.towerInfo.rate}</div></td>
				</tr>
				<tr>
					<td><div class='meter' id = 'rangeMeter' style="width:${Math.round(60 * tower.range / 6)}px;backgroundColor:blue">${window.Text.game.towerInfo.range}</div></td>
				</tr>
			</table>
				{if tower.display !=null }
					{if tower.rank < tower.maxRank}
					<div id = "upgradeTower" onmousedown = "game.scene.upgradeSelectedTower()">${window.Text.game.towerInfo.upgrade}
						<span id="upgradeWord" style="color:white;display:block;">$${tower.upgrades[tower.rank].price}&nbsp; &nbsp;${tower.rank+1} مستوى</span>
					</div>
						{if tower.upgradable}
							<img id="upgradeImg" src="${Loader.images.background['upgrade_button.png'].getAttribute('data')}" onmousedown = "game.scene.upgradeSelectedTower()"/>
						{else}
							<img id="upgradeImg" src="${Loader.images.background['upgrade_button_off.png'].getAttribute('data')}"/>
						{/if}
					{else}
					<div id = "upgradeTower" >
						<div id = "maxUpgrade" style = "paddingTop:10px bgcolor="grey">المستوى الأقصى</div>
					</div>
					<img id="upgradeImg" src="${Loader.images.background['upgrade_button_off.png'].getAttribute('data')}"/>
					{/if}
				{/if}
			</div>
		</table>
		{else}
		{/if}
		</textarea>
		<div id="gameContainer">
			<div id="modalWindow" style="display:none">
				<div id="character">
				</div>
				<div class="content"> 
					<div class="innerContent">
					</div>
				</div>
				<div id = "ok">
					<img id="rogerImage" src="images/intro/ready.png"/>
					<span id='rogerText'></span>
				</div>
			</div>
			<div id= "pauseWindow" style="display:none">	</div>
			<div id= "popup" style="display:none">
					<div id = "congratsContent"></div>
					<div id = "promotedContent"></div>
					<div id = "rankImg"> </div>
					<div id = "popupClose" onclick = "$('popup').hide()"> </div>
					<div id="popupOk" class="clickableButton" ">
						<div class="text"> Ok </div>
					</div>
			</div>
			<div id="canvasContainer" style="display:none">
				<canvas id="gameBackground" width="736" height="480" style="position:absolute;top:0px;left:0px"></canvas>
				<canvas id="gameForeground" width="736" height="480" style="position:absolute;top:0px;left:0px"></canvas>
			</div>
			<div class="status">
				<div id="statusBarEmpty">
				</div>
				<div id="score" class="score">0</div>
				<div id="lives" class="lives">0</div>
				<div id="waves" class="waves">0/0</div>					
			</div>
			<div id="snapshotWindow" style="display:none;">
				<img id="snapshot" src =""/>
				<div id="save">save</div>
				<div id="share">share</div>
				<div id="close"></div>
				<img id="background" src =""/>
			</div>
			<div id="gameElements" style="display:none">
				<div id='gameMenu' style="display:none;">
					<div id="gameResume" class="button"><div class='buttonTextContainer'><div id="resumeText" class='buttonText'>Resume</div></div></div>
					<div id="gameReset" class="button"><div class='buttonTextContainer'><div id="resetText" class='buttonText'>Reset</div></div></div>
					<div id="gameExit" class="button"><div class='buttonTextContainer'><div id="exitText" class='buttonText'>Exit</div></div></div>
				</div>
				<div id="money">
					0
				</div>
				<div class="fps"></div>
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
				<div class="sound controls on"></div>
				<div class="music controls on"></div>
				<div class="snapshot controls"></div>
					<textarea id='wavesTemplate' style='display:none'>
						<div id="incomingWaves">
						{for wave in Config.waves}
							<div class='wave'>
								{for creep in wave}
									<div class='creep' style ="width :${100/wave.length}%">
										<center><img src="${Loader.images.intro['creeps/'+creep.category.underscore()+'.png'].getAttribute('data')}"></img></center>
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
			<canvas id="droppingGround" width="672" height="480" style="position:absolute;top:0px;left:0px"></canvas>
			<div id="static" style="display:none"></div>
			<div id="result" style="display:none;"></div>
			<textarea id='resultTemplate' style="display:none">
					<img src="${Loader.images.intro['paper.png'].getAttribute('data')}"/>
					<img id="resultCoin" src="${Loader.images.background['coin.png'].getAttribute('data')}"/>
					<div id="replay" onclick="game.scene.replayScene()" style="display:none;"></div>
					<div id="coins">
						<div id="coinsWord">${Text.game.result.coins}</div>
						<div id="coinsValue">0</div>
					</div>
					<div id="score">
						<div id="scoreWord">${Text.game.result.score}</div>
						<div id="scoreValue"></div>
					</div>
					<div id="win">
						<img id="resultBlank" src="${Loader.images.intro['blank.png'].getAttribute('data')}"/>
						<img id="winClouds" src="${Loader.images.background['win_clouds.png'].getAttribute('data')}"/>
						<img id="winCenter" src="${Loader.images.background['win_center.png'].getAttribute('data')}"/>
						<img id="twoCannons" src="${Loader.images.intro['logo.png'].getAttribute('data')}"/>
					</div>
					<div id="lose" >
						<img id="loseClouds" src="${Loader.images.background['lose_clouds.png'].getAttribute('data')}"/>
						<img id="loseCenter" src="${Loader.images.background['lose_center.png'].getAttribute('data')}"/>
					</div>
					<div id="resultText">
						<pre id="stats"></pre>
					</div>
					<div id="playAgain">${Text.game.result.playAgain}</div>
					<div id="exit">${Text.game.result.exit}</div>
			</textarea>
			<div id="splashScreen" style="display:none">
				<div class="loading_bar_bg">
					<div id="loading_bar">
					</div>
				</div>
			</div>
		</div>		
