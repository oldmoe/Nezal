Game.images = {};
Game.loadedImages = 0;
Game.totalImages = 0
Game.animationFrames = {
	coins : new Array(13),
	nuke : new Array(20),
	creepBoom : new Array(17),
	heal : new Array(17)
};


function onloadImage(){
	Game.loadedImages++;
	$('loading_bar').style.width = ''+(Math.round(Game.loadedImages/Game.totalImages)*100)+'%'
	if(Game.loadedImages == Game.totalImages) {
		$('gameElements').style.visibility = 'visible'
		$('canvasContainer').style.visibility = 'visible'
		window.setTimeout(function(){Effect.Fade('splashScreen')},1000)
	}
}

function loadImage(src){
	var image = new Image();
	image.onload = onloadImage;
	image.src = src
	return image
}

var images = [
		      'air_craft.png', 
              'air_craft_shade.png',
              'air_craft_in_action.png',
              'cannon_1.png',
              'cannon_2.png',
              'cannon_1_in_action.png',
              'cannon_2_in_action_right.png',
              'cannon_2_in_action_left.png',
              'humvee_body.png',
              'humvee_tower.png',
              'humvee_tower_in_action.png',
              'rocket.png',
              'rocket_in_action.png',
              'rocket_launcher.png',
              'tank_tower_in_action.png',
              'tank_1_tower_in_action.png',
              'tank_2_tower_in_action.png',
              'tank_body.png',
              'tank_tower.png',
              'tank_1_2_body.png',
              'tank_1_tower.png',
              'tank_2_tower.png',
              'tower_base.png',
			  'patriot_launcher.png',
			  'patriot_launcher_in_action_right.png',
			  'patriot_launcher_in_action_left.png',
			  'patriot_rocket.png',
			  'weak.png',
			  'rank_1.png',
			  'rank_2.png',
			  'rank_3.png'
             ]


//Game.imagesDir = '/city-defender/images/game/'
//Game.animationFramesDir = '/city-defender/images/animations/'
Game.imagesDir = 'images/game/'
Game.animationFramesDir = 'images/animations/'

Game.totalImages = images.length 
for(var anim in Game.animationFrames){
	Game.totalImages += Game.animationFrames[anim].length
}

function loadFrames(anim, dir){
	var count = Game.animationFrames[anim].length
	Game.animationFrames[anim] = []
	for(var i=0; i<count;i++){
		Game.animationFrames[anim].push(loadImage(Game.animationFramesDir+dir+'/'+(i+1)+'.png'))
	}
}
loadFrames('heal', 'health_point')
loadFrames('creepBoom', 'creep_boom')
loadFrames('nuke', 'nuke_boom')
loadFrames('coins', 'coins')

for ( var  i=0 ; i< images.length ; i++ ){ 
  Game.images[images[i]] = loadImage(Game.imagesDir + images[i]); 
} 

                                                    


