var BaseDefenderScene = Class.create(Scene, {
  x: 0,
  y: 0,
  width : 760,
  height : 550,
  groundLayer : null,
  buildingsLayer : null,
  map : [],
  landmarks : new Hash({"grass" : 0, "water" : 1, "rock" : 2, "iron" : 3}),
  textures : [],  
  navigation : null,
  
  initialize : function($super){
    $super();
    var self = this;
    this.landmarks.each(function(x,y){
      self.textures.push(x[0] + ".png");
    });
    this.navigation = new Navigation(this);
  },
  
  render : function(){
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
        var blockTexture = Loader.images.textures[this.textures[this.map[j+mapY][i+mapX]]];
        //console.log(i+mapX);
        this.groundLayer.ctx.drawImage(blockTexture, i*nav.blockSize-diffX, j*nav.blockSize-diffY)
        this.groundLayer.ctx.strokeRect(i*nav.blockSize-diffX, j*nav.blockSize-diffY, 32, 32)
      }
    }
  }
  
});