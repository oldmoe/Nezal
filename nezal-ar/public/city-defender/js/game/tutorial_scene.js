var TutorialScene = Class.create(CityDefenderScene, {
	initialize : function($super,config,delay,baseCtx,upperCtx){
		$super(config,delay,baseCtx,upperCtx)
		$$('#gameElements .superWeapons div').each(function(div){ 
	//			div.hide()
		})
		
	},
	addCreep : function($super,creep){
		if (this.waveNumber == 2){
			creep.hp = creep.maxHp = 80
		}else{
			creep.hp = creep.maxHp = 20
		}
		$super(creep)
	},
	addPlane : function($super,plane){
		plane.hp = plane.maxHp = 20
		$super(plane)
	},
	sendWave : function($super,wave){
		if(this.waveNumber == 1){
		
		}
		else if (this.waveNumber == 2){
			game.tutorial.waveEffect()
		}
		else if (this.waveNumber == 3){
				
		}
		else if (this.waveNumber == 4){
			game.tutorial.planesAttack()
		}
		else if (this.waveNumber == 5){
			game.tutorial.wishLuck()
		}
		$super(wave)
	},
	uploadScore : function(win,callback){
		callback()
	}
})