var AdManager = Class.create({
	
	initialize : function(object, format, count, delay){
		this.object = $(object)
		this.format = format
		this.count = count
		this.delay = delay || 10000
		this.run();
	},
	
	run : function(){
		var self = this;
		var image = new Image
		image.src = "../images/ads/"+(Math.round(Math.random()*this.count)+2)+this.format+".png"
		image.onload = function(){
			self.object.innerHTML = ""
			self.object.appendChild(image)
			window.setTimeout(function(){self.run()}, self.delay)
		}
	}
	
})