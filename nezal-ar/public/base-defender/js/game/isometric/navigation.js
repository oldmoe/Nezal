var Navigation = Class.create({
 	map : null,
  initialize : function(map){
    this.map = map;
		if (!$('dragDiv')) {
			this.dragDiv = $(document.createElement('DIV'));
			this.dragDiv.id = "dragDiv";
			this.dragDiv.setStyle({
				width: document.body.clientWidth + "px",
				height: document.body.clientHeight + "px",
				"z-index": 100000,
				position: "absolute",
				top: 0,
				left: 0,
				display: "none",
				//backgroundColor: "red",
				opacity: 0.5
			});
			document.body.appendChild(this.dragDiv);
			this.attachMapDraggableEvent();
			this.attachTouchEvents();
		}
  	},
	attachTouchEvents : function(){
		var self = this
		this.map.div.observe('touchstart',function(e){
			var x = e.pointerX() || e.touches[0].pageX 
			var y = e.pointerY() || e.touches[0].pageY
			 e.preventDefault();
			 Map.mouseIsDown = true
			 Map.mouseLocation = {x:x, y:y}
		});
		
		document.body.observe('touchend',function(e){
			e.preventDefault();
			Map.mouseIsDown = false
			if(Map.dragged){
				self.dragDiv.hide()
				Map.dragged = false;
			}
		});
		
		document.body.observe('touchmove',function(e){
			var x = e.pointerX() || e.touches[0].pageX 
			var y = e.pointerY() || e.touches[0].pageY
			e.preventDefault();
			if(Map.mouseIsDown){
        		$("building-panel").hide();
			 	self.dragDiv.show()
				Map.dragged = true
				var dx = x - Map.mouseLocation.x;
				var dy = y - Map.mouseLocation.y;
				Map.move( -dx, -dy);
				var xLoc = Map.x;
				var yLoc = Map.y;
				Map.mapMirror.mirrorMove(xLoc,yLoc);
				Map.mouseLocation = {x:x, y:y}
			}
		})
	},
	attachMapDraggableEvent : function(){
		var self = this
		this.map.div.observe('mousedown',function(e){
			 Map.mouseIsDown = true
			 Map.mouseLocation = {x:e.pointerX(), y:e.pointerY()}
		});
		
		document.body.observe('mouseup',function(e){
			Map.mouseIsDown = false
			if(Map.dragged){
				self.dragDiv.hide()
				Map.dragged = false;
			}
		});
		
		self.dragDiv.observe('mouseout',function(e){
			if (Map.dragged) {
		  	Map.mouseIsDown = false
		  	Map.dragged = false
		  	self.dragDiv.hide()
	  	}				
		})
		
		document.body.observe('mousemove',function(e){
			if(Map.mouseIsDown){
        $("building-panel").hide();
			 	self.dragDiv.show()
				Map.dragged = true
				var dx = e.pointerX() - Map.mouseLocation.x;
				var dy = e.pointerY() - Map.mouseLocation.y;
				//console.log(dx);
				//console.log(dy);
				Map.move( -dx, -dy);
				var xLoc = Map.x;
				var yLoc = Map.y;
				//google doesn't call this
				Map.mapMirror.mirrorMove(xLoc,yLoc);
				Map.mouseLocation = {x:e.pointerX(), y:e.pointerY()}
			}
		})
	}
});