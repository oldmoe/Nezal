var SalafiDisplay=Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['salafi_walk.png'];
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 9})
  },
})
