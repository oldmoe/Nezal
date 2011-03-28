var WorkerDisplay = Class.create(Display,{
  imgWidth : 64,
  imgHeight : 93,
  xdim : 64,
  ydim : 93,
  zdim : 70,
  initialize: function($super, owner, properties){
    $super(owner, properties);
    this.noOfXTiles = Math.ceil(this.xdim / Map.tileIsoLength);
    this.noOfYTiles = Math.ceil(this.ydim / Map.tileIsoLength);
    this.owner = owner;
    this.img = Loader.images.worker['worker.png'];
    this.shadowImg = Loader.images.worker['worker_shadow.png'];
    Object.extend(this.owner,this);
    this.sprites.worker = new DomImgSprite(owner, {img : this.img});
    this.sprites.shadow = new DomImgSprite(owner.shadow, {img : this.shadowImg}, {shiftY: 40, shiftX: 0});
  },
  
  render : function(){
    this.sprites.worker.currentAnimationFrame = Math.abs(this.owner.state)
    this.sprites.worker.render();
    this.sprites.shadow.render();
    var shadowWidth = (Math.abs(4-this.owner.state)+1)*5
    this.sprites.shadow.shiftX = 15 + (25 - shadowWidth)/2
    this.sprites.shadow.setImgWidth(shadowWidth)
  }
});
