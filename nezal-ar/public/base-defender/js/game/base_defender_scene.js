var BaseDefenderScene = Class.create(Scene, {
  x: 0,
  y: 0,
  width : 760,
  height : 550,
  groundLayer : null,
  buildingsLayer : null,
  map : [],
  landmarks : new Hash({"grass" : 0, "water" : 1, "rock" : 2, "iron" : 3}),
  icons : ["worker.png", "iron.png", "rock.png"],
  textures : null,  
  navigation : null,
  
  initialize : function($super, game){
    $super(game);
		this.panel = new GamePanel(game);
    this.map = Map;
		this.rawMap = this.game.user.data["map"];
		this.map.clear();
		this.map.init(this);
		this.createRenderLoop('animations', 1);
		this.createRenderLoop('info', this.reactor.everySeconds(1));
		this.pushInfoDisplay(this.panel)
  },
	
	pushAnimation : function(object){
		this.pushToRenderLoop('animations', object)
	},
	
	pushInfoDisplay : function(object){
		this.pushToRenderLoop('info', object)		
	},
	//ex {'i' : 5, 'j' : 6}
	renderDisplayUnit : function(coords, terrainType){
		var textureImageName = this.textures[terrainType];
		var blockTexture = Loader.images.textures[textureImageName];
		new DisplayUnit(coords, blockTexture);
	},
  
  //render : function(){
    //this.renderGamePanel();
  //},
  
  _RenderBuildings : function(){
    BuildingFactory.RegistryIterator(function(building){
      building.render();
    })
  },
  
  adjustNeighborScene : function(){
    $('game-panel').hide();
    if(this.game.selectedBuildingPanel){
      this.game.selectedBuildingPanel.hide();
    }
    $('building-remaining-time').hide();
  },
  
  _FormatResourceDisplay : function(amount){
    var amount = Math.floor(amount) + "";
    var part = amount.length % 3;
    var splits = [];
    if(part != 0) splits = [amount.substr(0, part)];
    for(var i=part; i<amount.length; i+=3){
        splits.push( amount.substr(i, 3) );
    }
    return splits.join(",");
  }
  
});
BaseDefenderScene.prototype.textures = BaseDefenderScene.prototype.landmarks.map(function(x,y){ return x[0] + ".png"; })