var Game = Class.create({
	creepsCount : 0,
	initialize : function(delay){
		Map.init();
	},
	start : function(){
		this.config = Nezal.clone_obj(Config)
		this.scene = new CityDefenderScene(this.config,50,this.ctx,this.topCtx);
		this.scene.start();
	}
});

var game = new Game()
$(document).observe('dom:loaded',function(){
		$$("canvas").each(function(canvas){
			canvas.width = Map.width * Map.pitch
			canvas.height = Map.height * Map.pitch
		})
		window.setTimeout(function(){
			var bg = $('gameBackground');
			var bgctx = bg.getContext('2d') 
			bgctx.fillStyle = "rgb(100,250,100)";
			var fg = $('gameForeground');
			var top = $('droppingGround')
			top.getContext('2d')//.globalAlpha = 0.5
			game.canvas = fg
			game.ctx = fg.getContext('2d')
			game.topCtx = top.getContext('2d')
			
		GhostTurret = new Turret(0, 0, ghostTurretFeatures)
			game.start();
			$$('#gameElements .upgrades .upgrade.next').invoke('observe', 'click', Upgrades.upgrade)	
			$$('#gameElements .upgrades .upgradeItem').invoke('observe', 'click', Upgrades.select)			
			$$('.towers div').invoke('observe','click', GhostTurret.select)
			//$$('.towers div').invoke('observe','mouseover', GhostTurret.showInfo)
			$$('#gameElements .start').first().observe('click', function(){game.scene.startAttack()})
			$$('#gameElements .superWeapons div').each(function(div){ 
				if(div.className != ''){div.observe('click', function(){game.scene.fire(div.className)})}
			})
			Upgrades.selectDefault();
		}, 200)
		
})
