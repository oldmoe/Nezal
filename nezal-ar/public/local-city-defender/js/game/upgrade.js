var UpgradeData = {
	selectedUpgrade : null,
	bullets : {
	affects : [Turret, DoubleTurret],
	list: [
		{ price : 0, classes : ['bullets_1'], effect : {}},
		{ price : 120, classes: ['bullets_2'], effect : {rate : 1.5}}
	]},
	rockets : {
	affects : [RocketLauncher, Patriot],
	list: [
		{ price : 0, classes : ['rockets_1'], effect : {}},
		{ price : 120, classes: ['rockets_2'], effect : {power : 1.5}}	
	]},
	shields : {
	affects : [Turret, DoubleTurret, RocketLauncher, Patriot],
	list: [
		{ price : 0, classes : ['shields_1'], effect : {}},
		{ price : 120, classes: ['shields_2'], effect : {maxHp : 1.5, hp : 1.5}}
	]}
}

var Upgrades = {
	init : function(){
		this.data = clone_obj(UpgradeData)
		this.selectDefault()
	},

	selectDefault : function(){
		$$('#gameElements .upgrades .upgradeItem.bullets')[0].addClassName('selected');
		Upgrades.data.selectedUpgrade = Upgrades.data['bullets']		
	},
	
	select : function(){
		if(this.id == null || this.id == '') return
		$$('#gameElements .upgrades .upgradeItem').invoke('removeClassName', 'selected')
		this.addClassName('selected')
		Upgrades.data.selectedUpgrade = Upgrades.data[this.id]
	},
	
	upgrade: function(){
		var item = Upgrades.data.selectedUpgrade
		if(!item || Game.money < item.list[1].price) return
		item.list.shift()
		Game.money -= item.list[0].price
		item.affects.each(function(tower){
			var values = Game.config.towers.find(function(t){return t.category == tower}).values
			for(p in item.list[0].effect){
				//tower.prototype[p] = Math.round(tower.prototype[p] * item.list[0].effect[p] * 100)/100
				if(values[p]){
					values[p] = Math.round(values[p] * item.list[0].effect[p] * 100)/100
					// we need to update existing towers as well
					Game.turrets.each(function(t){
						if(t.constructor == tower){
							t[p] = Math.round(t[p] * item.list[0].effect[p] * 100)/100
						}
					})
				}
			}
		})
		$('towerInfo').innerHTML = ''
	},
	
	render : function(){
		if(Upgrades.data.selectedUpgrade){
			var item = Upgrades.data.selectedUpgrade
			$('currentUpgrade').className = "upgrade current active "+item.list[0].classes[0] 
			if(item.list[1]){
				if(Game.money < item.list[1].price){
					$('nextUpgrade').className = "upgrade next "+item.list[1].classes[0] + " off"
				}else{
					$('nextUpgrade').className = "upgrade next "+item.list[1].classes[0]
				}
				$('upgradePrice').innerHTML = '$'+item.list[1].price
			}else{
				$('nextUpgrade').className = "upgrade next blocked" 
				$('upgradePrice').innerHTML = ''
			}
		}
	}
}
