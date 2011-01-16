var TowerImages = {
	loadBelcher : function(rank){
		var images = {}
		this.images.base = [Loader.images.game['tower_base_'+rank+'.png']]
		this.images.cannon = [Loader.images.game['belcher_'+rank+'.png']]
		this.images.fire = [Loader.images.game['belcher_'+rank+'_inaction.png']]
		this.images.ranks = [null,Loader.images.game['rank_1.png'], Loader.images.game['rank_2.png'], Loader.images.game['rank_3.png']]
	},
	loadReaper : function(rank){
	
	},
	loadExploder : function(rank){
	
	},
	loadPatriot : function(rank){
	
	}
}
	