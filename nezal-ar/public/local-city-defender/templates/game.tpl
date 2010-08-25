<div id="preload" style="display:none">
			<img src="/city-defender/images/background/interface.png" />
			<img src="/city-defender/images/background/loading_bar_down.png" />
			<img src="/city-defender/images/background/loading_bar_up.png" />
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
		<style>#gameContainer{ -moz-transform : scale(1) }</style>
		<script>window.scale = 1.0</script>
		<input type="button" value="-" onclick="window.scale -= 0.1; $('gameContainer').style.MozTransform = 'scale('+window.scale+')'"/>
		<input type="button" value="+" onclick="window.scale += 0.1; $('gameContainer').style.MozTransform = 'scale('+window.scale+')'"/>
		<div id="gameContainer">
			<div id="canvasContainer" style="display:none">
				<img src='images/background/path.png' />
				<canvas id="gameForeground" width="736" height="480" onmousemove = "movement(event)"></canvas>
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
				<div class="rank"></div>
				<div class="start"></div>
				<div class="towers">
					<div class="tower1" title="Basic"></div>
					<div class="tower2" title="Double"></div>
					<div class="rocketLauncher" title="Rocket Launcher"></div>
					<div class="patriot" title="Patriot Air Defense"></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
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
							<div id="bullets" class="upgradeItem bullets"></div>
							<div id="rockets" class="upgradeItem rockets"></div>
							<div id="shields" class="upgradeItem shields"></div>
							<div class="upgradeItem"></div>
							<div class="upgradeItem"></div>
							<div class="upgradeItem"></div>
							<div class="upgradeItem"></div>
							<div class="upgradeItem"></div>
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
					<div class="splash">
						<div id="splash"></div>
					</div>
					<div class="heal">
						<div id="heal"></div>
					</div>
					<div class="hyper">
						<div id="hyper"></div>
					</div>
					<div class="weak">
						<div id="weak"></div>
					</div>
					<div class="nuke">
						<div id="nuke"></div>
					</div>
				</div>
				<div class="superWeaponsOff">
					<div class="splash">
					</div>
					<div class="heal">
					</div>
					<div class="hyper">
					</div>
					<div class="weak">
					</div>
					<div class="nuke">
					</div>
				</div>			</div>
			<canvas id="droppingGround" width="672" height="480"></canvas>
			<div id="static" style="display:none"></div>
			<div id="result" style="display:none">
				<pre id="stats"></pre>
				<div id="playAgain"></div>
				<div id="exit"></div>				
			</div>
			<div id="splashScreen" style="display:none">
				<div class="loading_bar_bg">
					<div id="loading_bar"></div>
				</div>
			</div>
			<div id="waitScreen"></div>
		</div>		