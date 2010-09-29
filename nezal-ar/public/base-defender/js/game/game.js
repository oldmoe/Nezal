var Game = Class.create({
  network : null,
  gameStatus : null,
  scene : null,
  gameData : null,
  userData : null,
  
  initialize : function(){
    this.network = new Network();
    this.scene = new BaseDefenderScene();
  },
  
  start : function(){
    var thisScene = this.scene;
    thisScene.groundLayer = new Layer($('gameBackground').getContext('2d'));
    thisScene.layers.push(thisScene.groundLayer);
    
    this.gameStatus = this.network.initializeGame();
    this.userData = JSON.parse(this.gameStatus.user_data.metadata);
    this.gameData = JSON.parse(this.gameStatus.game_data.metadata);
    
    thisScene.map = this.userData["map"];
    thisScene.navigation.blocks.vertical = thisScene.map.length;
    thisScene.navigation.blocks.horizontal = thisScene.map[0].length;
    
    new Loader().load([{images : thisScene.textures, path: 'images/', store: 'textures'}],
      {onFinish : function(){thisScene.render();}
    });
    
    //Just triggering a null move to disable the top and left navigation triggers
    this.scene.navigation.move(0,0);
    
  }
});