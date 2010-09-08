var Baloon = Class.create(Sprite,{
	x : 0,
	y : 0,
	
	initialize : function(num){
		this.parent = $('gameElements');
	    this.div = document.createElement('div');
	    var divIdName = 'baloon';
	    this.div.setAttribute('id',divIdName);
		this.div.style.position = 'absolute';
		var img = Loader.images.game["baloon"+num+".png"].clone();
		this.text = document.createElement("div"); 
		this.text.style.position = "absolute"
		this.text.style.fontSize = "11"
		this.text.style.fontWeight = "bold"
		this.text.style.paddingTop = "2"
		this.text.style.textAlign = "center"
		img.style.position = "relative"
		this.text.style.top = 5;this.text.style.left = 3
		img.style.top = 0;img.style.left = 0
		this.div.appendChild(img)
		this.div.appendChild(this.text)
		this.parent.appendChild(this.div);
	},
	render : function(ctx){
		this.div.style.left = this.x
		this.div.style.top = this.y
	},
	destroy : function ($super){
		$super()
		if(this.div)
		this.parent.removeChild(this.div)
	}
})
