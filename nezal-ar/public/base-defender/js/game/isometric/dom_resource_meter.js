var DomResourceMeter = Class.create(DomMeterSprite, {
	 initialize: function($super, owner, properties){
	 	this.emptyImg = null
		this.fullImg = null
		properties = properties || {}
		this.orientation = properties['orientation'] = 'vertical'
		this.width = 18
		this.height = properties['height']= 67
		this.meterFunc = properties['meterFunc'] || this.owner.getMeterFunc()
		this.hideWhenFull = properties['hideWhenFull']
		this.domSpriteInitialize(owner, properties);
		this.emptyImg = properties.emptyImg.clone()
		this.fullImg = properties.fullImg.clone()
    	this.emptySpan = $(document.createElement('DIV'));
		this.emptySpan.appendChild(this.emptyImg)
		this.fullSpan = $(document.createElement('DIV'));
    this.fullImg.style.position = 'absolute'
		this.fullSpan.appendChild(this.fullImg)
		this.fullSpan.style.position = "absolute"
		this.fullSpan.style.overflow = "hidden"
		this.div.appendChild(this.emptySpan);
    	this.div.appendChild(this.fullSpan); 
	 },
	 domSpriteInitialize : function(owner,properties){
	 	properties = properties || {}
	    this.createDiv();
	    this.div.addClassName('DomSprite');
			if(properties.divClass)this.div.addClassName(properties.divClass)
	    this.owner = owner;
		var z =0 ;
		if(properties.zIndex){
			z = properties.zIndex
			this.zIndex = z
		}  
		else var z = this.owner.coords.y + this.owner.zdim
	    this.div.setStyle ({zIndex :(z)});
			if(properties.width)this.div.style.width = properties.width + "px";
	    else this.div.style.width = this.owner.imgWidth + "px";
			if(properties.height)this.div.style.height = properties.height + "px";
	    else this.div.style.height =  this.owner.imgHeight + "px";
	    Object.extend( this, properties );
	 },
	 setMeterStyle : function(){
	  var height = this.getMeterLength()
		this.fullSpan.setStyle({height:height+"px",width:this.width+"px", top:this.height-height+"px"})
		this.fullImg.setStyle({top:(height - this.height)+"px"})																
	 }
  	
})