var GameReplay = {
   flipMap: function(map){
          var mapFlipped = [];
          for(var i=0; i< map[0].length; i++)
          {
              mapFlipped[i] = [];
          }
          for( var i=0; i< map.length; i++)
          {
              for(var j = 0 ; j < map[i].length; j++)
              {
                  mapFlipped[j][i] = map[i][j];
              }
          }
    return mapFlipped
  },
  assignConfig : function(game){
		var inputNames = ["Belcher","Reaper","Exploder","Patriot"]
		var replacement = ["Turret","DoubleTurret","RocketLauncher","Patriot"]
		var upgradeValues = ["maxHp","power","range","rate","price"]
    
		for(var i=0;i<inputNames.length;i++){
			var ind = Config.towers.indexOf(inputNames[i])
			if(ind!=-1){
				Config.towers[ind] = replacement[i]
				var values = JSON.parse(game.gameData.towers[inputNames[i]].upgrades)
				var upgrades = []
				upgradeValues.each(function(upgradeValue){
						eval(replacement[i]).prototype[upgradeValue] = values[0][upgradeValue]
				})
				eval(replacement[i]).prototype.maxRank = Config.towerUpgrades[inputNames[i]]-1
				for(var j=1;j<values.length;j++){
					var value = values[j]
					var upgrade = {}
					upgradeValues.each(function(upgradeValue){
						upgrade[upgradeValue] = value[upgradeValue]
					})
					upgrades.push(upgrade)
				}
				eval(replacement[i]).prototype.upgrades = upgrades
			}
		}
		var weaponValues = game.gameData.weapons
		Config.superWeapons.each(function(weapon){
      var upgrades = JSON.parse(weaponValues[weapon].upgrades)
			eval(weapon).prototype.factor1 = upgrades[Config.weaponUpgrades[weapon]-1].factor1
			eval(weapon).prototype.factor2 = upgrades[Config.weaponUpgrades[weapon]-1].factor2
			eval(weapon).prototype.cooldown = upgrades[Config.weaponUpgrades[weapon]-1].cooldown
		})
	},
  create_scene: function(result,level,replay,gameMetadata,userMetadata){
    window={}
    Config = {}
    var game = GameReplay.prepareConfig(result,level,gameMetadata,userMetadata)
	Config.waves = Config.waves.reverse()
    GameReplay.assignConfig(game)
    development = true
    Map.bgGrid = Config.map
    Map.entry = Config.mapEntry
    Map.init()
    this.scene = new CityDefenderScene(Config,33,replay) 
    this.scene.start()
    //this.scene.sendWave(Config.waves.pop())
    this.run_scene()
    return this.scene.score
  },
  run_scene:function(){
    while(this.scene.reactor.running){
      this.scene.reactor.tick();
    }
  },
  prepareConfig : function(mission,level,gameMetadata,userMetadata){
     var replayGame = {}    
     replayGame.gameData = gameMetadata;
     for(var i in replayGame.gameData.towers)
     {
        replayGame.gameData.towers[i].upgrades = replayGame.gameData.towers[i].upgrades;
     }
     for(var i in replayGame.gameData.weapons)
     {
        replayGame.gameData.weapons[i].upgrades = replayGame.gameData.weapons[i].upgrades;
     }
     replayGame.userData = {};
     replayGame.userData["metadata"] = userMetadata;
      var towers = [], towerUpgrades={};
      for( var j in replayGame.userData.metadata.towers)
      {
          towers.push(j);
          towerUpgrades[j] = replayGame.userData.metadata.towers[j]['upgrades'];
      }
      var weapons = [], weaponUpgrades={};
      for( var j in replayGame.userData.metadata.weapons)
      {
          weapons.push(j);
          weaponUpgrades[j] = replayGame.userData.metadata.weapons[j]['upgrades'];
      }
      Config.towers = towers;
      Config.towerUpgrades = towerUpgrades;
      Config.weaponUpgrades = weaponUpgrades;
      Config.superWeapons = weapons;
      Config.level = level
      Config.waves = mission.waves
      Config.exp = 0
      Config.coins = 0
      Config.map = mission.map
	  Config.map = GameReplay.flipMap(Config.map)
      Config.mapEntry = mission.mapEntry
     return replayGame;
  } 
}
