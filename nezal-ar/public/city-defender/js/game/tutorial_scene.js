var TutorialScene = Class.create(DisplayScene, {
	initialize : function($super,config,delay,baseCtx,upperCtx,replay){
		$super(config,delay,baseCtx,upperCtx,replay)
		_gaq.push(['_trackEvent', 'Tutorial', 'started tutorial', navigator.userAgent]);
		this.splash.factor1 = 1;
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
			_gaq.push(['_trackEvent', 'Tutorial', 'completed wave 1', navigator.userAgent]);
			this.push(120,function (){game.tutorial.initiateSuperWeapon()})
		}
		else if (this.waveNumber == 3){
			_gaq.push(['_trackEvent', 'Tutorial', 'completed wave 2', navigator.userAgent]);
			game.tutorial.upgradeTower()	
		}
		else if (this.waveNumber == 4){
			_gaq.push(['_trackEvent', 'Tutorial', 'completed wave 3', navigator.userAgent]);
			game.tutorial.planesAttack()
		}
		else if (this.waveNumber == 5){
			
		}
		$super(wave)
	},
	end : function (status){
		game.started = false
		game.tutorial.wishLuck()
		Sounds.gameSounds.game[0].togglePause()
		_gaq.push(['_trackEvent', 'Tutorial', 'Finished tutorial', navigator.userAgent]);
	},
	uploadScore : function(win,callback){
		callback()
	},
	
	showHintMsg : function(msg){
	}
})
