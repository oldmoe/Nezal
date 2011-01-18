var Baloon = Class.create(Sprite,{
	x : 0,
	y : 0,
	
	initialize : function(num,owner){
		this.owner = owner
		this.parent = $('gameElements');
	    this.div = document.createElement('div');
			this.div.setOpacity(1)
	    var divIdName = 'baloon';
	    this.div.setAttribute('class',divIdName);
		this.div.style.position = 'absolute';
		var img = Element.clone(Loader.images.game["baloon"+num+".png"]);
		this.text = document.createElement("div"); 
		this.text.style.color = "white";
		this.text.style.position = "absolute"
		this.text.style.fontSize = "11px"
		this.text.style.fontWeight = "bold"
		this.text.style.paddingTop = "8px"
		this.text.style.width = "77px"
		this.text.style.textAlign = "center"
		img.style.position = "relative"
		this.div.style.left = this.owner.x+"px"
		this.div.style.top = this.owner.y+"px"
		this.text.style.top = "8px";this.text.style.left = "3px"
		img.style.top = 0;img.style.left = 0
		this.div.appendChild(img)
		this.div.appendChild(this.text)
		this.parent.appendChild(this.div);
	},
	render : function(ctx){
		if(!this.owner || this.owner.dead){
				return this.destroy()
		}
		this.div.style.left = this.owner.x+"px"
		this.div.style.top = (this.owner.y-70)+"px"
	},

	destroy : function ($super){
		if(this.div)
		this.parent.removeChild(this.div)
		$super()
	}
})
