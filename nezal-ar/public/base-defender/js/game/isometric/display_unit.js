var DisplayUnit = Class.create( {
	coords : {},
	angle : 0,
  initialize : function(coords, img){
  	this.coords.x = coords[0]
		this.coords.y = coords[1]
		this.imgWidth = img.width
		this.imgHeight = img.height
		//console.log("imgwidth and height",img.width,img.height)
		this.sprite = new DomSprite(this, img);
		this.sprite.render()
  }
});