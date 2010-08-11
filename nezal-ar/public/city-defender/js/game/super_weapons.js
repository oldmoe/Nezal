game.fireSuperWeapon = function(weapon){
	if( game.superWeapons[weapon].used == game.superWeapons[weapon].max ) return
	game[weapon+'Disabled'] = true
	game.superWeapons[weapon].used++
	game.scene.push(0, game[weapon])
	var div = $$('#gameElements .superWeapons div.'+weapon)[0]
	div.setOpacity(0);
	
	if(game.superWeapons[weapon].used < game.superWeapons[weapon].max){
		game.scene.push(div, weapon+'Disabled', 1000 / game.delay)
	}
}

game.nuke = function(){
	game.scene.creeps.each(function(creep){
		creep.takeHit(Math.round(creep.hp * 1));
	})
	var anim = new NukeBoom(320, 240)
	game.scene.objects.push(anim)
	game.scene.rocketsLayer.attach(anim)
}

game.weak = function(){
	var anim = new Weak()
	game.scene.objects.push(anim)
	game.scene.rocketsLayer.attach(anim)
	game.scene.push(500, game.unWeak)
	var count = 0
	var weak = function(){
		game.scene.creeps.each(function(creep){creep.takeHit(creep.maxHp * 0.1);})
		count++
		if(count < 10){ game.scene.push(50, weak) }
	}
	game.scene.push(50, weak)
}

game.unWeak = function(){
	var index = -1
	game.scene.objects.each(function(animation, i){
		if(index == -1 && animation.type == 'weak'){
			index = i
		}
	})
	game.scene.objects.splice(index, 1)
}

game.splash = function(){
	var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
	var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
	Sounds.play(Sounds.turret.rocketLaunch)
	Sounds.play(Sounds.turret.rocketLaunch)
	game.scene.creeps.sort(function(a,b){
		return b.hp - a.hp
	}).slice(0,10).each(function(creep){
		game.scene.objects.push(new PatriotRocket(0, 0,  {theta: 0, targetUnit : creep, x : x, y : y, power: 2000, speed: 15}))
	})
}

game.heal = function(){
	game.scene.turrets.each(function(tower){
		tower.hp = tower.maxHp
		var anim = new HealAnimation(tower.x, tower.y - 43)
		game.scene.objects.push(anim)
		game.scene.rocketsLayer.attach(anim)
	})
}

game.hyper = function(){
	var hyper = function(tower){
		tower.rate *= game.superWeapons.hyper.factor;
	}
	game.scene.turrets.each(hyper)
	game.scene.push(30000 / game.delay, game.unHyper)
	//game.towerMutators.push({name : 'hyper', action : hyper})
}

game.unHyper = function(){
	game.scene.turrets.each(function(tower){
		tower.rate /= game.superWeapons.hyper.factor;
	});
	var index = -1
	/*
	game.towerMutators.each(function(mutator, i){
		if(index == -1 && mutator.name == 'hyper'){
			index = i
		}
	})
	game.towerMutators.splice(index, 1)
	*/
}