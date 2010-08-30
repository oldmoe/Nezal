var ImageLoader = {
	onfinish : null,
	loaded : false,	
	init : function(){
		if(window.location.protocol == 'file:'){
			Game.imagesDir = 'images/game/'
			Game.backgroundImagesDir = 'images/background/'
			Game.animationFramesDir = 'images/animations/'
		}else{
			Game.imagesDir = '/city-defender/images/game/'
			Game.backgroundImagesDir = '/city-defender/images/background/'
			Game.animationFramesDir = '/city-defender/images/animations/'
		}
		Game.animationFrames = {
			coins : new Array(13),
			nuke : new Array(20),
			creepBoom : new Array(17),
			heal : new Array(17)
		};
		Game.images = {};
		Game.bgImages = {};
		Game.upgradeImages= {};
		Game.loadedImages=0;
		var image = new Image
		var image2 = new Image
		var image3 = new Image
		image.onload = function(){
			image2.onload = function(){
				image3.onload = function(){
					$('waitScreen').hide();
					Effect.Appear('splashScreen');
					ImageLoader.loaded = true
				}
				image3.src =  Game.backgroundImagesDir+'loading_bar_up.png'
			}
			image2.src = Game.backgroundImagesDir+'loading_bar_down.png'
		}
		image.src = Game.backgroundImagesDir+'interface.png'
		ImageLoader.loadAllImages();	
	},

	onloadImage: function(){
		Game.loadedImages++;
		$('loading_bar').style.width = ''+(Math.round(Game.loadedImages/Game.totalImages*100))+'%'
		if(Game.loadedImages == Game.totalImages){
			$('gameElements').style.visibility = 'visible'
			$('canvasContainer').style.visibility = 'visible'
			window.setTimeout(function(){
				Effect.Fade('splashScreen')
				$('gameElements').show();
				$('canvasContainer').show();
				$('static').show();
				Effect.Fade('static',{duration: 2.0})
				if(ImageLoader.onfinish){
					ImageLoader.onfinish();
				}
			},1000)
		}
	},
	
	loadImage : function(src){
		var image = new Image();
		image.onload = ImageLoader.onloadImage;
		image.src = src
		return image
	},
	
	loadAllImages : function(){
		Game.totalImages = ImageLoader.images.length + ImageLoader.upgradeImages.length + ImageLoader.bgImages.length 
		
					
		for ( var  i=0 ; i< ImageLoader.images.length ; i++ ){		
		  ImageLoader.images[ImageLoader.images[i]] = ImageLoader.loadImage(Game.imagesDir + ImageLoader.images[i]); 
		} 
		for ( var  i=0 ; i< ImageLoader.bgImages.length ; i++ ){ 
		  ImageLoader.bgImages[ImageLoader.bgImages[i]] = ImageLoader.loadImage(Game.backgroundImagesDir + ImageLoader.bgImages[i]); 
		} 

		for ( var  i=0 ; i< ImageLoader.upgradeImages.length ; i++ ){ 
		  ImageLoader.upgradeImages[ImageLoader.upgradeImages[i].replace('.png','')] = ImageLoader.loadImage(Game.backgroundImagesDir + ImageLoader.upgradeImages[i]); 
		}	
	},
	images : [
		      'air_craft.png', 'air_craft_shade.png', 'air_craft_in_action.png', 'red_air_craft.png', 'red_air_craft_in_action.png',
              'cannon_1.png', 'cannon_2.png', 'cannon_1_in_action.png', 'cannon_2_in_action_right.png','cannon_2_in_action_left.png',
              'humvee_body.png','humvee_tower.png','humvee_tower_in_action.png',
              'rocket.png','rocket_in_action.png','rocket_launcher.png',
              'tank_body.png','tank_tower.png','tank_tower_in_action.png',
              'black_tank_body.png','black_tank_tower.png','black_tank_tower_in_action.png',
              'red_tank_body.png','red_tank_tower.png','red_tank_tower_in_action.png',
              'tank_1_body.png','tank_1_tower.png','tank_1_tower_in_action.png',
              'tank_2_body.png','tank_2_tower.png','tank_2_tower_in_action.png',
              'tower_base.png',
			  'patriot_launcher.png','patriot_launcher_in_action_right.png','patriot_launcher_in_action_left.png','patriot_rocket.png',
			  'weak.png',
			  'rank_1.png','rank_2.png','rank_3.png'
             ],
	
	upgradeImages : [
			  'arrow.png',
              'block_upgrade.png', 
              'bullets_upgrade_1.png','bullets_upgrade_2.png','bullets_upgrade_2_off.png',
              'rockets_upgrade_1.png','rockets_upgrade_2.png','rockets_upgrade_2_off.png',
              'shields_upgrade_1.png','shields_upgrade_2.png','shields_upgrade_2_off.png',
              'purchased_stamp.png',
			  'rocket_launcher_button.png',
			  'bullets_upgrade_button.png',
			  'rockets_upgrade_button.png',
			  'shields_upgrade_button.png',
			  'upgrade_button_inactive.png'
			 ],
	bgImages : [
			  'l_shape.png', 
              'win.png',
              'lose.png',
              'path.png',
              'play_again.png',
              'exit.png',
              'pause.png',
              'start.png',
              'resume.png',
              'path.png',
			  'snow.gif',
			  'heal_button.png',
			  'heal_button_off.png',
			  'splash_button.png',
			  'splash_button_off.png',
			  'nuke_button.png',
			  'nuke_button_off.png',
			  'hyper_button.png',
			  'hyper_button_off.png',
			  'weak_button.png',
			  'weak_button_off.png',
			  'tower_1_button.png',
			  'tower_2_button.png',
			  'mystry_button.png',
			  'patriot_button.png',
			  'status_bar.png'
             ]
}
