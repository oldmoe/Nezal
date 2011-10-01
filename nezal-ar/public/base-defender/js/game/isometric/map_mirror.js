var MapMirror = Class.create({

monitorGlassTop: 498, monitorGlassLeft:31,
flag:1,

initialize: function(){
this.imgMirror = new Image;
this.imgMirror.src = "images/rec.png";
this.imgMirror.style.position = "absolute";
this.imgMirror.style.left = "38px";
this.imgMirror.style.top = "23px";
$("monitorGlass").appendChild(this.imgMirror);
var self = this;
$("monitorGlass").observe("click",function(e){self.onMirrorClick(e)});
$("monitorButton").observe("click",function(e){self.onButtonClick(e)});
},

onButtonClick: function(e){
	//console.log("button clicked");
	if(this.flag == 1)
		{
			
			new Effect.Move('monitor', { x: 10, y: 520, mode: 'absolute' });
			new Effect.Move('monitorGlass', { x: 31, y: 560, mode: 'absolute' });
			new Effect.Move('monitorButton', { x: 12, y: 522, mode: 'absolute' });
			this.flag = 0;
		}
	else if(this.flag == 0)
		{
			//console.log("ha3");
			new Effect.Move('monitor', {x:10, y:447, mode: 'absolute'});
			new Effect.Move('monitorGlass', { x: 31, y: 498, mode: 'absolute' });
			new Effect.Move('monitorButton', { x: 26, y: 449, mode: 'absolute' });
			this.flag = 1;
		}
},

/*monitorDown: function(e){

	if($("monitor").style.top < 520px)
	{
		$("monitor").style.top = ($("monitor").style.top + 2) +"px";
		setTimeout(this.monitorDown,1500);
	}
	else
	{
		this.flag = 0;
	}
},
monitorUp: function(e){
$("monitor").style.top = ($("monitor").style.top - 2) +"px";
},*/

onMirrorClick: function(e){
var x = e.pointerX()-this.monitorGlassLeft;
var y = e.pointerY()-this.monitorGlassTop;
var dx = ((x*13.21)-Map.viewWidth/2)- Map.x ;
var dy = ((y*15.7)-Map.viewHeight/2)- Map.y ;
// Conditions relative to monitorGlass sizes to keep the imgMirror in borders	
	if(x<19)
	{
		x=19;
	}
	else if (x>96)
	{
		x=96;
	}
	if(y<12)
	{
		y=12;
	}
	else if (y>58)
	{
		y=58;
	}

this.imgMirror.style.left = (x-19) +"px";
this.imgMirror.style.top = (y-12) +"px";

//console.log(this);
Map.move(dx,dy);

},

mirrorMove: function(dx,dy){
//alert("called");
var x = (dx/9.91);
var y = (dy/11.7);
//console.log(x);
//console.log(y);
this.imgMirror.style.left = x +"px";
this.imgMirror.style.top = y +"px";

},

scalingBuilding: function(){
var scale = 0.15;
for(var e in BuildingFactory._GlobalRegistry)
	{
		var clonedImage = BuildingFactory._GlobalRegistry[e].img.clone();
		var locX = BuildingFactory._GlobalRegistry[e].coords.x;
		var locY = BuildingFactory._GlobalRegistry[e].coords.y;
		this.scalingBuildingHelper(clonedImage,locX,locY);
	}
},

scalingBuildingHelper: function(clonedImage,locX,locY){
		var x = locX;
		var y = locY;
	//	console.log("done");
		clonedImage.setStyle({"width":"12px"});
		clonedImage.setStyle({"height":"12px"});
		clonedImage.style.position = "absolute";
		clonedImage.style.left = Math.round(x/13.21) +"px";
		clonedImage.style.top = Math.round(y/15.7) +"px";
		//console.log("done1");
		$("monitorGlass").appendChild(clonedImage);
		
}

});
