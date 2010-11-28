var BaseDefenderScene = Class.create(Scene, {
  game: null,
  x: 0,
  y: 0,
  width : 760,
  height : 550,
  groundLayer : null,
  buildingsLayer : null,
  map : [],
  landmarks : new Hash({"grass" : 0, "water" : 1, "rock" : 2, "iron" : 3}),
  icons : ["worker.png", "iron.png", "rock.png"],
  textures : [],  
  navigation : null,
  _LocationLookup : {},
  
  registerLocation : function(blockX, blockY, building){
    this._LocationLookup[blockX + "" + blockY] = building;
  },
  
  lookupLocation : function(blockX, blockY){
    return this._LocationLookup[blockX + "" + blockY];
  },
  
  initialize : function($super, game){
    $super();
    this.game = game;
    var self = this;
    this.landmarks.each(function(x,y){
      self.textures.push(x[0] + ".png");
    });
    this.navigation = new Navigation(this);
  },
  
  xBlock : function(){
    return Math.floor(this.x / this.navigation.blockSize);
  },
  
  yBlock : function(){
    return Math.floor(this.y / this.navigation.blockSize);
  },
  
  render : function(){
    this._clearCanvas(this.buildingsLayer);
    this._clearCanvas(this.groundLayer);
    this._RenderMap();
    this._RenderBuildings();
    
    this.renderGamePanel();
  },
  
  _RenderBuildings : function(){
    BuildingFactory.RegistryIterator(function(building){
      building.render();
    })
  },
  
  _RenderMap : function(){
    var nav = this.navigation
    
    var mapX = Math.floor(this.x / nav.blockSize);
    var mapY = Math.floor(this.y / nav.blockSize);
    var diffX = this.x % nav.blockSize;
    var diffY = this.y % nav.blockSize;
    
    
    var sceneSeenYBlocks = Math.ceil(this.height/nav.blockSize);
    var sceneSeenXBlocks = Math.ceil(this.width/nav.blockSize);
    if(sceneSeenXBlocks+mapX == nav.blocks.horizontal)
        sceneSeenXBlocks--
    
    for(var j=0; j < sceneSeenYBlocks; j++){
      for(var i = 0; i < sceneSeenXBlocks + 1; i++){
        var textureIndex = this.map[j+mapY][i+mapX];
        var textureImageName = this.textures[textureIndex];
        var blockTexture = Loader.images.textures[textureImageName];
        //console.log(i+mapX);
        if(this.landmarks.get('iron') == textureIndex || this.landmarks.get('rock') == textureIndex)
          this.groundLayer.ctx.drawImage(Loader.images.textures['grass.png'], i*nav.blockSize-diffX, j*nav.blockSize-diffY)
          
        this.groundLayer.ctx.drawImage(blockTexture, i*nav.blockSize-diffX, j*nav.blockSize-diffY)
        
        //this.groundLayer.ctx.strokeRect(i*nav.blockSize-diffX, j*nav.blockSize-diffY, 32, 32)
      }
    }
  },
  
  //This function assumes that the layer is full, covering the whole game scene
  _clearCanvas : function(layer){
    layer.ctx.clearRect(0, 0, this.width, this.height);
  },
  
  renderGamePanel : function(){
    $('rock-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(this.game.resources.rock, this.game.quarryFactory.rockPerMinute);
    $('iron-amount').innerHTML = this.game.templatesManager.resourceAmountInGamePanel(this.game.resources.iron, this.game.mineFactory.ironPerMinute);
    $('workers-amount').innerHTML = this.game.workerFactory.idleWorkers + ' / ' + this.game.workerFactory.workers;
    $('coins-amount').innerHTML = this.game.user.coins;
  }
  
});