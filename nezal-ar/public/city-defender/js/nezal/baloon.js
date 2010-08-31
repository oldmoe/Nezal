var Baloon = Class.create(Sprite,{
	x : 0,
	y : 0,
	
	initialize : function(){
		this.parent = $('gameElements');
	    this.div = document.createElement('div');
	    var divIdName = 'baloon';
	    this.div.setAttribute('id',divIdName);
		this.div.style.position = 'absolute';
		var img = document.createElement("IMG");
		img.src = "images/game/baloon1.png";
		this.text = document.createElement("div"); 
		this.text.innerHTML = "TEEET"
		this.text.style.position = "absolute"
		img.style.position = "relative"
		this.text.style.top = 5;this.text.style.left = 3
		img.style.top = 0;img.style.left = 0
		this.div.appendChild(img)
		this.div.appendChild(this.text)
		this.parent.appendChild(this.div);
		this.div.hide()
	},
	render : function(ctx){
		if(!this.visible){$('baloon').hide(); return}
		$('baloon').show()
		$('baloon').style.left = this.x
		$('baloon').style.top = this.y
	},
	destroy : function ($super){
		$super()
		this.parent.removeChild(this.div)
	}
})