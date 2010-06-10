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
		this.object.innerHTML = "<img src='../images/ads/"+(Math.round(Math.random()*this.count-1)+2)+this.format+".png' />"
		window.setTimeout(function(){self.run()}, this.delay)
	}
	
})