Game.fireSuperWeapon = function(weapon){
	if(!Game.playing || Game[weapon+'disabled'] || Game.superWeapons[weapon].used == Game.superWeapons[weapon].max ) return
	Game[weapon+'disabled'] = true
	Game.superWeapons[weapon].used++
	Game.push(0, Game[weapon])
	var div = $$('#gameElements .superWeapons div.'+weapon)[0]
	div.setOpacity(0);
	if(Game.superWeapons[weapon].used < Game.superWeapons[weapon].max){
		Game.initTimeout(div, weapon+'disabled', 1000 / Game.delay)
	}
}

Game.nuke = function(){
	Game.allCreeps().each(function(creep){
		creep.takeHit(Math.round(creep.hp * 1));
		Game.animations.push(new NukeBoom($('gameForeground').getContext('2d'), 320, 240))
	})
}

Game.slow = function(){
	Game.slowed = true;
	wave.creeps.each(function(creep){
		creep.speed = creep.speed / Game.slowFactor;
	})	
}

Game.splash = function(){
	var x = [0, Map.width * Map.pitch - 1][Math.round(Math.random())]
	var y = [0, Map.height * Map.pitch - 1][Math.round(Math.random())]
	Game.allCreeps().sort(function(a,b){
		return b.hp - a.hp
	}).slice(0,9).each(function(creep){
		Game.objects.push(new PatriotRocket(creep.canvas, 0, 0,  {theta: 0, targetUnit : creep, x : x, y : y, power: 2000, speed: 15}))
	})
}

Game.heal = function(){
	Game.turrets.each(function(tower){
		tower.hp = tower.maxHp
		Game.animations.push(new HealAnimation(tower.ctx, tower.x, tower.y - 43))
	})
}

Game.slow = function(){
	Game.turrets.each(function(tower){
		tower.hp += Math.round(tower.maxHp / 2)
		if(tower.hp > tower.maxHp){
			tower.hp = tower.maxHp
		}
		Game.animations.push(new HealAnimation(tower.ctx, tower.x, tower.y - 43))
	})
}

Game.hyper = function(){
	Game.turrets.each(function(tower){
		tower.rate *= 8;
	});
	Game.push(30000 / Game.delay, Game.unhyper)
}

Game.unhyper = function(){
	Game.turrets.each(function(tower){
		tower.rate /= 2;
	});
	Game.hypered = false;
}

Game.unslow = function(){
	Game.creeps.each(function(creep){
		creep.rate *= 2;
		creep.speed *= 2;
	});
	Game.planes.each(function(plane){
		plane.rate *= 2;
		plane.speed *= 2;
	});
	Game.slowed = false;
}