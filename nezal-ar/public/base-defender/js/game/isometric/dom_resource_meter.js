var DomResourceMeter = Class.create(DomMeterSprite, {
	 initialize: function($super, owner, properties){
		properties = properties || {}
		this.orientation = properties['orientation'] = 'vertical'
		this.width = 7
		this.height = properties['height']= 85
		this.meterFunc = properties['meterFunc'] || this.owner.getMeterFunc()
		this.hideWhenFull = properties['hideWhenFull']
    	this.emptySpan = $(document.createElement('DIV'));
		this.emptySpan.appendChild(properties.emptyImg.clone())
		this.fullSpan = $(document.createElement('DIV'));
		this.fullSpan.appendChild(properties.fullImg.clone())
		this.fullSpan.style.position = "absolute"
		this.domSpriteInitialize(owner, properties);
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
	 }	
})