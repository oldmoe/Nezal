//contains common important functions
var Util = {
	log : function(obj){
		if(console) console.log(obj)
	},
	
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
	radToDeg : function(rad){
		return rad * 180 / Math.PI
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
	},
	
	//gets the distances to move according to the speed
	//@x1,@y1 params : coordinates of the object
	//@x2,@y2 params : coordinates of the target
	//@speed param : speed of movement
	getNextMove : function(x1,y1,x2,y2,speed){
		if(x1==x2&&y1==y2) return [0,0,0]
		var distance = Util.distance(x1,y1,x2,y2)
		speed = Math.min(speed,distance)
		var tan = (y1 - y2)/(x1-x2);
		var angle = Math.atan(tan);
		var dy = Math.abs((speed * Math.sin(angle)));
		var dx = Math.abs((speed * Math.cos(angle)));
		var xDiff = x1-x2;
		var yDiff = y1-y2;
		if(xDiff>0)dx*=-1;
		if(yDiff>0)dy*=-1;
		var movements = new Array;
		movements[0] = dx;
		movements[1] = dy;
		movements[2] = angle
		return movements;
	},
	
	// determines whether two lines are intersected or not
	// @v1,@v2 the two lines ,  each line is represented of by points (x1,y1),(x2,y2) as [x1,y1,x2,y2] 
	lineIntersection : function(v1,v2){
		if(this.pointDirection([v1[0],v1[1]],v2)* this.pointDirection([v1[2],v1[3]],v2) <= 0
		&& this.pointDirection([v2[0],v2[1]],v1)* this.pointDirection([v2[2],v2[3]],v1) <= 0) return true
		return false
	 },
	 
	 // helper function to get the direction of a point to a line the returned number sign represents 
	 // the direction
	 pointDirection : function(p,line){
		var v1 = [line[0]-p[0],line[1]-p[1]]
		var v2 = [line[2]-p[0],line[3]-p[1]]
		return v1[0]*v2[1] - v2[0]*v1[1]
	 },
	 
	 //determines whether two isometric objects intersect or not
	 //@u1,@u2 params : two isometric objects each object o has o.x, o.y which are the center 
	 //of the base and o.imgWidth, o.imgHeight, o.zdim which are the dimesions of the object
	 
	 collision : function(u1,u2){
		var A = [u1.owner.coords.x,u1.owner.coords.y-u1.imgHeight/2+u1.zdim]
		var B = [u1.owner.coords.x-u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
		var C = [u1.owner.coords.x,u1.owner.coords.y+u1.imgHeight/2]
		var D = [u1.owner.coords.x+u1.imgWidth/2,u1.owner.coords.y+u1.zdim/2]
		
		var AB =  [A[0],A[1],B[0],B[1]]
		var BC =  [B[0],B[1],C[0],C[1]]
		var CD =  [C[0],C[1],D[0],D[1]]
		var DA =  [D[0],D[1],A[0],A[1]]
		
		var X = [u2.owner.coords.x,u2.owner.coords.y-u2.imgHeight/2+u2.zdim]
		var Y = [u2.owner.coords.x-u2.imgWidth/2,u2.owner.coords.y+u2.zdim/2]
		var Z = [u2.owner.coords.x,u2.owner.coords.y+u2.imgHeight/2]
		var W = [u2.owner.coords.x+u2.imgWidth/2,u2.owner.coords.y+u2.zdim/2]
		
		var XY =  [X[0],X[1],Y[0],Y[1]]
		var YZ =  [Y[0],Y[1],Z[0],Z[1]]
		var ZW =  [Z[0],Z[1],W[0],W[1]]
		var WX =  [W[0],W[1],X[0],X[1]]
		
		var v1 = [AB,BC,CD,DA]
		var v2 = [XY,YZ,ZW,WX]
		
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(Util.lineIntersection(v1[i],v2[j])) return true
			}
		}
		return false
	 },
	 distance : function(x1,y1,x2,y2){
		return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))
	 }
}

Array.prototype.random = function(){
	return this[Math.round(Math.random()*(this.length-1))]
}
Array.prototype.pushInPlaceDescending=function(obj,field){
	var index=0
	while(this[index]&&this[index][field] < obj[field]){
		index++
	}
	if(!this[index]) this.push(obj)
	else{
		for(var i=this.length;i>index-1;i--){
			this[i]=this[i-1]
		}
		this[index]=obj
	}
}

Array.prototype.pushInPlaceAscending=function(obj,field){
	var index=0
	while(this[index]&&this[index][field] > obj[field]){
		index++
	}
	if(!this[index]) this.push(obj)
	else{
		for(var i=this.length;i>index-1;i--){
			this[i]=this[i-1]
		}
		this[index]=obj
	}
}