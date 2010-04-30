Game.fireSuperWeapon = function(weapon){
	if(!Game.playing || Game[weapon+'Disabled'] || Game.superWeapons[weapon].used == Game.superWeapons[weapon].max ) return
	Game[weapon+'Disabled'] = true
	Game.superWeapons[weapon].used++
	Game.push(0, Game[weapon])
	var div = $$('#gameElements .superWeapons div.'+weapon)[0]
	div.setOpacity(0);
	if(Game.superWeapons[weapon].used < Game.superWeapons[weapon].max){
		Game.initTimeout(div, weapon+'Disabled', 1000 / Game.delay)
	}
}

Game.nuke = function(){
	Game.allCreeps().each(function(creep){
		creep.takeHit(Math.round(creep.hp * 1));
		Game.animations.push(new NukeBoom($('gameForeground').getContext('2d'), 320, 240))
	})
}

Game.weak = function(){
	Game.animations.push(new Weak())
	Game.push(500, Game.unWeak)
	var count = 0
	var weak = function(){
		Game.allCreeps().each(function(creep){creep.takeHit(creep.maxHp * 0.1);})
		count++
		if(count < 10){ Game.push(50, weak) }
	}
	Game.push(50, weak)
}

Game.unWeak = function(){
	var index = -1
	Game.animations.each(function(animation, i){
		if(index == -1 && animation.type == 'weak'){
			index = i
		}
	})
	Game.animations.splice(index, 1)
}

Game.splash = function(){
	var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
	var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
	Game.allCreeps().sort(function(a,b){
		return b.hp - a.hp
	}).slice(0,10).each(function(creep){
		Game.objects.push(new PatriotRocket(creep.canvas, 0, 0,  {theta: 0, targetUnit : creep, x : x, y : y, power: 2000, speed: 15}))
	})
}

Game.heal = function(){
	Game.turrets.each(function(tower){
		tower.hp = tower.maxHp
		Game.animations.push(new HealAnimation(tower.ctx, tower.x, tower.y - 43))
	})
}

Game.hyper = function(){
	var hyper = function(tower){
		tower.rate *= Game.superWeapons.hyper.factor;
	}
	Game.turrets.each(hyper)
	Game.push(30000 / Game.delay, Game.unHyper)
	Game.towerMutators.push({name : 'hyper', action : hyper})
}

Game.unHyper = function(){
	Game.turrets.each(function(tower){
		tower.rate /= Game.superWeapons.hyper.factor;
	});
	var index = -1
	Game.towerMutators.each(function(mutator, i){
		if(index == -1 && mutator.name == 'hyper'){
			index = i
		}
	})
	Game.towerMutators.splice(index, 1)
}