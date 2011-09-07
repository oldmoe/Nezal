UltrasDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    var images = ['ultras_white_walk.png','ultras_red_walk.png','ultras_normal_walk.png']
    this.characterImg = Loader.images.characters[images.random()];
  }
})
