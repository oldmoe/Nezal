var ImageLoader = {
	images : {},
	list : ['counter','shafee2', 'zareef', 'background', 'baloon_left', 'baloon_right', 'studio_logo', 'group_guide', 'dashboard_body_blank'],
	onprogress : null,
	onfinish : null,
	load : function(){
		this.done = 0
		var self = this;
		this.list.each(function(name, index){
			self.images[name] = new Image
			self.images[name].onload = function(){
				self.done++
				if(self.onprogress){
					self.onprogress(Math.round((self.done/self.list.length)*100))
				}
				if(self.done == self.list.length){
					if(self.onfinish){
						self.onfinish();
					}
				}
			}
			self.images[name].src = 'images/background/'+name+'.png'
		})
	}
	
}