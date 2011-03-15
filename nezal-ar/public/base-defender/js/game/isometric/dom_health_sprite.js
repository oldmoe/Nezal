var DomHealthSprite = Class.create(DomSprite, {
  healthWidth : 80,
	healthHeight : 7,
	
  initialize : function($super, owner, properties){
    $super(owner, properties);
		if (properties) {
			if (properties.healthWidth) 
				this.healthWidth = properties.healthWidth
			if (properties.healthHeight) 
				this.healthHeight = properties.healthHeight
		}
    this.maxHpSpan = $(document.createElement('SPAN'));
		this.hpSpan = $(document.createElement('SPAN'));
		this.div.appendChild(this.maxHpSpan);
    this.div.appendChild(this.hpSpan);
		this.hpSpan.addClassName('healthSpan');
		this.maxHpSpan.addClassName('healthSpan');
		this.maxHpSpan.setStyle({'position':'absolute'
													, height:this.healthHeight+"px"
													, width:this.healthWidth+"px"
													,background:"red"});
		this.hpSpan.setStyle({'position':'absolute'
													, height:this.healthHeight+"px"
													, width:Math.round(this.owner.hp*this.healthWidth/this.owner.maxHp)+"px"
													,background:"green"});
		this.div.style.width = this.healthWidth + "px";													
  },
  
  render : function($super){
    $super();
		if (this.owner.hp == this.owner.maxHp) {
			this.div.hide()
			return 
		}
		this.div.show()
    try{
      if(this.owner.dead){
        return this.destroy();
      }
      this.div.setStyle({left : this.owner.coords.x -Math.round(this.healthWidth/2)+this.shiftX + "px",
                         top : this.owner.coords.y -Math.round(this.owner.imgHeight/2)+this.shiftY + "px",
                         zIndex : this.owner.coords.y});
  		this.maxHpSpan.setStyle({width:this.healthWidth+"px"})
			this.hpSpan.setStyle({width:Math.round(this.owner.hp*this.healthWidth/this.owner.maxHp)+"px"})
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  }
})
