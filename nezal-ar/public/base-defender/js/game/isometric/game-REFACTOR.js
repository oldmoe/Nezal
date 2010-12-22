var Game={
	speedFactor : 1,
	init : function(){
		Map.init()
		Map.drawMap()
		this.registerHandlers()
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addCreep(Math.round(Math.random()*500),Math.round(Math.random()*500))
		Map.addMine(Math.round(Math.random()*500)+100,Math.round(Math.random()*500)+100)
		Map.addMine(Math.round(Math.random()*500)+100,Math.round(Math.random()*500)+100)
		Map.addMine(Math.round(Math.random()*500)+100,Math.round(Math.random()*500)+100)
		Map.addMine(Math.round(Math.random()*500)+100,Math.round(Math.random()*500)+100)
		Map.addMine(Math.round(Math.random()*500)+100,Math.round(Math.random()*500)+100)
		Game.runGame()
		Game.createMenu()
	},
	createMenu : function(){
		/*		this.div = $(document.createElement('DIV'))
		$('gameCanvas').appendChild(this.div)
		this.div.addClassName('DomSprite')
		this.img = img
		*/

	},
	registerHandlers : function(){
		$$('#gameElements div').each(function(div){
			div.observe('click',function(){Game.select(div.id)})
		});
		$('clickCanvas').observe('click',function(e){
				//Map.addMine(e.layerX,e.layerY)
				
				for(var i=0;i<Map.objects.length;i++){
					if(e.layerX)Map.moveObject(Map.objects[i],Math.round(Math.random()*500),Math.round(Math.random()*500))
					else Map.moveObject(Map.objects[i],Math.round(Math.random()*500),Math.round(Math.random()*500))
				}
		})
		$('clickCanvas').observe('mousemove',function(e){
				Map.hovered(e.layerX,e.layerY)
		})
	},
	select : function(name){
		console.log(name)
	},
	runGame : function(){	
		//Map.doDrawMap()
		Map.objects.invoke('tick')
		setTimeout(function(){Game.runGame()},25)
	},
	MoveLeft : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x-100,Map.objects[0].y)
	},
	MoveRight : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x+100,Map.objects[0].y)
	},
	MoveUp : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x,Map.objects[0].y-100)
	},
	MoveDown : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x,Map.objects[0].y+100)	
	},
	MoveUR : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x+100,Map.objects[0].y-100)
	
	},MoveUL : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x-100,Map.objects[0].y-100)
	
	},
	MoveDR : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x+100,Map.objects[0].y+100)
	
	},
	MoveDL : function(){
		Map.moveObject(Map.objects[0],Map.objects[0].x-100,Map.objects[0].y+100)
	}
	
	
}
document.observe('dom:loaded',function(){
	Game.init()	
})
