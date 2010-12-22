//contains common important functions
var Nezal = {
	notImplemented : function(string){
		return function(){
			alert('Please implement ' + string)
		}
	},

	applyNotImpilemented : function(obj, name){
		for(i in obj){
			if(obj[i] == null){
				obj[i] = this.notImplemented(name+i)
			}
		}
	},
	
	degToRad : function(deg){
		return deg * Math.PI / 180
	},
	
	clone_obj : function(obj) {
		if (typeof obj !== 'object' || obj == null)return obj;
		var c = obj instanceof Array ? [] : {};
		for (var i in obj) {
			var prop = obj[i];
			if (typeof prop == 'object') {
			   if (prop instanceof Array) {
				   c[i] = [];
				   for (var j = 0; j < prop.length; j++) {
					   typeof prop[j] != 'object' ? c[i].push(prop[j]) : c[i].push(Nezal.clone_obj(prop[j]));
				   }
			   } else {
				   c[i] = Nezal.clone_obj(prop);
			   }
			} else {
			   c[i] = prop;
			}
		}
		return c;
	}				
}

Array.prototype.random = function(){
	return this[Math.floor(Math.random()*(this.length-1))]
}

Array.prototype.remove = function(element){
	return this.splice(this.indexOf(element), 1)
}
