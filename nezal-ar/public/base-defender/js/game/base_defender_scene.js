var BaseDefenderScene = Class.create(Scene, {
  x: 0,
  y: 0,
  width : 760,
  height : 550,
  groundLayer : null,
  map : [],
  
  navigation : null,
  
  textures : ['grass.png', 'water.png', 'rock.png', 'iron.png'],
  
  initialize : function($super){
    $super();
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